import { errorToast, successToast } from '@/components/ToasterProvider';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import { create } from 'zustand';

const supabase = createClient();
const options = {
    redirectTo: `http://localhost:3000/auth/callback`,
};

export const UIStore = create((set) => ({
    darkModeOn: false,
    toggleDarkMode: (mode) => {
        set({ darkModeOn: mode })
    },

    isUILoading: true,
    setIsUILoading: (state) => {
        set({ isUILoading: state })
    },

    isMediaFileUploading: false,
    setIsMediaFileUploading: (state) => {
        set({ isMediaFileUploading: state })
    },

    isProcessing: false,
    setIsProcessing: (state) => {
        set({ isProcessing: state })
    },

    isMsgsOpen: false,
    setIsMsgsOpen: (state) => {
        set({ isMsgsOpen: state })
    },

    isOCardOpen: false,
    setIsOCardOpen: (state) => {
        set({ isOCardOpen: state })
    },

    profileTreasureTabIndex: 1,
    setProfileTreasureTabIndex: (index) => {
        set({ profileTreasureTabIndex: index })
    },

    isRippleDrawerOpen: false,
    setIsRippleDrawerOpen: (state) => {
        set({ isRippleDrawerOpen: state })
    },

    rippleDrawerDropletId: '',
    setRippleDrawerDropletId: (id) => {
        set({ rippleDrawerDropletId: id })
    },

    dropletsRefreshId: '',
    setDropletsRefreshId: (id) => {
        set({ dropletsRefreshId: id })
    },

    ripplesRefreshId: '',
    setRipplesRefreshId: (id) => {
        set({ ripplesRefreshId: id })
    },

    isMoreOptionsModalOpen: false,
    setIsMoreOptionsModalOpen: (state) => {
        set({ isMoreOptionsModalOpen: state })
    },

    contentEditId: '',
    setContentEditId: (id) => {
        set({ contentEditId: id })
    },

    contentToEdit: '',
    setContentToEdit: (content) => {
        set({ contentToEdit: content })
    },

    contentToEditType: '',
    setContentToEditType: (type) => {
        set({ contentToEditType: type })
    },

    isCreateDropletModalOpen: false,
    setIsCreateDropletModalOpen: (state) => {
        set({ isCreateDropletModalOpen: state })
    },

    isProfileEditModalOpen: false,
    setIsProfileEditModalOpen: (state) => {
        set({ isProfileEditModalOpen: state })
    },

    isContentExpanded: false,
    setIsContentExpanded: (state) => {
        set({ isContentExpanded: state })
    },

    imgViewerSources: [],
    setImgViewerSources: (img) => {
        set({ imgViewerSources: img })
    },

    vidViewerSources: [],
    setVidViewerSources: (vid) => {
        set({ vidViewerSources: vid })
    },

    imgViewerIndex: 0,
    setImgViewerIndex: (index) => {
        set({ imgViewerIndex: index })
    },

    vidViewerIndex: 0,
    setVidViewerIndex: (index) => {
        set({ vidViewerIndex: index })
    },

    isVideoMuted: true,
    setIsVideoMuted: (state) => {
        set({ isVideoMuted: state })
    }

}))

export const AuthStore = create((set) => ({

    SignUpUser: async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options
            });

            if (error) {
                toast.error("Error signing up");
                console.log('Error signing up:', error.message);
                // Display an error message to the user
                return;
            }
            toast.success('Email sent successfully');
            console.log(data);
            redirect('/verify-email');
        } catch (err) {
            console.log('Sign-up failed:', err);
        }
    },

    Logout: async () => {
        try {
            let { error } = await supabase.auth.signOut()
            if (error) {
                return console.log(error);
            }
            return successToast("Logout Successfully");
        } catch (error) {
            console.log(error);
            return errorToast('Logout Failed , Please try again !')
        }
    },

    OAuthLogin: async (provider) => {
        try {
            let { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options
            })
            if (error) {
                toast.error("Something went wrong, Please try again")
                return console.log(error);
            }
            console.log(data)
            return data
        } catch (error) {
            return console.log(error);
        }
    }

}))


export const UserStore = create((set) => ({
    isAuthenticated: false,
    setIsAuthenticated: (status) => set({ isAuthenticated: status }),

    GetUser: async () => {
        try {
            const { data, error } = await supabase.auth.getUser();

            // console.log(data.user)
            if (error || !data) {
                console.log('No session found');
                return null;
            }
            return data.user;
        } catch (error) {
            return console.log(error);
        }
    },

    
    GetUserId: async () => {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data) {
                console.log('No session found');
                return null;
            }
            console.log(data)
            return data.user.id;
        } catch (error) {
            return console.log(error);
        }
    },

    GetUserProfile: async () => {
        const getUserId = UserStore.getState().GetUserId;
        const user_id = await getUserId();
        try {
            const { data, error } = await supabase.schema("Ocean").from("Profile").select().eq('user_id', user_id);

            // console.log(data)
            if (error || !data) {
                console.log('No Profile found');
                return null;
            }
            return data[0];
        } catch (error) {
            return console.log(error);
        }
    },

    profileData: {},
    setProfileData: (data) => { set({ profileData: data }) },

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
    UpdateUsername: async (username, user_id) => {
        try {
            const { error } = await supabase.schema("Ocean").from('Profile').update({ username }).eq('user_id', user_id)

            if (error) {
                console.log('Something Went Wrong : ', error);
                return null;
            } else {
                console.log('Username is Updated');
                return true;
            }
        } catch (error) {
            return console.log(error);
        }
    },
    CreateProfile: async (profileData) => {
        const getUserId = UserStore.getState().GetUserId;
        const user_id = await getUserId();
        try {
            const { error } = await supabase.schema("Ocean").from('Profile').update({ ...profileData, user_id }).eq('user_id', user_id)

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
    }
}));

export const DropletStore = create((set,get) => ({

    DropDroplet: async (dropletData) => {
        const user = UserStore.getState().profileData;
        const user_id = user.id ;
        const refreshDroplet = UIStore.getState().setDropletsRefreshId;
        try {
            const { error } = await supabase.schema("Ocean").from('Droplet').insert({ ...dropletData, 'user_id': user_id })

            if (error) {
                console.log('Something Went Wrong : ', error);
                errorToast('Something Went Wrong');
                return null;
            } else {
                console.log('Droplet is Droped');
                successToast('Droplet is droped successfully');
                refreshDroplet(Math.random())
                return true;
            }
        } catch (error) {
            return console.log(error);
        }
    },

    StarDroplet: async (droplet_id) => {
        const user = UserStore.getState().profileData;
        const user_id = user.id ;
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
        const user_id = user.id ;
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
        const user_id = user.id ;
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
        const user_id = user.id ;
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
        const user_id = user.id ;
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

    CheckIsUserGemDroplet: async (droplet_id) => {
        const user = UserStore.getState().profileData;
        const user_id = user.id ;
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

    RippleDroplet: async (droplet_id, content) => {
        const user = UserStore.getState().profileData;
        const user_id = user.id ;
        try {
            const { data, error } = await supabase.schema("Ocean").from('Ripple').insert({ droplet_id, 'user_id': user_id, content }).select();

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

    CheckIsUserRippleDroplet: async (droplet_id) => {
        const user = UserStore.getState().profileData;
        const user_id = user.id ;
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

    GetRipples: async (droplet_id) => {
        try {
            const { data, error } = await supabase.schema("Ocean").from('Ripple').select('*,user_id(*)').eq('droplet_id', droplet_id).order('created_at', { ascending: false })

            if (error) {
                console.log('Something Went Wrong to get ripples : ', error);
                errorToast('Something Went Wrong');
                return null;
            } else {
                return data;
            }
        } catch (error) {
            return console.log(error);
        }
    },

    GetUserDroplets: async () => {
        const user = UserStore.getState().profileData;
        const user_id = user.id ;
        console.log(user.id)
        try {
            const { data, error } = await supabase.schema("Ocean").from("Droplet").select('*,user_id(*)').eq('user_id', user_id).order('created_at', { ascending: false });
            console.log(data)
            if (error || !data) {
                console.log('No droplets found', error);
                return null;
            }
            return data
        } catch (error) {
            return console.log(error);
        }
    },

    GetUserStaredDroplets: async () => {
        const user = UserStore.getState().profileData;
        const user_id = user.id ;
        try {
            const { data, error } = await supabase.schema("Ocean").from("Star").select('*,droplet_id(*,user_id(*))').eq('user_id', user_id).not('droplet_id' , 'is', null).order('created_at', { ascending: false });
            console.log(data)
            if (error || !data) {
                console.log('No Profile found');
                return null;
            }
            return data
        } catch (error) {
            return console.log(error);
        }
    },

    GetUserGemmedDroplets: async () => {
        const user = UserStore.getState().profileData;
        const user_id = user.id ;
        try {
            const { data, error } = await supabase.schema("Ocean").from("Gem").select('*,droplet_id(*,user_id(*))').eq('user_id', user_id).not('droplet__d', 'is', null).order('created_at', { ascending: false });
            console.log(data)
            if (error || !data) {
                console.log('No Profile found');
                return null;
            }
            return data
        } catch (error) {
            return console.log(error);
        }
    },

    GetUserRippledDroplets: async () => {
        const user = UserStore.getState().profileData;
        const userid = user.id ;
        try {
            // Replace table query with RPC call
            const { data, error } = await supabase.schema("Ocean").rpc('get_unique_ripple_droplets', { userid });

            if (error || !data) {
                console.error('Error fetching rippled droplets:', error || 'No data returned');
                return null;
            }

            console.log('Unique user rippled droplets:', data);
            return data;
        } catch (error) {
            console.error('Unexpected error:', error);
            return null;
        }
    },

    GetFeedDroplets: async () => {
        try {
            const { data, error } = await supabase.schema("Ocean").from("Droplet").select('*,user_id(*)').order('created_at', {ascending: false} );
            if (error || !data) {
                console.log('No Profile found');
                return null;
            }
            return data
        } catch (error) {
            return console.log(error);
        }
    },


    GetFeedVideos: async () => {
        try {
            const { data, error } = await supabase.schema("Ocean").rpc('get_feed_videos').not('id', 'is', null);
            if (error || !data) {
                console.log('No Videos found', error);
                return null;
            }
            return data
        } catch (error) {
            return console.log(error);
        }
    },

}))



