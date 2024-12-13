import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserStore } from "./UserStore";
import { errorToast, msgToast } from "@/components/ToasterProvider";

const supabase = createClient();


export const CommunicationStore = create(
    //   persist(
    (set, get) => ({
        communicatorId: '',
        communicatorDetails: {},
        unreadMsgsCountRefresher: {},

        setCommunicatorId: (id) => set({ communicatorId: id }),
        setCommunicatorDetails: (data) => set({ communicatorDetails: data }),
        setUnreadMsgsCountRefresher: (data) => set({ unreadMsgsCountRefresher: data }),

        FetchCommunicationMessages: async () => {
            try {
                const { communicatorId } = get();
                const { id: userId } = UserStore.getState().profileData || {};
                if (!communicatorId || !userId) return;

                const { data, error } = await supabase
                    .schema("Ocean")
                    .from('Message')
                    .select('*')
                    .or(`and(sender_id.eq.${userId},receiver_id.eq.${communicatorId}),and(sender_id.eq.${communicatorId},receiver_id.eq.${userId})`)
                    .order('created_at', { ascending: true });

                if (error) throw error;

                const updateCommunicatorData = { ...get().communicatorDetails };
                const existingMessages = updateCommunicatorData[communicatorId]?.messages || [];
                const uniqueMessages = [...new Map([...existingMessages, ...data].map(msg => [msg.id, msg])).values()];

                updateCommunicatorData[communicatorId] = {
                    ...updateCommunicatorData[communicatorId],
                    messages: uniqueMessages,
                };

                set({ communicatorDetails: updateCommunicatorData });
                return uniqueMessages;
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        },

        SendMessage: async (msgData) => {
            try {
                const { communicatorId } = get();
                const { id: userId } = UserStore.getState().profileData || {};
                if (!communicatorId || !userId || !msgData) return false;

                const { error } = await supabase
                    .schema("Ocean")
                    .from('Message')
                    .insert({ ...msgData, sender_id: userId, receiver_id: communicatorId });

                if (error) {
                    errorToast(`Error sending message: ${error.message}`);
                    return false;
                }

                return true;
            } catch (error) {
                console.error('Error sending message:', error);
                return false;
            }
        },

        subscribeToMessages: () => {
            const { communicatorId, communicatorDetails } = get();
            const { id: userId } = UserStore.getState().profileData || {};
            if (!userId) return;

            const communicatorIds = [userId, ...Object.keys(communicatorDetails)];
            const channel = supabase
                .channel(`realtime-messages:user${userId}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'Ocean',
                        table: 'Message',
                        filter: `sender_id=in.(${communicatorIds.join(',')})`,
                    },
                    (payload) => {
                        const { eventType, new: newMessage } = payload;
                        const currentCommunicatorId = newMessage.sender_id === userId ? newMessage.receiver_id : newMessage.sender_id;
                        const currentCommunicatorDetails = { ...get().communicatorDetails };

                        if (eventType === 'INSERT' || eventType === 'UPDATE') {
                            const messages = currentCommunicatorDetails[currentCommunicatorId]?.messages || [];
                            currentCommunicatorDetails[currentCommunicatorId] = {
                                ...currentCommunicatorDetails[currentCommunicatorId],
                                messages: eventType === 'INSERT' ? [...messages, newMessage] : messages.map(msg => msg.id === newMessage.id ? newMessage : msg),
                            };
                        } else if (eventType === 'DELETE') {
                            const { old: deletedMessage } = payload;
                            currentCommunicatorDetails[currentCommunicatorId] = {
                                ...currentCommunicatorDetails[currentCommunicatorId],
                                messages: currentCommunicatorDetails[currentCommunicatorId]?.messages?.filter(msg => msg.id !== deletedMessage.id),
                            };
                        }

                        set({ communicatorDetails: currentCommunicatorDetails });
                        if (newMessage.sender_id === communicatorId && newMessage.receiver_id === userId && !newMessage.is_read) {
                            get().handleMessageRead(newMessage.id);
                        }
                        if (newMessage.sender_id !== communicatorId && newMessage.receiver_id === userId) {
                            msgToast(currentCommunicatorDetails[currentCommunicatorId]?.name, currentCommunicatorDetails[currentCommunicatorId]?.avatar, newMessage.content);
                        }

                    }
                )
                .subscribe();

            return channel;
        },

        FetchUnreadMessagesCount: async (sender_id) => {
            try {
                const { id: userId } = UserStore.getState().profileData || {};
                if (!userId) return 0;

                const { data, error } = await supabase
                    .schema('Ocean')
                    .from('Message')
                    .select('id')
                    .eq('receiver_id', userId)
                    .eq('sender_id', sender_id)
                    .eq('is_read', false);

                if (error) throw error;
                return data.length || 0;
            } catch (error) {
                console.error('Error fetching unread messages:', error);
                return 0;
            }
        },

        handleMessageRead: async (messageId) => {
            try {
                if (!messageId) return;

                const { error } = await supabase
                    .schema('Ocean')
                    .from('Message')
                    .update({ is_read: true })
                    .eq('id', messageId);

                if (error) throw error;
            } catch (error) {
                console.error('Failed to mark message as read:', error);
            }
        },

        MarkMessagesAsRead: async (senderId) => {
            try {
                const { id: userId } = UserStore.getState().profileData || {};
                if (!userId) return;

                const { error } = await supabase
                    .schema('Ocean')
                    .from('Message')
                    .update({ is_read: true })
                    .eq('receiver_id', userId)
                    .eq('sender_id', senderId)
                    .eq('is_read', false);
                if (error) throw error;
            } catch (error) {
                console.error('Failed to mark messages as read:', error);
            }
        },

    }),
    //     {
    //       name: 'communicator-store',
    //       getStorage: () => localStorage,
    //     }
    //   )
);

// import { create } from "zustand";
// import { UserStore } from "./UserStore";
// import { errorToast, msgToast } from "@/components/ToasterProvider";
// import { debounce } from "lodash";

// const supabase = createClient();

// export const CommunicationStore = create((set, get) => ({
//     communicatorId: '',
//     communicatorDetails: {},
//     messageQueue: [],
//     isOnline: true,
//     lastSyncTimestamp: null,

//     setCommunicatorId: (id) => {
//         set({ communicatorId: id });
//         // Fetch messages when switching communicator
//         get().FetchCommunicationMessages();
//     },

//     setCommunicatorDetails: (data) => {
//         set({ communicatorDetails: data });
//     },

//     // Message Queue Management
//     processMessageQueue: async () => {
//         const queue = get().messageQueue;
//         const currentQueue = [...queue];

//         for (const message of currentQueue) {
//             if (message.status === 'queued' || (message.status === 'failed' && (message.retry_count || 0) < 3)) {
//                 try {
//                     await get().sendMessageToServer(message);
//                     // Remove from queue if successful
//                     set({
//                         messageQueue: get().messageQueue.filter(m => m.id !== message.id)
//                     });
//                 } catch (error) {
//                     // Update retry count and status
//                     const updatedMessage = {
//                         ...message,
//                         status: 'failed',
//                         retry_count: (message.retry_count || 0) + 1
//                     };
//                     set({
//                         messageQueue: get().messageQueue.map(m =>
//                             m.id === message.id ? updatedMessage : m
//                         )
//                     });
//                 }
//             }
//         }
//     },

//     // Optimized message fetching with pagination
//     FetchCommunicationMessages: async (limit = 50) => {
//         const communicatorId = get().communicatorId;
//         const user = UserStore.getState().profileData;

//         if (!communicatorId || !user) return;

//         const currentDetails = get().communicatorDetails[communicatorId];
//         const lastMessage = currentDetails?.messages?.[0];

//         try {
//             const query = supabase.schema("Ocean")
//                 .from('Message')
//                 .select('*')
//                 .or(`and(sender_id.eq.${user.id},receiver_id.eq.${communicatorId}),and(sender_id.eq.${communicatorId},receiver_id.eq.${user.id})`)
//                 .order('created_at', { ascending: false })
//                 .limit(limit);

//             if (lastMessage) {
//                 query.lt('created_at', lastMessage.created_at);
//             }

//             const { data, error } = await query;

//             if (error) throw error;

//             const messages = data.reverse();
//             const updatedDetails = {
//                 ...get().communicatorDetails,
//                 [communicatorId]: {
//                     ...currentDetails,
//                     messages: [...(currentDetails?.messages || []), ...messages],
//                     hasMoreMessages: messages.length === limit,
//                     lastSyncTimestamp: new Date().toISOString()
//                 }
//             };

//             set({ communicatorDetails: updatedDetails });

//             // Mark messages as read if this is the current conversation
//             if (communicatorId === get().communicatorId) {
//                 get().MarkMessagesAsRead(communicatorId);
//             }

//             return messages;
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//             errorToast('Failed to fetch messages');
//         }
//     },

//     // Optimized message sending with queue
//     SendMessage: async (msgData) => {
//         const communicatorId = get().communicatorId;
//         const user = UserStore.getState().profileData;

//         if (!communicatorId || !user) return false;

//         const newMessage = {
//             ...msgData,
//             sender_id: user.id,
//             receiver_id: communicatorId,
//             status: 'queued',
//         };

//         // Add to local state immediately
//         const currentDetails = get().communicatorDetails[communicatorId];
//         set({
//             communicatorDetails: {
//                 ...get().communicatorDetails,
//                 [communicatorId]: {
//                     ...currentDetails,
//                     messages: [...(currentDetails?.messages || []), newMessage]
//                 }
//             },
//             messageQueue: [...get().messageQueue, newMessage]
//         });

//         // Process queue
//         get().processMessageQueue();
//         return true;
//     },

//     // Actual server send implementation
//     sendMessageToServer: async (message) => {
//         try {
//             const { data, error } = await supabase.schema("Ocean")
//                 .from('Message')
//                 .insert({
//                     content: message.content,
//                     sender_id: message.sender_id,
//                     receiver_id: message.receiver_id
//                 })
//                 .select('*')
//                 .single();

//             if (error) throw error;

//             // Update message status in local state
//             const currentDetails = get().communicatorDetails[message.receiver_id];
//             set({
//                 communicatorDetails: {
//                     ...get().communicatorDetails,
//                     [message.receiver_id]: {
//                         ...currentDetails,
//                         messages: currentDetails.messages.map(m =>
//                             m.id === message.id ? { ...data, status: 'sent' } : m
//                         )
//                     }
//                 }
//             });

//             return data;
//         } catch (error) {
//             console.error('Error sending message:', error);
//             throw error;
//         }
//     },

//     // Optimized real-time subscription
//     subscribeToMessages: () => {
//         const user = UserStore.getState().profileData;
//         if (!user) return;

//         const channel = supabase
//             .channel(`messages:${user.id}`)
//             .on(
//                 'postgres_changes',
//                 {
//                     event: '*',
//                     schema: 'Ocean',
//                     table: 'Message',
//                     filter: `receiver_id=eq.${user.id}`
//                 },
//                 debounce((payload) => {
//                     const { eventType, new: newMessage } = payload;

//                     if (eventType === 'INSERT') {
//                         const currentDetails = get().communicatorDetails[newMessage.sender_id];

//                         // Update local state
//                         set({
//                             communicatorDetails: {
//                                 ...get().communicatorDetails,
//                                 [newMessage.sender_id]: {
//                                     ...currentDetails,
//                                     messages: [...(currentDetails?.messages || []), newMessage]
//                                 }
//                             }
//                         });

//                         // Show notification if not in current conversation
//                         if (newMessage.sender_id !== get().communicatorId) {
//                             const sender = get().communicatorDetails[newMessage.sender_id];
//                             msgToast(sender?.name, sender?.avatar, newMessage.content);
//                         } else {
//                             // Mark as read if in current conversation
//                             get().MarkMessagesAsRead(newMessage.sender_id);
//                         }
//                     }
//                 }, 100)
//             )
//             .subscribe();

//         return channel;
//     },

//     // Optimized read status management
//     MarkMessagesAsRead: debounce(async (senderId) => {
//         const user = UserStore.getState().profileData;
//         if (!user) return;

//         try {
//             const { error } = await supabase.schema('Ocean')
//                 .from('Message')
//                 .update({ is_read: true })
//                 .eq('receiver_id', user.id)
//                 .eq('sender_id', senderId)
//                 .eq('is_read', false);

//             if (error) throw error;

//             // Update local state
//             const currentDetails = get().communicatorDetails[senderId];
//             set({
//                 communicatorDetails: {
//                     ...get().communicatorDetails,
//                     [senderId]: {
//                         ...currentDetails,
//                         messages: currentDetails.messages.map(m =>
//                             m.sender_id === senderId && !m.is_read
//                                 ? { ...m, is_read: true }
//                                 : m
//                         )
//                     }
//                 }
//             });
//         } catch (error) {
//             console.error('Error marking messages as read:', error);
//         }
//     }, 500)
// }));