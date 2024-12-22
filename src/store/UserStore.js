import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/utils/supabase/client';
import { CommunicationStore } from './CommunicationStore';

const supabase = createClient();


export const UserStore =
    create(
        persist(
            (set, get) => ({

                profileData: {},
                setProfileData: (data) => { set({ profileData: data }) },

                oceanitesData: [],
                anchorsData: [],
                anchoringsData: [],

                oceaniteProfileData: {},
                setOceaniteProfileData: (data) => { set({ oceaniteProfileData: data }) },

                isProfileDataFetched: false,
                setIsProfileDataFetched: (state) => { set({ isProfileDataFetched: state }) },

                harborMatesData: [],
                anchoringsIds: [],

                GetUser: async () => {
                    const { data, error } = await supabase.auth.getUser();
                    if (data) return data?.user;
                },

                fetchProfileData: async () => {
                    const { data, error } = await supabase.auth.getUser();
                    set({ isProfileDataFetched: false });

                    try {
                        if (data?.user?.id) {
                            const { data: profile, error: profileError } = await supabase
                                .schema("Ocean")
                                .from("Profile")
                                .select()
                                .eq('user_id', data.user.id)
                                .single();

                            if (profileError) return console.log('Error to fetch Profile', profileError.message);

                            const { data: harborMates, error: harborMatesError } = await supabase
                                .schema('Ocean')
                                .from('Oceanites')
                                .select('*,anchoring_id(*),anchor_id(*)')
                                .or(`anchor_id.eq.${profile.id},anchoring_id.eq.${profile.id}`);

                            if (harborMatesError) return console.log('Error to fetch HarborMates', harborMatesError.message);

                            const harborMatesDetails = CommunicationStore.getState().communicatorDetails || {};

                            // Use a Set to track unique anchor IDs
                            const uniqueAnchoringsIds = new Set();

                            harborMates.forEach((harborMateData) => {
                                const data = profile.id === harborMateData.anchor_id.id
                                    ? harborMateData.anchoring_id
                                    : harborMateData.anchor_id;
                                const id = data?.id;

                                // Add to harborMatesDetails only if it's not already present
                                if (id && id !== profile.id) {
                                    if (harborMatesDetails[id]) {
                                        harborMatesDetails[id] = { ...harborMatesDetails[id], ...data };
                                    } else {
                                        harborMatesDetails[id] = data;
                                    }

                                    // Track unique IDs
                                    uniqueAnchoringsIds.add(harborMateData.anchoring_id.id);
                                }
                            });

                            // Convert Set back to array and include the profile ID if not already present
                            const ids = [...uniqueAnchoringsIds];
                            if (!ids.includes(profile.id)) {
                                ids.unshift(profile.id);
                            }

                            // Update communicator details
                            const updateCommunicatorDetails = CommunicationStore.getState().setCommunicatorDetails;
                            updateCommunicatorDetails({ ...CommunicationStore.getState().communicatorDetails, ...harborMatesDetails });

                            const filteredHarborMates = Object.values(harborMatesDetails);

                            set({
                                profileData: profile,
                                harborMatesData: filteredHarborMates,
                                anchoringsIds: ids
                            });

                            return profile;
                        }
                    } catch (error) {
                        console.log('Error in fetchProfileData:', error);
                    } finally {
                        set({ isProfileDataFetched: true });
                    }
                },


                updateOnlineStatus: async (isOnline) => {
                    const user = UserStore.getState().profileData;
                    if (user?.id) {
                        await supabase
                            .schema('Ocean')
                            .from('Profile')
                            .update({
                                is_online: isOnline,
                                last_active: isOnline ? new Date().toISOString() : null,
                            })
                            .eq('id', user.id);
                    }
                },

                // Subscribe to Profile Real-Time Updates
                subscribeToProfileChanges: (profileDataType) => {

                    const getUserId = (type) => {
                        switch (type) {
                            case 'oceanite-profile':
                                return get().oceaniteProfileData.user_id;
                            case 'user-profile':
                                return get().profileData.user_id;
                        }
                    }

                    // const user_id = await getUserId(profileDataType);
                    const user_id = getUserId(profileDataType);

                    if (user_id) {
                        const channel = supabase
                            .channel(`realtime:Profile:user:${user_id}`) // Unique channel for the user
                            .on(
                                'postgres_changes',
                                { event: 'UPDATE', schema: 'Ocean', table: 'Profile', filter: `user_id=eq.${user_id}` },
                                (payload) => {
                                    if (profileDataType === 'oceanite-profile') {
                                        set((state) => ({
                                            oceaniteProfileData: { ...state.oceaniteProfileData, ...payload.new },
                                        }));
                                    } else {
                                        set((state) => ({
                                            profileData: { ...state.profileData, ...payload.new },
                                        }));
                                    }
                                }
                            )
                            .subscribe();

                        return channel;
                    }
                },

                setupSubscriptionsForProfileData: async (profileDataType) => {
                    const { data, error } = await supabase.auth.getUser();

                    if (data?.user?.id && !error) {
                        const fetchProfile = async () => {
                            return await get().fetchProfileData(); // Fetch initial data
                        }
                        await fetchProfile();
                        const profileChannel = get().subscribeToProfileChanges(profileDataType); // Subscribe to user's profile changes

                        return () => {
                            if (profileChannel) profileChannel.unsubscribe(); // Cleanup subscription on unmount
                        };
                    }
                },

                subscribeToOnlineStatus: (user_id, setIsOnline) => {
                    if (!user_id) return; // Ensure a valid user ID is provided
                    const user = get().profileData;
                    if (user.id) {
                        const channel = supabase
                            .channel(`realtime:Profile:user:${user.id}:to:${user_id}`) // Unique channel for the user
                            .on(
                                'postgres_changes',
                                { event: 'UPDATE', schema: 'Ocean', table: 'Profile', filter: `id=eq.${user_id}` },
                                (payload) => {
                                    if (payload?.new?.is_online !== undefined) {
                                        setIsOnline(payload.new.is_online);
                                    }
                                }
                            )
                            .subscribe();

                        return () => {
                            if (channel) channel.unsubscribe()
                        }
                    }
                },

                CheckTakenUsernames: async (username) => {
                    try {
                        const { data, error } = await supabase.schema("Ocean").from('Profile').select('id').eq('username', username)

                        if (error || !data) {
                            console.log('Something Went Wrong : ', error);
                            return null;
                        } else if (data && data.length > 0) {
                            return true;
                        } else {
                            return false;
                        }
                    } catch (error) {
                        return console.log(error);
                    }
                },

                UpdateUsername: async (username) => {
                    const user = get().profileData
                    try {
                        const { error } = await supabase.schema("Ocean").from('Profile').update({ username }).eq('id', user.id)

                        if (error) {
                            console.log('Something Went Wrong : ', error);
                            return false;
                        } else {
                            return true;
                        }
                    } catch (error) {
                        return console.log(error);
                    }
                },

                CreateProfile: async (profileData) => {
                    const user = get().profileData;
                    try {
                        const { error } = await supabase.schema("Ocean").from('Profile').update({ ...profileData }).eq('id', user.id)

                        if (error) {
                            console.log('Something Went Wrong : ', error);
                            return null;
                        } else {
                            return true;
                        }
                    } catch (error) {
                        return console.log(error);
                    }
                },

                FileUploader: async (bucket, file) => {
                    try {

                        const generateUniqueFilename = (originalName) => {
                            const uniqueId = Math.random().toString(36).substring(2, 10); // Generate a random 8-character string
                            return `${uniqueId}_${originalName}`;
                        };

                        const uniqueFilename = generateUniqueFilename(file.name);

                        const { data, error } = await supabase.storage
                            .from(bucket)
                            .upload(`${uniqueFilename}`, file, {
                                cacheControl: "3600",
                                upsert: false,
                            });

                        if (error) {
                            return console.log("Error uploading file:", error.message);
                        }
                        // Retrieve the public URL of the uploaded image
                        const { data: { publicUrl } } = supabase.storage
                            .from(bucket)
                            .getPublicUrl(data.path);
                        return { path: data.path, url: publicUrl }

                    } catch (error) {
                        console.log(error);
                    }
                },

                UploadMedia: async (media, setMedia) => {
                    if (media.length === 0) return;

                    const uploadFile = media.map(async (fileData) => {
                        if (!fileData.file) return null; // Skip if no file

                        const FileUploader = get().FileUploader;

                        const uploadedFile = await FileUploader(
                            fileData.storageBucket,
                            fileData.file
                        );

                        return {
                            ...fileData,
                            path: uploadedFile?.path,
                            url: uploadedFile?.url,
                        };
                    });

                    const uploadedAllFiles = await Promise.all(uploadFile); // Wait for all uploads
                    setMedia(uploadedAllFiles); // Update state with uploaded paths/URLs
                    return uploadedAllFiles;
                },

                GetOceanites: async (page = 1, limit = 5) => {
                    try {

                        const getOceanitesCount = async () => {
                            const { count } = await supabase.schema("Ocean").from("Profile").select('*', { count: 'exact' });
                            return count;
                        }

                        const getOceanites = async (lastOceanite) => {
                            const offset = (page - 1) * limit;
                            const { data, error } = await supabase.schema('Ocean').from('Profile').select('*').range(offset, lastOceanite ? lastOceanite : (offset + limit - 1));
                            if (error || !data) {
                                return null;
                            }

                            if (page === 1) set({
                                oceanitesData: data, // Replace existing oceanites
                            })
                            else {
                                const existingOceanites = get().oceanitesData;
                                const newOceanites = data.filter(
                                    (oceanite) => !existingOceanites.some((existing) => existing.id === oceanite.id)
                                );

                                set({
                                    oceanitesData: [...existingOceanites, ...newOceanites], // Append new oceanites
                                });
                            }

                            return data;
                        }

                        const data = await getOceanites();

                        if (data.length === 0) {
                            const count = await getOceanitesCount();
                            const data = await getOceanites(count - 1);
                            return data;
                        }
                        return data;

                    } catch (error) {
                        console.log('error to fetch the oceanites', error);
                    }
                },

                SearchOceanites: async (page = 1, limit = 5, keywords) => {
                    try {

                        const getOceanitesCount = async () => {
                            const { count } = await supabase.schema("Ocean").from("Profile").select('*', { count: 'exact' }).or(`name.ilike.%${keywords}%,username.ilike.%${keywords}%`);
                            return count;
                        }

                        const getOceanites = async (lastOceanite) => {
                            const offset = (page - 1) * limit;
                            const { data, error } = await supabase.schema("Ocean")
                                .from('Profile') // Ensure this is the correct table name
                                .select('*')
                                .or(`name.ilike.%${keywords}%,username.ilike.%${keywords}%`)
                                .range(offset, lastOceanite ? lastOceanite : (offset + limit - 1));
                            if (error || !data) {
                                console.log('error', error);
                                return null;
                            }

                            if (page === 1) set({
                                oceanitesData: data, // Replace existing oceanites
                            })
                            else {
                                const existingOceanites = get().oceanitesData;
                                const newOceanites = data.filter(
                                    (oceanite) => !existingOceanites.some((existing) => existing.id === oceanite.id)
                                );

                                set({
                                    oceanitesData: [...existingOceanites, ...newOceanites], // Append new oceanites
                                });
                            }

                            return data;
                        }

                        const data = await getOceanites();

                        if (data?.length === 0) {
                            const count = await getOceanitesCount();
                            const data = await getOceanites(count - 1);
                            return data;
                        }
                        return data;

                    } catch (error) {
                        console.log('error to fetch the oceanites', error);
                    }
                },

                GetAnchors: async (page = 1, limit = 5) => {
                    try {

                        const getAnchorsCount = async () => {
                            const { count } = await supabase.schema("Ocean").from("Oceanites").select('*', { count: 'exact' }).eq('anchoring_id', get().profileData.id);
                            return count;
                        }

                        const getAnchors = async (lastAnchor) => {
                            const offset = (page - 1) * limit;
                            const { data, error } = await supabase.schema('Ocean').from('Oceanites').select('*, anchor_id(*)').eq('anchoring_id', get().profileData.id).range(offset, lastAnchor ? lastAnchor : (offset + limit - 1));
                            if (error || !data) {
                                return null;
                            }

                            if (page === 1) set({
                                anchorsData: data, // Replace existing oceanites
                            })
                            else {
                                const existingAnchors = get().anchorsData;
                                const newAnchors = data.map(
                                    (oceanite) => !existingAnchors.some((existing) => existing.id === oceanite.anchor_id.id) && oceanite.anchor_id
                                );

                                set({
                                    anchorsData: [...existingAnchors, ...newAnchors], // Append new oceanites
                                });
                            }


                            return data;
                        }

                        const data = await getAnchors();

                        if (data.length === 0) {
                            const count = await getAnchorsCount();
                            const data = await getAnchors(count - 1);
                            return data;
                        }
                        return data;

                    } catch (error) {
                        console.log('error to fetch the anchors', error);
                    }
                },

                GetAnchorings: async (page = 1, limit = 5) => {
                    try {

                        const getAnchoringsCount = async () => {
                            const { count } = await supabase.schema("Ocean").from("Oceanites").select('*', { count: 'exact' }).eq('anchor_id', get().profileData.id);
                            return count;
                        }

                        const getAnchorings = async (lastAnchoring) => {
                            const offset = (page - 1) * limit;
                            const { data, error } = await supabase.schema('Ocean').from('Oceanites').select('*, anchoring_id(*)').eq('anchor_id', get().profileData.id).range(offset, lastAnchoring ? lastAnchoring : (offset + limit - 1));
                            if (error || !data) {
                                return null;
                            }

                            if (page === 1) set({
                                anchoringsData: data, // Replace existing oceanites
                            })
                            else {
                                
                            const existingAnchorings = get().anchoringsData;
                            const newAnchorings = data.map(
                                (oceanite) => !existingAnchorings.some((existing) => existing.id === oceanite.anchoring_id.id) && oceanite.anchoring_id
                            );

                            set({
                                anchoringsData: [...existingAnchorings, ...newAnchorings], // Append new oceanites
                            });
                            }


                            return data;
                        }

                        const data = await getAnchorings();

                        if (data.length === 0) {
                            const count = await getAnchoringsCount();
                            const data = await getAnchorings(count - 1);
                            return data;
                        }
                        return data;

                    } catch (error) {
                        console.log('error to fetch the anchorings', error);
                    }
                },

                // SearchOceanites: async (keywords) => {
                //     try {
                //         const { data, error } = await supabase
                //             .from('Profile') // Ensure this is the correct table name
                //             .select('*')
                //             .or(`name.ilike.%${keywords}%,username.ilike.%${keywords}%`)
                //             .range(0, 9);

                //         if (error) return console.log('error to search user', error)
                //         set({ oceanitesData: [...data] });
                //         return data;
                //     } catch (error) {
                //         console.log('error to fetch the oceanites', error);
                //     }
                // },

                AnchorOceanite: async (anchoring_id) => {
                    const user = get().profileData;
                    const { data, error } = await supabase.schema('Ocean').from('Oceanites').insert({ 'anchor_id': user.id, anchoring_id }).select('*,anchoring_id(*)').single();
                    if (error) { console.log('Something went wrong to anchor the Oceanite', error); }

                    const updatedOceanitesData = get().oceanitesData.map((oceanite) => { if (oceanite.id === anchoring_id) return { ...oceanite, anchors: oceanite.anchors + 1 }; else return oceanite })

                    const harborMatesData = get().harborMatesData.filter(harborMate => harborMate.id !== data.anchoring_id.id);
                    set({ harborMatesData: [...harborMatesData, data.anchoring_id], anchoringsIds: [...get().anchoringsIds, data.anchoring_id.id], oceanitesData: updatedOceanitesData })


                    const updateCommunicatorDetails = { ...CommunicationStore.getState().communicatorDetails };

                    const newHarborMateId = data?.anchoring_id?.id;

                    if (newHarborMateId && newHarborMateId !== user.id) {
                        updateCommunicatorDetails[newHarborMateId] = {
                            ...(updateCommunicatorDetails[newHarborMateId] || {}),
                            ...data.anchoring_id
                        };
                    }

                    CommunicationStore.getState().setCommunicatorDetails(updateCommunicatorDetails);
                    return true;
                },
                UnAnchorOceanite: async (anchoring_id) => {
                    const user = get().profileData;
                    if (!user) return;

                    const { error } = await supabase.schema('Ocean').from('Oceanites').delete().eq('anchor_id', user.id).eq('anchoring_id', anchoring_id);
                    if (error) { console.log('Something went wrong to unanchor the Oceanite', error); return false; }

                    const updatedHarborMatesData = get().harborMatesData?.filter((data) => data.id !== anchoring_id) || [];

                    const updatedAnchoringsIds = get().anchoringsIds?.filter((anchoringId) => anchoringId !== anchoring_id) || [];

                    const updatedOceanitesData = get().oceanitesData?.map((oceanite) => { if (oceanite.id === anchoring_id) return { ...oceanite, anchors: oceanite.anchors - 1 }; else return oceanite }) || [];

                    set({ harborMatesData: updatedHarborMatesData, anchoringsIds: updatedAnchoringsIds, oceanitesData: updatedOceanitesData });

                    const updateCommunicatorDetails = CommunicationStore.getState().communicatorDetails || {};

                    if (updateCommunicatorDetails[anchoring_id]) {
                        delete updateCommunicatorDetails[anchoring_id]
                    }

                    // Update communicator details
                    const setCommunicatorDetails = CommunicationStore.getState().setCommunicatorDetails;
                    setCommunicatorDetails({ ...updateCommunicatorDetails });

                    return true;
                },

                SubscribeToAnchors: () => {
                    const user = get().profileData;

                    if (!user) return;

                    const channel = supabase.channel(`realtime:Anchors:user:${user.id}`).on(
                        'postgres_changes',
                        { event: '*', schema: 'Ocean', table: 'Oceanites', filter: `anchoring_id=eq.${user.id}` },
                        async (payload) => {
                            const { eventType } = payload;

                            if (eventType === 'INSERT') {

                                if (!payload.new.id) {
                                    return;
                                }

                                const { data, error } = await supabase.schema('Ocean').from('Oceanites').select('*,anchoring_id(*),anchor_id(*)').eq('id', payload.new.id).single();

                                if (error) {
                                    return;
                                }

                                set({ harborMatesData: [data.anchor_id, ...get().harborMatesData] });

                                const updateCommunicatorDetails = { ...CommunicationStore.getState().communicatorDetails };

                                const newHarborMateId = data?.anchor_id?.id;

                                if (newHarborMateId && newHarborMateId !== user.id) {
                                    updateCommunicatorDetails[newHarborMateId] = {
                                        ...(updateCommunicatorDetails[newHarborMateId] || {}),
                                        ...data.anchor_id
                                    };
                                }

                                CommunicationStore.getState().setCommunicatorDetails(updateCommunicatorDetails);
                            }
                            else if (eventType === 'DELETE') {


                                const updatedHarborMatesData = get().harborMatesData.filter((data) => data.id !== payload.old.id);

                                set({ harborMatesData: updatedHarborMatesData });

                            }
                        }
                    ).subscribe();

                    return channel;

                }



            })
            , {
                name: 'user-store', // Storage key in localStorage
                getStorage: () => localStorage, // You can replace with sessionStorage
            }
        )
    );