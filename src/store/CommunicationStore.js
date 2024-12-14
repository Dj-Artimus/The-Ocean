import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";
import { UserStore } from "./UserStore";
import { errorToast, msgToast } from "@/components/ToasterProvider";

const supabase = createClient();

export const CommunicationStore = create(
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
            if (!msgData) return false;
            const communicatorId = get().communicatorId;
            const { id: userId } = UserStore.getState().profileData || {};
            if (!communicatorId || !userId) return false;

            try {
                const { data, error } = await supabase
                    .schema("Ocean")
                    .from('Message')
                    .insert({ ...msgData, sender_id: userId, receiver_id: communicatorId }).select();

                if (error) {
                    errorToast(`Error sending message: ${error.message}`);
                    return false;
                }

                console.log('data from send message', data)

                // Optimistic UI update
                set((state) => {
                    const updatedMessages = [...state.communicatorDetails[communicatorId]?.messages || [], { ...data }];
                    return {
                        communicatorDetails: {
                            ...state.communicatorDetails,
                            [communicatorId]: {
                                ...state.communicatorDetails[communicatorId],
                                messages: updatedMessages,
                            },
                        },
                    };
                });

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
                        // filter: `sender_id=in.(${communicatorIds.join(',')})`,
                        filter: `sender_id=eq.(${userId})`,
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
);


