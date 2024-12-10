import { errorToast, successToast } from '@/components/ToasterProvider';
import { createClient } from '@/utils/supabase/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CommunicationStore } from './CommunicationStore';

const supabase = createClient();


export const UserStore =
    create(
        persist(
            (set, get) => ({

                profileData: {},
                setProfileData: (data) => { set({ profileData: data }) },

                oceanitesData: [],

                oceaniteProfileData: {},
                setOceaniteProfileData: (data) => { set({ oceaniteProfileData: data }) },

                isProfileDataFetched: false,
                setIsProfileDataFetched: (state) => { set({ isProfileDataFetched: state }) },

                harborMatesData: [],
                anchoringsIds: [],

                // Fetch Profile Data
                // fetchProfileData: async () => {
                //     const { data, error } = await supabase.auth.getUser();
                //     set({ isProfileDataFetched: false });
                //     try {
                //         if (data?.user?.id) {
                //             const { data: profile, error: profileError } = await supabase.schema("Ocean").from("Profile").select().eq('user_id', data.user.id).single();

                //             console.log('fetchProfileData', profile)

                //             if (profileError) return console.log('Error to fetch Profile', profileError.message);

                //             const { data: harborMates, error: harborMatesError } = await supabase.schema('Ocean').from('Oceanites').select('*,anchoring_id(*),anchor_id(*)').or(`anchor_id.eq.${profile.id},anchoring_id.eq.${profile.id}`);

                //             // console.log('fetched anchorings data', anchorings)

                //             if (harborMatesError) return console.log('Error to fetch Profile', harborMatesError.message);

                //             const harborMatesDetails = CommunicationStore.getState().communicatorDetails || {};

                //             const anchoringsIds = harborMates?.map((harborMateData) => {

                //                 const data = profile.id === harborMateData.anchor_id.id ? harborMateData.anchoring_id : harborMateData.anchor_id
                //                 const id = data?.id;

                //                 if (harborMatesDetails[id]) {
                //                     harborMatesDetails[id] = {
                //                         ...harborMatesDetails[id], ...data
                //                     }
                //                 } else if (id !== profile.id) {
                //                     harborMatesDetails[id] = data;
                //                 }

                //                 return harborMateData.anchoring_id.id;
                //             })

                //             const ids = anchoringsIds.filter((id) => id !== profile.id);

                //             const updateCommunicatorDetails = CommunicationStore.getState().setCommunicatorDetails;
                //             updateCommunicatorDetails(harborMatesDetails);

                //             set({
                //                 profileData: profile, harborMatesData: harborMates, anchoringsIds: ids.includes(profile.id) ? ids : [profile.id, ...ids]
                //             });

                //             return profile;
                //         }

                //     } catch (error) {
                //         return console.log(error);
                //     } finally {
                //         set({ isProfileDataFetched: true });
                //     }
                // },

                // Fetch Profile Data
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

                            console.log('fetchProfileData', profile);

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
                            updateCommunicatorDetails(harborMatesDetails);

                            const filterHarborMates = () => {
                                const uniqueHarborMates = []
                                harborMates?.forEach(harborMate => {
                                    uniqueHarborMates?.forEach(uniqueHarborMate => {
                                        if (harborMate?.anchoring_id?.id === profile.id) {
                                            if (uniqueHarborMate?.id !== harborMate?.anchor_id.id) uniqueHarborMates.push(harborMate.anchor_id)
                                        } else {
                                            if (uniqueHarborMate?.id !== harborMate?.anchoring_id.id) uniqueHarborMates.push(harborMate.anchor_id)
                                        }
                                    });
                                });

                                return uniqueHarborMates;
                            }

                            const filteredHarborMates = filterHarborMates()
                            // Update state
                            console.log('filteredHarborMates', filteredHarborMates)
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

                        console.log(data)
                        if (error || !data) {
                            console.log('Something Went Wrong : ', error);
                            return null;
                        } else if (data && data.length > 0) {
                            console.log('Username is taken');
                            return true;
                        } else {
                            console.log('Username is available');
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
                            console.log('Username is Updated');
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
                            console.log('Profile is Created');
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
                            console.log("Error uploading file:", error.message);
                        } else {
                            console.log("File uploaded successfully:", data);
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

                GetInitialOceanites: async () => {
                    try {
                        const { data, error } = await supabase.schema('Ocean').from('Profile').select('*').range(0, 9);
                        if (error) return console.log('error to search user', error)
                        set({ oceanitesData: [...data] });
                        return data;
                    } catch (error) {
                        console.log('error to fetch the oceanites', error);
                    }
                },

                SearchOceanites: async (keywords) => {
                    try {
                        const { data, error } = await supabase.schema('Ocean').from('Profile').select('*')
                            .ilike('name', `%${keywords}%`) // Case-insensitive search for the "name" column
                            .or(`username.ilike.%${keywords}%`) // Case-insensitive search for the "username" column
                            .range(0, 9);

                        if (error) return console.log('error to search user', error)
                        set({ oceanitesData: [...data] });
                        return data;
                    } catch (error) {
                        console.log('error to fetch the oceanites', error);
                    }
                },

                AnchorOceanite: async (anchoring_id) => {
                    const user = get().profileData;
                    const { data, error } = await supabase.schema('Ocean').from('Oceanites').insert({ 'anchor_id': user.id, anchoring_id }).select('*,anchoring_id(*)').single();
                    if (error) { console.log('Something went wrong to anchor the Oceanite', error); }

                    const updatedOceanitesData = get().oceanitesData.map((oceanite) => { if (oceanite.id === anchoring_id) return { ...oceanite, anchors: oceanite.anchors + 1 }; else return oceanite })

                    set({ harborMatesData: [...get().harborMatesData, data], anchoringsIds: [...get().anchoringsIds, data.anchoring_id.id], oceanitesData: updatedOceanitesData })
                    return true;
                },
                UnAnchorOceanite: async (anchoring_id) => {
                    const user = get().profileData;
                    const { error } = await supabase.schema('Ocean').from('Oceanites').delete().eq('anchor_id', user.id).eq('anchoring_id', anchoring_id);
                    if (error) { console.log('Something went wrong to anchor the Oceanite', error); }


                    const updatedHarborMatesData = get().harborMatesData.filter((anchoringData) => anchoringData.anchoring_id !== anchoring_id);

                    const updatedAnchoringsIds = get().anchoringsIds.filter((anchoringId) => anchoringId !== anchoring_id);

                    const updatedOceanitesData = get().oceanitesData.map((oceanite) => { if (oceanite.id === anchoring_id) return { ...oceanite, anchors: oceanite.anchors - 1 }; else return oceanite })

                    set({ harborMatesData: updatedHarborMatesData, anchoringsIds: updatedAnchoringsIds, oceanitesData: updatedOceanitesData });
                    return true;
                },

                SubscribeToAnchors: () => {
                    const user = get().profileData;

                    const channel = supabase.channel(`realtime:Anchors:user:${user.id}`).on(
                        'postgres_changes',
                        { event: '*', schema: 'Ocean', table: 'Oceanites', filter: `anchoring_id=eq.${user.id}` },
                        async (payload) => {

                            const { eventType } = payload;

                            if (eventType === 'INSERT') {

                                const { data, error } = await supabase.schema('Ocean').from('Oceanites').select('*,anchoring_id(*),anchor_id(*)').eq('id', payload.new.id).single();

                                if (error) return console.log('error to get the oceanite data', error)

                                set({ harborMatesData: [data, ...get().harborMatesData] })
                            }
                            else if (eventType === 'DELETE') {

                                const updatedHarborMatesData = get().harborMatesData.filter((data) => data.id !== payload.old.id);

                                set({ harborMatesData: updatedHarborMatesData });
                            }
                        }
                    ).subscribe();

                    return channel;

                }



            }), {
            name: 'user-store', // Storage key in localStorage
            getStorage: () => localStorage, // You can replace with sessionStorage
        }));