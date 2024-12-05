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
        setFeedDroplets: async (data) => {
            set({ feedDroplets: data })
        },
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

        GetRipples: async (page = 1, limit = 5) => {

            set({ isDropletRipplesFetched: false })
            const droplet_id = UIStore.getState().rippleDrawerDropletId
            console.log(droplet_id)

            if (UIStore.getState().isRippleDrawerOpen) {
                try {

                    const getRipplesCount = async () => {
                        const { count } = await supabase.schema("Ocean").from("Ripples").select('*', { count: 'exact' }).eq('droplet_id', droplet_id);
                        return count;
                    }

                    const getRipples = async (lastDroplet = 0) => {
                        const offset = (page - 1) * limit;

                        const { data, error } = await supabase.schema("Ocean").from('Ripple').select('*,user_id(*)').eq('droplet_id', droplet_id).order('created_at', { ascending: false }).range(offset, lastDroplet ? lastDroplet : (offset + limit - 1));

                        if (error || !data) {
                            console.log('No Ripples found', error);
                            return null;
                        }
                        console.log('GetUserDroplets', data)

                        const existingRipples = get().dropletRipples;
                        const newRipples = data.filter(
                            (ripple) => !existingRipples.some((existing) => existing.id === ripple.id)
                        );

                        set({
                            dropletRipples: [...existingRipples, ...newRipples],
                        });

                        console.log('droplet ripples fetched successfully', data)
                        return data;
                    }

                    const data = await getRipples();

                    if (data.length === 0) {
                        console.log('getting the droplet ripples count');
                        const count = await getRipplesCount();
                        console.log('count of the droplet ripples', count);

                        await getRipples(count - 1);
                        return 'end';
                    }

                    return data;

                } catch (error) {
                    return console.log(error);
                }
            }
        },

        GetUserDroplets: async (page = 1, limit = 5) => {

            // if (!get().userDroplets) {
            const user = UserStore.getState().profileData;
            const user_id = user.id;
            try {

                const getDropletsCount = async () => {
                    const { count } = await supabase.schema("Ocean").from("Droplets").select('*', { count: 'exact' }).eq('user_id', user_id);
                    return count;
                }

                const getDroplets = async (lastDroplet = 0) => {
                    const offset = (page - 1) * limit;

                    const { data, error } = await supabase.schema("Ocean").from("Droplet").select('*,user_id(*)').eq('user_id', user_id).order('created_at', { ascending: false }).range(offset, lastDroplet ? lastDroplet : (offset + limit - 1));

                    if (error || !data) {
                        console.log('No User Droplets found', error);
                        return null;
                    }
                    console.log('GetUserDroplets', data)

                    const existingDroplets = get().userDroplets;
                    const newDroplets = data.filter(
                        (droplet) => !existingDroplets.some((existing) => existing.id === droplet.id)
                    );

                    set({
                        userDroplets: [...existingDroplets, ...newDroplets],
                        dropletsData: data
                    });

                    console.log('user droplets fetched successfully', data)
                    return data;
                }

                const data = await getDroplets();

                if (data.length === 0) {
                    console.log('getting the droplets count');
                    const count = await getDropletsCount();
                    console.log('count of the droplets', count);

                    await getDroplets(count - 1);
                    return 'end';
                }

                return data;

            } catch (error) {
                return console.log(error);
            }
            // } else { return get().userDroplets }
        },

        GetUserStaredDroplets: async (page = 1, limit = 5) => {

            // if (!get().userStaredDroplets) {
            const user = UserStore.getState().profileData;
            const user_id = user.id;
            try {

                const getDropletsCount = async () => {
                    const { count } = await supabase.schema("Ocean").from("Star").select('*', { count: 'exact' }).eq('user_id', user_id).not('droplet_id', 'is', null);
                    return count;
                }

                const getDroplets = async (lastDroplet = 0) => {
                    const offset = (page - 1) * limit;

                    const { data, error } = await supabase.schema("Ocean").from("Star").select('*,droplet_id(*,user_id(*))').eq('user_id', user_id).not('droplet_id', 'is', null).order('created_at', { ascending: false }).range(offset, lastDroplet ? lastDroplet : (offset + limit - 1));

                    if (error || !data) {
                        console.log('No User Stared Droplets found', error);
                        return null;
                    }
                    console.log('GetUserStaredDroplets', data)

                    const staredDropletData = data?.map((droplet) => {
                        return droplet.droplet_id;
                    });

                    const existingDroplets = get().userStaredDroplets;
                    const newDroplets = staredDropletData.filter(
                        (droplet) => !existingDroplets.some((existing) => existing.id === droplet.id)
                    );

                    set({
                        userStaredDroplets: [...existingDroplets, ...newDroplets],
                        dropletsData: staredDropletData
                    });
                    // get().setDropletsData(gemmedDropletData);
                    console.log('user Stared droplets fetched successfully', data)
                    return data;
                }

                const data = await getDroplets();

                if (data.length === 0) {
                    console.log('getting the droplets count');
                    const count = await getDropletsCount();
                    console.log('count of the droplets', count);

                    await getDroplets(count - 1);
                    return 'end';
                }

                return data;
            } catch (error) {
                return console.log(error);
            }
            // } else { return get().userStaredDroplets }
        },

        GetUserGemmedDroplets: async (page = 1, limit = 5) => {
            // if (!get().userGemmedDroplets) {
            const user = UserStore.getState().profileData;
            const user_id = user.id;
            try {

                const getDropletsCount = async () => {
                    const { count } = await supabase.schema("Ocean").from("Gem").select('*', { count: 'exact' }).eq('user_id', user_id).not('droplet_id', 'is', null);
                    return count;
                }

                const getDroplets = async (lastDroplet = 0) => {
                    const offset = (page - 1) * limit;

                    const { data, error } = await supabase.schema("Ocean").from("Gem").select('*,droplet_id(*,user_id(*))').eq('user_id', user_id).not('droplet_id', 'is', null).order('created_at', { ascending: false }).range(offset, lastDroplet ? lastDroplet : (offset + limit - 1));

                    if (error || !data) {
                        console.log('No User Gemmed Droplets found', error);
                        return null;
                    }
                    console.log('GetUserGemmedDroplets', data)
                    const gemmedDropletData = data?.map((droplet) => {
                        return droplet.droplet_id;
                    })

                    const existingDroplets = get().userGemmedDroplets;
                    const newDroplets = gemmedDropletData.filter(
                        (droplet) => !existingDroplets.some((existing) => existing.id === droplet.id)
                    );

                    set({
                        userGemmedDroplets: [...existingDroplets, ...newDroplets],
                        dropletsData: gemmedDropletData
                    });
                    // get().setDropletsData(gemmedDropletData);
                    console.log('user Gemmed droplets fetched successfully', data)
                    return data;
                }

                const data = await getDroplets();

                if (data.length === 0) {
                    console.log('getting the droplets count');
                    const count = await getDropletsCount();
                    console.log('count of the droplets', count);

                    await getDroplets(count - 1);
                    return 'end';
                }

                return data;
            } catch (error) {
                return console.log(error);
            }
            // } else { return get().userGemmedDroplets }
        },

        GetUserRippledDroplets: async (page = 1, limit = 5) => {
            // if (!get().userRippledDroplets) {
            const user = UserStore.getState().profileData;
            const userid = user.id;
            try {

                const getDropletsCount = async () => {
                    const { data, error } = await supabase.schema("Ocean").rpc('get_unique_ripple_droplets', { userid });
                    if (error) return ('Unable to find the user rippled droplets count')
                    return data.length;
                }

                const getDroplets = async (lastDroplet = 0) => {
                    const offset = (page - 1) * limit;

                    const { data, error } = await supabase.schema("Ocean").rpc('get_unique_ripple_droplets', { userid }).range(offset, lastDroplet ? lastDroplet : (offset + limit - 1));

                    if (error || !data) {
                        console.error('Error fetching rippled droplets:', error || 'No data returned');
                        return null;
                    }
                    const rippledDropletData = data?.map((droplet) => {
                        return droplet.droplet_id;
                    });

                    const existingDroplets = get().userRippledDroplets;
                    const newDroplets = rippledDropletData.filter(
                        (droplet) => !existingDroplets.some((existing) => existing.id === droplet.id)
                    );

                    set({
                        userRippledDroplets: [...existingDroplets, ...newDroplets],
                        dropletsData: rippledDropletData
                    });

                    console.log('User Rippled droplets fetched successfully', data)
                    return data;
                }

                const data = await getDroplets();

                if (data.length === 0) {
                    console.log('getting the feed count');
                    const count = await getDropletsCount();
                    console.log('count of the feed', count);

                    await getDroplets(count - 1);
                    return 'end';
                }

                return data;
            } catch (error) {
                console.error('Unexpected error:', error);
                return null;
            }
            // } else { return get().userRippledDroplets }
        },

        GetTreasureDroplets: async (page, limit) => {

            try {
                await get().GetUserDroplets(page = 1, limit = 5);
                await get().GetUserStaredDroplets(page = 1, limit = 5);
                await get().GetUserGemmedDroplets(page = 1, limit = 5);
                await get().GetUserRippledDroplets(page = 1, limit = 5);

                const combinedDropletsData = [...get().userDroplets, ...get().userStaredDroplets, ...get().userGemmedDroplets, ...get().userRippledDroplets]

                // Use a Map to ensure unique droplets by their `id`
                const uniqueDroplets = [
                    ...new Map(combinedDropletsData.map((droplet) => [droplet.id, droplet])).values(),
                ];

                const existingDroplets = get().treasureDroplets;
                const newDroplets = uniqueDroplets.filter(
                    (droplet) => !existingDroplets.some((existing) => existing.id === droplet.id)
                );

                set({
                    treasureDroplets: [...existingDroplets, ...newDroplets],
                    dropletsData: uniqueDroplets,
                })
            } catch (error) { console.log('error from treasure droplets', error) }
        },

        GetFeedDroplets: async (page = 1, limit = 5) => {
            // if(page === 0) return;
            try {
                const getFeedCount = async () => {
                    const { count } = await supabase.schema("Ocean").from("Droplet").select('*', { count: 'exact' }).in('user_id', UserStore.getState().anchoringsIds);
                    return count;
                }

                const getFeed = async (lastDroplet = 0) => {
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
                    console.log('getting the feed count');
                    const count = await getFeedCount();
                    console.log('count of the feed', count);

                    await getFeed(count - 1);
                    return 'end';
                }

                return data;
            } catch (error) {
                return console.log(error);
            }
        },

        GetFeedVideos: async () => {
            try {
                const { data: videoData, error } = await supabase.schema("Ocean").rpc('get_feed_videos').not('id', 'is', null);
                if (error || !videoData) {
                    console.log('No Videos found', error);
                    return null;
                }
                // get().setDropletsData(data)
                const organizedData = videoData?.map((data) => {
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
                set({ feedVideos: shuffledVideos, dropletsData: videoData });
                return console.log('feed videos fetched successfully', videoData)
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
                if (data) return data;
                if (error) return console.log("error to fetch single droplet", error)
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
            const channel = supabase
                .channel(`realtime:User:${user.id}_Droplet:${droplet_id}_time:${new Date().getTime()}`)
                .on(
                    "postgres_changes",
                    { event: "INSERT", schema: "Ocean", table: "Droplet" },
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

                            if (!dropletExists) {
                                const updatedDroplets = [newDroplet, ...state.dropletsData]; // Add new droplet to the top
                                // get().setDropletsData(updatedDroplets);
                                return {
                                    dropletsData: [...updatedDroplets],
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
                        console.log('get().dropletDataType', get().dropletDataType)
                        dropletsUpdateFunction(payload, get().dropletDataType)

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


        // Subscribe to Droplet Real-Time Updates
        // subscribeToRippleChanges: (droplet_id) => {
        //     const channel = supabase
        //         .channel(`ripple-updates:${droplet_id}`)
        //         .on(
        //             "postgres_changes",
        //             { event: "*", schema: "Ocean", table: "Ripple", filter: `droplet_id=eq.${droplet_id}` },
        //             (payload) => {
        //                 console.log("Ripple real-time update received:", payload);

        //                 set((state) => {
        //                     const updatedRipples = [...state.dropletRipples];
        //                     const rippleIndex = updatedRipples.findIndex((ripple) => ripple.id === payload.new.id);

        //                     if (payload.eventType === "INSERT") {
        //                         // Add new ripple
        //                         updatedRipples.unshift(payload.new);
        //                     } else if (payload.eventType === "UPDATE") {
        //                         // Update existing ripple
        //                         if (rippleIndex !== -1) {
        //                             updatedRipples[rippleIndex] = payload.new;
        //                         }
        //                     } else {
        //                         console.log('this is deleting payload' , payload)
        //                         // Remove deleted ripple
        //                         if (rippleIndex !== -1) {
        //                             updatedRipples.splice(rippleIndex, 1);
        //                         }
        //                     }

        //                     return { dropletRipples: updatedRipples };
        //                 });
        //             }
        //         )
        //         .subscribe();

        //     return channel;
        // },

        subscribeToRippleChanges: () => {
            const droplet_id = UIStore.getState().rippleDrawerDropletId;

            if (!droplet_id) {
                console.error("No droplet_id found for Ripple subscription.");
                return;
            }

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
            // Subscribe to real-time changes
            const rippleChannel = get().subscribeToRippleChanges();

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