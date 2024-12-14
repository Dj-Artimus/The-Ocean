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
                const { communicatorId, communicatorDetails } = get();
                const userId = UserStore.getState().profileData?.id;

                console.log('userId', userId)
                console.log('fetching the communication messages...')

                if (!userId || !communicatorId) return null;

                console.log('communicatorId from the fetch communication messages', communicatorId);
                console.log('communicatorDetails from the fetch communication messages', communicatorDetails);

                const lastMessageCreatedAt = communicatorDetails?.[communicatorId]?.messages?.[0]?.created_at;

                console.log('lastMessageCreatedAt', lastMessageCreatedAt)

                const query = supabase
                    .schema("Ocean")
                    .from('Message')
                    .select('*')
                    .or(
                        `and(sender_id.eq.${userId},receiver_id.eq.${communicatorId}),and(sender_id.eq.${communicatorId},receiver_id.eq.${userId})`
                    )
                    .order('created_at', { ascending: true })
                    .limit(12);

                if (lastMessageCreatedAt) {
                    query.gt('created_at', lastMessageCreatedAt);
                }

                const { data, error } = await query;
                if (error) throw error;

                if (!data) return null;

                console.log('data from fetching the messages ', data)

                const updateCommunicatorData = {
                    ...communicatorDetails,
                    [communicatorId]: {
                        ...communicatorDetails[communicatorId],
                        messages: [
                            ...new Map([
                                ...(communicatorDetails[communicatorId]?.messages || []),
                                ...data
                            ].map(msg => [msg.id, msg]))
                                .values()
                        ]
                    }
                };

                set({ communicatorDetails: updateCommunicatorData });
                return updateCommunicatorData[communicatorId].messages;
            } catch (error) {
                console.error('Error fetching messages:', error);
                errorToast('Error fetching messages', error.message);
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

                // Optimistic UI update
                set((state) => {
                    const updatedMessages = [...state.communicatorDetails[communicatorId]?.messages || [], data[0]];
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
            const handlePayload = async (payload) => {
                console.log('payload from subscribeToMessages', payload)
                const { eventType, new: newMessage } = payload;
                const currentCommunicatorId = newMessage.sender_id === userId ? newMessage.receiver_id : newMessage.sender_id;
                const currentCommunicatorDetails = { ...get().communicatorDetails };

                if (eventType === 'INSERT' || eventType === 'UPDATE') {
                    let is_read = false;
                    if (newMessage.sender_id === communicatorId && newMessage.receiver_id === userId && !newMessage.is_read) {
                        await get().handleMessageRead(newMessage.id);
                        is_read = true;
                    }
                    const messages = currentCommunicatorDetails[currentCommunicatorId]?.messages || [];
                    currentCommunicatorDetails[currentCommunicatorId] = {
                        ...currentCommunicatorDetails[currentCommunicatorId],
                        messages: eventType === 'INSERT' ? [...messages, { ...newMessage, is_read }] : messages.map(msg => msg.id === newMessage.id ? newMessage : msg),
                    };
                } else if (eventType === 'DELETE') {
                    const { old: deletedMessage } = payload;
                    currentCommunicatorDetails[currentCommunicatorId] = {
                        ...currentCommunicatorDetails[currentCommunicatorId],
                        messages: currentCommunicatorDetails[currentCommunicatorId]?.messages?.filter(msg => msg.id !== deletedMessage.id),
                    };
                }

                set({ communicatorDetails: currentCommunicatorDetails });
                if (newMessage.sender_id !== communicatorId && newMessage.receiver_id === userId && eventType === 'INSERT') {
                    msgToast(currentCommunicatorDetails[currentCommunicatorId]?.name, currentCommunicatorDetails[currentCommunicatorId]?.avatar, newMessage.content);
                }

            };

            const channel = supabase
                .channel(`realtime-messages:user${userId}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'Ocean',
                        table: 'Message',
                        // filter: `sender_id=in.(${communicatorIds.join(',')})`,
                        filter: `receiver_id=eq.${userId}`,
                    }, (payload) => handlePayload(payload) // Pass payload to handlePayload
                )
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'Ocean',
                        table: 'Message',
                        // filter: `sender_id=in.(${communicatorIds.join(',')})`,
                        filter: `sender_id=eq.${userId}`,
                    }, (payload) => handlePayload(payload)
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


