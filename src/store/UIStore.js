
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const UIStore = create(
    persist((set) => ({
    darkModeOn: false,
    toggleDarkMode: (mode) => {
        set({ darkModeOn: mode })
    },

    expectedVersion: false,
    setExpectedVersion: (state) => {
        set({ expectedVersion: state })
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
    },
    isShareOptionsModalOpen: false,
    setIsShareOptionsModalOpen: (state) => {
        set({ isShareOptionsModalOpen: state })
    },
    dropletIdToShare: '',
    setDropletIdToShare: (id) => {
        set({ dropletIdToShare: id })
    },

    dropletContentToShare: '',
    setDropletContentToShare: (content) => {
        set({ dropletContentToShare: content })
    },

    notificationsCount : 0,
    setNotificationsCount: (count) => { set({notificationsCount: count}) },

}), {
    name: 'ui-store', // Storage key in localStorage
    getStorage: () => localStorage, // You can replace with sessionStorage
} ))