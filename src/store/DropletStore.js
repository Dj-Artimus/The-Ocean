import { errorToast, successToast } from '@/components/ToasterProvider';
import { createClient } from '@/utils/supabase/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserStore } from './UserStore';
import { UIStore } from './UIStore';

const supabase = createClient();


export const DropletStore = create(
    // persist(
    (set, get) => ({

        feedDroplets: [],
        feedVideos: [],
        treasureDroplets: [],
        userDroplets: [],
        userStaredDroplets: [],
        userGemmedDroplets: [],
        userRippledDroplets: [],
        userReDroppedDroplets: [],

        dropletRipples: [],
        setDropletRipples: (ripples) => { set({ dropletRipples: ripples }) },
        isDropletRipplesFetched: false,

        dropletsData: [],
        setDropletsData: (data) => { set({ dropletsData: data }) },

        isFeedDropletsFetched: false,
        isFeedVideosFetched: false,
        isTreasureDropletsFetched: false,
        isUserDropletsFetched: false,
        isUserStaredDropletsFetched: false,
        isUserGemmedDropletsFetched: false,
        isUserRippledDropletsFetched: false,
        isUserReDroppedDropletsFetched: false,

        dropletDataType: '',
        setDropletDataType: (type) => { set({ dropletDataType: type }) },

        notificationsData: [],

        sharedDropletData: {},

        DropDroplet: async (dropletData) => {
            const user = UserStore.getState().profileData;
            const user_id = user.id;
            const refreshDroplet = UIStore.getState().setDropletsRefreshId;
            try {
                const { error } = await supabase.schema("Ocean").from('Droplet').insert({ ...dropletData, 'user_id': user_id })

                if (error) {
                    console.log('Something Went Wrong : ', error);
                    errorToast('Something Went Wrong');
                    return null;
                } else {
                    console.log('Droplet is Dropped');
                    successToast('Dropped the Droplet 🤟');
                    refreshDroplet(Math.random())
                    return true;
                }
            } catch (error) {
                return console.log(error);
            }
        },

        StarDroplet: async (droplet_id) => {
            const user = UserStore.getState().profileData;
            const user_id = user.id;
            try {
                const { error } = await supabase.schema("Ocean").from('Star').insert({ droplet_id, 'user_id': user_id })

                if (error) {
                    console.log('Something Went Wrong : ', error);
                    errorToast('Something Went Wrong');
                    return null;
                } else {
                    console.log('Droplet is stared.');
                    return true;
                }
            } catch (error) {
                return console.log(error);
            }
        },

        UnStarDroplet: async (droplet_id) => {
            const user = UserStore.getState().profileData;
            const user_id = user.id;
            try {
                const { error } = await supabase.schema("Ocean").from('Star').delete().eq('droplet_id', droplet_id).eq('user_id', user_id);

                if (error) {
                    console.log('Something Went Wrong : ', error);
                    errorToast('Something Went Wrong');
                    return null;
                } else {
                    console.log('Droplet is unstared.');
                    return true;
                }
            } catch (error) {
                return console.log(error);
            }
        },

        GetDropletStars: async (droplet_id) => {
            try {
                const { data, error } = await supabase.schema("Ocean").from('Star').select('id').eq('droplet_id', droplet_id);

                if (error) {
                    console.log('Something Went Wrong : ', error);
                    errorToast('Something Went Wrong');
                    return null;
                } else {
                    // console.log('Droplet Stars:', data);
                    return data;
                }
            } catch (error) {
                return console.log(error);
            }
        },

        CheckIsDropletStaredByUser: async (droplet_id) => {
            const user = UserStore.getState().profileData;
            const user_id = user.id;
            try {
                const { data, error } = await supabase.schema("Ocean").from('Star').select('id').eq('droplet_id', droplet_id).eq('user_id', user_id);

                if (error) {
                    console.log('Something Went Wrong : ', error);
                    errorToast('Something Went Wrong');
                    return null;
                } else {
                    // console.log('Droplet Stars:', data);
                    return data.length === 0 ? false : true;
                }
            } catch (error) {
                return console.log(error);
            }
        },

        GemDroplet: async (droplet_id) => {
            const user = UserStore.getState().profileData;
            const user_id = user.id;
            try {
                const { error } = await supabase.schema("Ocean").from('Gem').insert({ droplet_id, 'user_id': user_id })

                if (error) {
                    console.log('Something Went Wrong : ', error);
                    errorToast('Something Went Wrong');
                    return null;
                } else {
                    console.log('Marked Droplet as Gem.');
                    return true;
                }
            } catch (error) {
                return console.log(error);
            }
        },

        UnGemDroplet: async (droplet_id) => {
            const user = UserStore.getState().profileData;
            const user_id = user.id;
            try {
                const { error } = await supabase.schema("Ocean").from('Gem').delete().eq('droplet_id', droplet_id).eq('user_id', user_id);

                if (error) {
                    console.log('Something Went Wrong : ', error);
                    errorToast('Something Went Wrong');
                    return null;
                } else {
                    console.log('Unmarked Droplet as Gem.');
                    return true;
                }
            } catch (error) {
                return console.log(error);
            }
        },

        CheckIsUserGemmedDroplet: async (droplet_id) => {
            const user = UserStore.getState().profileData;
            const user_id = user.id;
            try {
                const { data, error } = await supabase.schema("Ocean").from('Gem').select('id').eq('droplet_id', droplet_id).eq('user_id', user_id);

                if (error) {
                    console.log('Something Went Wrong : ', error);
                    errorToast('Something Went Wrong');
                    return null;
                } else {
                    // console.log('Droplet Stars:', data);
                    return data.length === 0 ? false : true;
                }
            } catch (error) {
                return console.log(error);
            }
        },

        RippleDroplet: async (content) => {
            const user = UserStore.getState().profileData;
            const user_id = user.id;
            const droplet_id = UIStore.getState().rippleDrawerDropletId
            try {
                const { data, error } = await supabase.schema("Ocean").from('Ripple').insert({ "droplet_id": droplet_id, 'user_id': user_id, content }).select();

                if (error) {
                    console.log('Something Went Wrong : ', error);
                    errorToast('Something Went Wrong');
                    return null;
                } else {
                    console.log('Ripple Added to Droplet successfully.');
                    successToast('Ripple Added to Droplet successfully.');
                    return data[0].id;
                }
            } catch (error) {
                return console.log(error);
            }
        },

        CheckIsUserRippledDroplet: async (droplet_id) => {
            const user = UserStore.getState().profileData;
            const user_id = user.id;
            try {
                const { data, error } = await supabase.schema("Ocean").from('Ripple').select('id').eq('droplet_id', droplet_id).eq('user_id', user_id);

                if (error) {
                    console.log('Something Went Wrong : ', error);
                    errorToast('Something Went Wrong');
                    return null;
                } else {
                    // console.log('Droplet Stars:', data);
                    return data.length === 0 ? false : true;
                }
            } catch (error) {
                return console.log(error);
            }
        },

        EditContent: async (content) => {
            // const getRippleId = 
            const id = UIStore.getState().contentEditId;
            const contentType = UIStore.getState().contentToEditType;
            try {
                const { error } = await supabase.schema("Ocean").from(contentType).update({ 'content': content }).eq('id', id);

                if (error) {
                    console.log('Something Went Wrong : ', error);
                    errorToast('Something Went Wrong');
                    return null;
                } else {
                    console.log(` ${contentType} Content edited successfully.`);
                    successToast(` ${contentType} Content edited successfully.`);
                    return Math.random();
                }
            } catch (error) {
                return console.log(error);
            }
        },

        DeleteContent: async () => {
            const id = UIStore.getState().contentEditId;
            const contentType = UIStore.getState().contentToEditType;
            try {
                const { error } = await supabase.schema("Ocean").from(contentType).delete().eq('id', id);

                if (error) {
                    console.log('Something Went Wrong : ', error);
                    errorToast('Something Went Wrong');
                    return null;
                } else {
                    console.log(` ${contentType} deleted successfully.`);
                    successToast(` ${contentType} deleted successfully.`);
                    return true;
                }
            } catch (error) {
                return console.log(error);
            }
        },

        GetRipples: async () => {
            set({ isDropletRipplesFetched: false })
            const droplet_id = UIStore.getState().rippleDrawerDropletId
            console.log(droplet_id)
            if (UIStore.getState().isRippleDrawerOpen) {
                try {
                    const { data, error } = await supabase.schema("Ocean").from('Ripple').select('*,user_id(*)').eq('droplet_id', droplet_id).order('created_at', { ascending: false })

                    if (error) {
                        console.log('Something Went Wrong to get ripples : ', error);
                        errorToast('Something Went Wrong');
                        return null;
                    } else {
                        set({ dropletRipples: data });
                        return console.log('droplets ripple fetched successfully', data)
                    }
                } catch (error) {
                    return console.log(error);
                }
            }
        },

        GetUserDroplets: async (userId) => {
            // if (!get().userDroplets) {
            const user = UserStore.getState().profileData;
            const user_id = userId ? userId : user.id;
            try {
                const { data, error } = await supabase.schema("Ocean").from("Droplet").select('*,user_id(*)').eq('user_id', user_id).order('created_at', { ascending: false });
                console.log(data)
                if (error || !data) {
                    console.log('No droplets found', error);
                    return null;
                }
                set({ userDroplets: [...data], dropletsData: data });
                // get().setDropletsData(data);
                return console.log('user droplets fetched successfully', data)
            } catch (error) {
                return console.log(error);
            }
            // } else { return get().userDroplets }
        },

        GetUserStaredDroplets: async (userId) => {
            // if (!get().userStaredDroplets) {
            const user = UserStore.getState().profileData;
            const user_id = userId ? userId : user.id;
            try {
                const { data, error } = await supabase.schema("Ocean").from("Star").select('*,droplet_id(*,user_id(*))').eq('user_id', user_id).not('droplet_id', 'is', null).order('created_at', { ascending: false });
                console.log(data)
                if (error || !data) {
                    console.log('No Profile found');
                    return null;
                }
                const staredDropletData = data?.map((droplet) => {
                    return droplet.droplet_id;
                });
                set({ userStaredDroplets: staredDropletData, dropletsData: staredDropletData });
                // get().setDropletsData(staredDropletData);
                return console.log('user stared droplets fetched successfully', data)
            } catch (error) {
                return console.log(error);
            }
            // } else { return get().userStaredDroplets }
        },

        GetUserGemmedDroplets: async (userId) => {
            // if (!get().userGemmedDroplets) {
            const user = UserStore.getState().profileData;
            const user_id = userId ? userId : user.id;
            try {
                const { data, error } = await supabase.schema("Ocean").from("Gem").select('*,droplet_id(*,user_id(*))').eq('user_id', user_id).not('droplet_id', 'is', null).order('created_at', { ascending: false });
                if (error || !data) {
                    console.log('No Profile found', error);
                    return null;
                }
                console.log('GetUserGemmedDroplets', data)
                const gemmedDropletData = data?.map((droplet) => {
                    return droplet.droplet_id;
                })
                set({
                    userGemmedDroplets: gemmedDropletData,
                    dropletsData: gemmedDropletData
                });
                // get().setDropletsData(gemmedDropletData);
                return console.log('user Gemmed droplets fetched successfully', data)
            } catch (error) {
                return console.log(error);
            }
            // } else { return get().userGemmedDroplets }
        },

        GetUserRippledDroplets: async (userId) => {
            // if (!get().userRippledDroplets) {
            const user = UserStore.getState().profileData;
            const userid = userId ? userId : user.id;
            try {
                // Replace table query with RPC call
                const { data, error } = await supabase.schema("Ocean").rpc('get_unique_ripple_droplets', { userid });

                if (error || !data) {
                    console.error('Error fetching rippled droplets:', error || 'No data returned');
                    return null;
                }
                set({ userRippledDroplets: data });
                const rippledDropletData = data?.map((droplet) => {
                    return droplet.droplet_id;
                });
                set({
                    userRippledDroplets: rippledDropletData,
                    dropletsData: rippledDropletData
                });
                // get().setDropletsData(rippledDropletData);
                return console.log('userRippled droplets fetched successfully', data)
            } catch (error) {
                console.error('Unexpected error:', error);
                return null;
            }
            // } else { return get().userRippledDroplets }
        },

        GetTreasureDroplets: async (user_id) => {

            await get().GetUserDroplets(user_id);
            await get().GetUserStaredDroplets(user_id);
            await get().GetUserGemmedDroplets(user_id);
            await get().GetUserRippledDroplets(user_id);

            const combinedDropletsData = [...get().userDroplets, ...get().userStaredDroplets, ...get().userGemmedDroplets, ...get().userRippledDroplets]

            // Use a Map to ensure unique droplets by their `id`
            const uniqueDroplets = [
                ...new Map(combinedDropletsData.map((droplet) => [droplet.id, droplet])).values(),
            ];

            set({
                treasureDroplets: uniqueDroplets,
                dropletsData: uniqueDroplets,
            })
        },

        GetFeedDroplets: async (page = 1, limit = 5) => {
            try {
                const getFeedCount = async () => {
                    const { count } = await supabase.schema("Ocean").from("Droplet").select('*', { count: 'exact' }).in('user_id', UserStore.getState().anchoringsIds);
                    return count;
                }

                const getFeed = async (lastDroplet) => {
                    const offset = (page - 1) * limit;
                    const { data, error } = await supabase.schema("Ocean").from("Droplet").select('*,user_id(*)').in('user_id', UserStore.getState().anchoringsIds).order('created_at', { ascending: false }).range(offset, lastDroplet ? lastDroplet : (offset + limit - 1));
                    if (error || !data) {
                        console.log('No Profile found');
                        return null;
                    }

                    const existingDroplets = get().feedDroplets;
                    const newDroplets = data.filter(
                        (droplet) => !existingDroplets.some((existing) => existing.id === droplet.id)
                    );

                    set({
                        feedDroplets: [...existingDroplets, ...newDroplets], // Append new droplets
                        // feedDroplets: data,
                        // feedDroplets: [ ...get().feedDroplets, ...data],
                        dropletsData: data,
                        isFeedDropletsFetched: true,
                    });

                    console.log('feed droplets fetched successfully', data)
                    return data;
                }

                const data = await getFeed();

                if (data.length === 0) {
                    const count = await getFeedCount();
                    const data = await getFeed(count - 1);
                    return data;
                }
                return data;
            } catch (error) {
                return console.log(error);
            }
        },

        GetFeedVideos: async (page = 1, limit = 5) => {
            try {

                const getFeedVideosCount = async () => {
                    const { count } = await supabase.schema("Ocean").from("Droplet").select('*', { count: 'exact' }).not('videos', 'is', null).gt('videos', '{}').not('id', 'is', null);
                    return count;
                }

                const getFeedVideos = async (lastDroplet = 0) => {
                    const offset = (page - 1) * limit;
                    const { data: videoData, error } = await supabase.schema("Ocean").from('Droplet').select('*,user_id(*)').not('videos', 'is', null).gt('videos', '{}').not('id', 'is', null).order('created_at', { ascending: false }).range(offset, lastDroplet ? lastDroplet : (offset + limit - 1));;
                    if (error || !videoData) {
                        console.log('No Videos found', error);
                        return null;
                    }
                    // get().setDropletsData(data)
                    const organizedData = videoData?.map((data) => {
                        if (data?.videos?.length > 0) {
                            return data?.videos?.map((url) => {
                                return {
                                    url: url?.split("<|>")[0],
                                    author_name: data?.user_id?.name,
                                    username: data?.user_id?.username,
                                    avatar: data?.user_id?.avatar?.split("<|>")[0],
                                    author_id: data?.user_id?.id,
                                    droplet_id: data?.id,
                                    content: data?.content,
                                    stars: data?.stars,
                                    ripples: data?.ripples,
                                    redrops: data?.redrops,
                                };
                            });
                        } else return null
                    })?.flat();

                    // Fisher-Yates Shuffle Algorithm
                    const shuffleVideos = (array) => {
                        for (let i = array?.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1)); // Random index
                            [array[i], array[j]] = [array[j], array[i]]; // Swap
                        }
                        return array;
                    };
                    // Shuffle the organizedData array
                    const shuffledVideos = shuffleVideos(organizedData);
                    set({ feedVideos: [...get().feedVideos, ...shuffledVideos], dropletsData: videoData });
                    console.log('feed videos shuffled successfully', shuffledVideos)
                    console.log('feed videos fetched successfully', videoData)
                    return videoData;
                }

                const data = await getFeedVideos();

                if (data.length === 0) {
                    getFeedVideosCount()
                }

            } catch (error) {
                return console.log(error);
            }
        },

        GetSingleDroplet: async (droplet_id) => {
            try {
                const { data, error } = await supabase
                    .schema("Ocean")
                    .from("Droplet")
                    .select("*, user_id(*)")
                    .eq("id", droplet_id)
                    .single();
                if (error) return console.log("error to fetch single droplet", error)
                if (data) return set({ sharedDropletData: data });
            } catch (error) {
                console.log('error from get single droplet', error)
            }
        },

        // Subscribe to Droplet Changes
        subscribeToDropletChanges: (droplet_id) => {

            const user = UserStore.getState().profileData;

            const dropletsInsertFunction = (newDroplet, dropletDataType) => {
                switch (dropletDataType) {
                    case 'feedDroplets':
                        return set((state) => {
                            // Deduplicate droplets
                            const dropletExists = state.feedDroplets.some(
                                (droplet) => droplet.id === newDroplet.id
                            );

                            if (!dropletExists) {
                                const updatedDroplets = [newDroplet, ...state.feedDroplets]; // Add new droplet to the top
                                // get().setDropletsData(updatedDroplets);
                                return {
                                    feedDroplets: [...updatedDroplets],

                                    isFeedDropletsFetched: true
                                };
                            }

                            return state; // No changes if duplicate
                        })
                    case 'treasureDroplets':
                        return set((state) => {
                            // Deduplicate droplets
                            const dropletExists = state.treasureDroplets.some(
                                (droplet) => droplet.id === newDroplet.id
                            );

                            if (!dropletExists) {
                                const updatedDroplets = [newDroplet, ...state.treasureDroplets]; // Add new droplet to the top
                                // get().setDropletsData(updatedDroplets);
                                return {
                                    treasureDroplets: [...updatedDroplets],

                                    isTreasureDropletsFetched: true
                                };
                            }

                            return state; // No changes if duplicate
                        })
                    case 'userDroplets':
                        return set((state) => {
                            // Deduplicate droplets
                            const dropletExists = state.userDroplets.some(
                                (droplet) => droplet.id === newDroplet.id
                            );

                            if (!dropletExists) {
                                const updatedDroplets = [newDroplet, ...state.userDroplets]; // Add new droplet to the top
                                // get().setDropletsData(updatedDroplets);
                                return {
                                    userDroplets: [...updatedDroplets],

                                    isUserDropletsFetched: true
                                };
                            }

                            return state; // No changes if duplicate
                        })
                    case 'userStaredDroplets':
                        return set((state) => {
                            // Deduplicate droplets
                            const dropletExists = state.userStaredDroplets.some(
                                (droplet) => droplet.id === newDroplet.id
                            );

                            if (!dropletExists) {
                                const updatedDroplets = [newDroplet, ...state.userStaredDroplets]; // Add new droplet to the top
                                // get().setDropletsData(updatedDroplets);
                                return {
                                    userStaredDroplets: [...updatedDroplets],

                                    isUserStaredDropletsFetched: true
                                };
                            }

                            return state; // No changes if duplicate
                        })
                    case 'userGemmedDroplets':
                        return set((state) => {
                            // Deduplicate droplets
                            const dropletExists = state.userGemmedDroplets.some(
                                (droplet) => droplet.id === newDroplet.id
                            );

                            if (!dropletExists) {
                                const updatedDroplets = [newDroplet, ...state.userGemmedDroplets]; // Add new droplet to the top
                                // get().setDropletsData(updatedDroplets);
                                return {
                                    userGemmedDroplets: [...updatedDroplets],

                                    isUserGemmedDropletsFetched: true
                                };
                            }

                            return state; // No changes if duplicate
                        })
                    case 'userRippledDroplets':
                        return set((state) => {
                            // Deduplicate droplets
                            const dropletExists = state.userRippledDroplets.some(
                                (droplet) => droplet.id === newDroplet.id
                            );

                            if (!dropletExists) {
                                const updatedDroplets = [newDroplet, ...state.userRippledDroplets]; // Add new droplet to the top
                                // get().setDropletsData(updatedDroplets);

                                return {
                                    userRippledDroplets: [...updatedDroplets],
                                    isUserRippledDropletsFetched: true
                                };
                            }

                            return state; // No changes if duplicate
                        })
                    case 'userReDroppedDroplets':
                        return set((state) => {
                            // Deduplicate droplets
                            const dropletExists = state.userReDroppedDroplets.some(
                                (droplet) => droplet.id === newDroplet.id
                            );

                            if (!dropletExists) {
                                const updatedDroplets = [newDroplet, ...state.userReDroppedDroplets]; // Add new droplet to the top
                                // get().setDropletsData(updatedDroplets);
                                return {
                                    userReDroppedDroplets: [...updatedDroplets],
                                    dropletsData: [...updatedDroplets],
                                    isUserReDroppedDropletsFetched: true
                                };
                            }

                            return state; // No changes if duplicate
                        })
                }
            }
            const dropletsUpdateFunction = (payload, dropletDataType) => {
                console.log('droplettype:', dropletDataType);

                switch (dropletDataType) {
                    case 'feedDroplets':
                        return set((state) => {
                            const updatedDroplets = state.feedDroplets.map((droplet) => {
                                if (droplet.id === payload.new.id) {
                                    // Update only relevant fields
                                    return {
                                        ...droplet,
                                        content: payload.new.content,
                                        stars: payload.new.stars,
                                        ripples: payload.new.ripples,
                                        redrops: payload.new.redrops,
                                    };
                                }
                                return droplet; // Leave other droplets unchanged
                            });

                            return { feedDroplets: [...updatedDroplets] };
                        });
                    case 'feedVideos':
                        return set((state) => {
                            const updatedVideos = state.feedVideos.map((video) => {
                                if (video.droplet_id === payload.new.id) {
                                    // Update only relevant fields
                                    return {
                                        ...video,
                                        content: payload.new.content,
                                        stars: payload.new.stars,
                                        ripples: payload.new.ripples,
                                        redrops: payload.new.redrops,
                                    };
                                }
                                return video; // Leave other droplets unchanged
                            });

                            return { feedVideos: [...updatedVideos] };
                        });
                    case 'treasureDroplets':
                        return set((state) => {
                            const updatedDroplets = state.treasureDroplets.map((droplet) => {
                                if (droplet.id === payload.new.id) {
                                    // Update only relevant fields
                                    return {
                                        ...droplet,
                                        content: payload.new.content,
                                        stars: payload.new.stars,
                                        ripples: payload.new.ripples,
                                        redrops: payload.new.redrops,
                                    };
                                }
                                return droplet; // Leave other droplets unchanged
                            });

                            return { treasureDroplets: [...updatedDroplets] };
                        });
                    case 'userDroplets':
                        console.log('user');

                        return set((state) => {
                            const updatedDroplets = state.userDroplets.map((droplet) => {
                                if (droplet.id === payload.new.id) {
                                    // Update only relevant fields
                                    return {
                                        ...droplet,
                                        content: payload.new.content,
                                        stars: payload.new.stars,
                                        ripples: payload.new.ripples,
                                        redrops: payload.new.redrops,
                                    };
                                }
                                return droplet; // Leave other droplets unchanged
                            });

                            return { userDroplets: [...updatedDroplets] };
                        });
                    case 'userStaredDroplets':
                        console.log('stared');
                        return set((state) => {
                            const updatedDroplets = state.userStaredDroplets.map((droplet) => {
                                if (droplet.id === payload.new.id) {
                                    // Update only relevant fields
                                    return {
                                        ...droplet,
                                        content: payload.new.content,
                                        stars: payload.new.stars,
                                        ripples: payload.new.ripples,
                                        redrops: payload.new.redrops,
                                    };
                                }
                                return droplet; // Leave other droplets unchanged
                            });

                            return { userStaredDroplets: [...updatedDroplets] };
                        });
                    case 'userGemmedDroplets':
                        console.log('gemmed');

                        return set((state) => {
                            const updatedDroplets = state.userGemmedDroplets.map((droplet) => {
                                if (droplet.id === payload.new.id) {
                                    // Update only relevant fields
                                    return {
                                        ...droplet,
                                        content: payload.new.content,
                                        stars: payload.new.stars,
                                        ripples: payload.new.ripples,
                                        redrops: payload.new.redrops,
                                    };
                                }
                                return droplet; // Leave other droplets unchanged
                            });

                            return { userGemmedDroplets: [...updatedDroplets] };
                        });
                    case 'userRippledDroplets':
                        console.log('rippled');
                        return set((state) => {
                            const updatedDroplets = state.userRippledDroplets.map((droplet) => {
                                if (droplet.id === payload.new.id) {
                                    // Update only relevant fields
                                    return {
                                        ...droplet,
                                        content: payload.new.content,
                                        stars: payload.new.stars,
                                        ripples: payload.new.ripples,
                                        redrops: payload.new.redrops,
                                    };
                                }
                                return droplet; // Leave other droplets unchanged
                            });

                            return { userRippledDroplets: [...updatedDroplets] };
                        });
                    case 'userReDroppedDroplets':
                        console.log('redropped');

                        return set((state) => {
                            const updatedDroplets = state.userReDroppedDroplets.map((droplet) => {
                                if (droplet.id === payload.new.id) {
                                    // Update only relevant fields
                                    return {
                                        ...droplet,
                                        content: payload.new.content,
                                        stars: payload.new.stars,
                                        ripples: payload.new.ripples,
                                        redrops: payload.new.redrops,
                                    };
                                }
                                return droplet; // Leave other droplets unchanged
                            });

                            return { userReDroppedDroplets: [...updatedDroplets] };
                        });
                }
            }
            const dropletsDeleteFunction = (payload, dropletDataType) => {
                switch (dropletDataType) {
                    case 'feedDroplets':
                        return set((state) => {
                            const updatedDroplets = state.feedDroplets.filter(
                                (droplet) => droplet.id !== payload.old.id
                            );

                            return { feedDroplets: [...updatedDroplets] };
                        });
                    case 'userDroplets':
                        return set((state) => {
                            const updatedDroplets = state.treasureDroplets.filter(
                                (droplet) => droplet.id !== payload.old.id
                            );

                            return { treasureDroplets: [...updatedDroplets] };
                        });
                    case 'userDroplets':
                        return set((state) => {
                            const updatedDroplets = state.userDroplets.filter(
                                (droplet) => droplet.id !== payload.old.id
                            );

                            return { userDroplets: [...updatedDroplets] };
                        });
                    case 'userStaredDroplets':
                        return set((state) => {
                            const updatedDroplets = state.userStaredDroplets.filter(
                                (droplet) => droplet.id !== payload.old.id
                            );

                            return { userStaredDroplets: [...updatedDroplets] };
                        });
                    case 'userGemmedDroplets':
                        return set((state) => {
                            const updatedDroplets = state.userGemmedDroplets.filter(
                                (droplet) => droplet.id !== payload.old.id
                            );

                            return { userGemmedDroplets: [...updatedDroplets] };
                        });
                    case 'userRippledDroplets':
                        return set((state) => {
                            const updatedDroplets = state.userRippledDroplets.filter(
                                (droplet) => droplet.id !== payload.old.id
                            );

                            return { userRippledDroplets: [...updatedDroplets] };
                        });
                    case 'userReDroppedDroplets':
                        return set((state) => {
                            const updatedDroplets = state.userReDroppedDroplets.filter(
                                (droplet) => droplet.id !== payload.old.id
                            );

                            return { userReDroppedDroplets: [...updatedDroplets] };
                        });
                }

            }
            const anchorings = UserStore.getState().anchoringsIds;
            const channel = supabase
                .channel(`realtime:User:${user.id}_Droplet:${droplet_id}_time:${new Date().getTime()}`)
                .on(
                    "postgres_changes",
                    { event: "INSERT", schema: "Ocean", table: "Droplet", filter: `user_id=in.(${anchorings.toLocaleString()})` },
                    async (payload) => {
                        console.log("Droplet INSERT event received:", payload);

                        // Fetch the new droplet details with user info
                        const { data: newDroplet, error } = await supabase
                            .schema("Ocean")
                            .from("Droplet")
                            .select("*, user_id(*)")
                            .eq("id", payload.new.id)
                            .single();

                        if (error) {
                            console.error("Error fetching new droplet details:", error);
                            return;
                        }

                        set((state) => {
                            // Deduplicate droplets
                            const dropletExists = state.dropletsData.some(
                                (droplet) => droplet.id === newDroplet.id
                            );

                            const notificationExists = state.notificationsData.some(
                                (notification) => notification.id === newDroplet.id
                            );

                            if (!dropletExists) {
                                const updatedDroplets = [newDroplet, ...state.dropletsData]; // Add new droplet to the top
                                // get().setDropletsData(updatedDroplets);
                                return {
                                    dropletsData: [...updatedDroplets],
                                };
                            }

                            if (!notificationExists) {
                                const updatedNotifications = [newDroplet, ...state.notificationsData]; // Add new droplet to the top
                                // get().setDropletsData(updatedDroplets);
                                UIStore.getState().setNotificationsCount(UIStore.getState().notificationsCount + 1);
                                return {
                                    notificationsData: [...updatedNotifications],
                                };
                            }

                            return state; // No changes if duplicate
                        })
                        console.log('get().dropletDataType', get().dropletDataType)
                        // dropletsInsertFunction(newDroplet,dataType);
                        dropletsInsertFunction(newDroplet, get().dropletDataType);
                    }
                )
                .on(
                    "postgres_changes",
                    { event: "UPDATE", schema: "Ocean", table: "Droplet", filter: `id=eq.${droplet_id}` },
                    (payload) => {
                        console.log("Droplet UPDATE event received:", payload);

                        // dropletsUpdateFunction(payload,dataType)

                        set((state) => {
                            const updatedDroplets = state.dropletsData.map((droplet) => {
                                if (droplet.id === payload.new.id) {
                                    // Update only relevant fields
                                    return {
                                        ...droplet,
                                        content: payload.new.content,
                                        stars: payload.new.stars,
                                        ripples: payload.new.ripples,
                                        redrops: payload.new.redrops,
                                    };
                                }
                                return droplet; // Leave other droplets unchanged
                            });

                            return { dropletsData: [...updatedDroplets] };
                        });


                        dropletsUpdateFunction(payload, get().dropletDataType)
                        if (get().sharedDropletData?.id === droplet_id) { set({ sharedDropletData: payload.new }) }

                    }
                )
                .on(
                    "postgres_changes",
                    { event: "DELETE", schema: "Ocean", table: "Droplet", filter: `id=eq.${droplet_id}` },
                    (payload) => {
                        console.log("Droplet DELETE event received:", payload);

                        // dropletsDeleteFunction(payload,dataType);

                        set((state) => {
                            const updatedDroplets = state.dropletsData.filter(
                                (droplet) => droplet.id !== payload.old.id
                            );

                            return { dropletsData: [...updatedDroplets] };
                        });
                        console.log('get().dropletDataType', get().dropletDataType)
                        dropletsDeleteFunction(payload, get().dropletDataType);

                    }
                )
                .subscribe();
            channel.on('error', (error) => {
                console.error('Real-time channel error:', error);
            });

            console.log(channel.state); // Should log 'subscribed'

            return () => supabase.removeChannel(channel); // Clean up subscription
        },

        subscribeToRippleChanges: (droplet_id) => {
            const channel = supabase
                .channel(`ripple-updates:${droplet_id}`)
                .on(
                    "postgres_changes",
                    { event: "*", schema: "Ocean", table: "Ripple", filter: `droplet_id=eq.${droplet_id}` },
                    async (payload) => {
                        console.log("Ripple real-time update received:", payload);

                        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
                            // Fetch the ripple with user details
                            const { data: rippleWithUser, error } = await supabase
                                .schema("Ocean")
                                .from("Ripple")
                                .select("*, user_id(*)")
                                .eq("id", payload.new.id)
                                .single();

                            if (error) {
                                console.error("Error fetching ripple with user details:", error);
                                return;
                            }

                            set((state) => {
                                const updatedRipples = [...state.dropletRipples];
                                const rippleIndex = updatedRipples.findIndex((ripple) => ripple.id === rippleWithUser.id);

                                if (rippleIndex === -1) {
                                    // INSERT: Add new ripple
                                    updatedRipples.unshift(rippleWithUser);
                                } else {
                                    // UPDATE: Replace existing ripple
                                    updatedRipples[rippleIndex] = rippleWithUser;
                                }

                                return { dropletRipples: updatedRipples };
                            });
                        } else if (payload.eventType === "DELETE") {
                            // Handle DELETE
                            set((state) => {
                                const updatedRipples = state.dropletRipples.filter(
                                    (ripple) => ripple.id !== payload.old.id
                                );

                                return { dropletRipples: updatedRipples };
                            });
                        }
                    }
                )
                .subscribe();

            return channel;
        },


        setupSubscriptionsForRipplesData: async () => {
            const droplet_id = UIStore.getState().rippleDrawerDropletId;

            if (!droplet_id) {
                console.error("No droplet_id found for Ripple subscription.");
                return;
            }

            // Fetch ripples when the drawer is opened
            await get().GetRipples(droplet_id);

            // Subscribe to real-time changes
            const rippleChannel = get().subscribeToRippleChanges(droplet_id);

            return () => {
                if (rippleChannel) supabase.removeChannel(rippleChannel); // Unsubscribe on cleanup
            };
        },

    }

    ),
    //      {
    //     name: 'droplet-store', // Storage key in localStorage
    //     getStorage: () => sessionStorage, // You can replace with sessionStorage
    // })
)