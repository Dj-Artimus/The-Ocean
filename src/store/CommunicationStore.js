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

                if (!userId || !communicatorId) return null;

                const messages = communicatorDetails?.[communicatorId]?.messages || [];
                console.log(' current messages from fetch message ', messages)
                const lastMessageCreatedAt = messages?.[messages?.length - 1]?.created_at;
                console.log("Last message timestamp:", lastMessageCreatedAt);



                const query = supabase
                    .schema("Ocean")
                    .from("Message")
                    .select("*")
                    .or(
                        `and(sender_id.eq.${userId},receiver_id.eq.${communicatorId}),and(sender_id.eq.${communicatorId},receiver_id.eq.${userId})`
                    )
                    .order("created_at", { ascending: false })
                    .limit(12);

                if (lastMessageCreatedAt) {
                    query.lt("created_at", lastMessageCreatedAt); // Fetch older messages
                }

                const { data, error } = await query;
                if (error) throw error;

                if (!data || data.length === 0) return null;

                console.log("Last message timestamp:", lastMessageCreatedAt);
                console.log("Fetched messages:", data);


                const updatedMessages = [
                    ...new Map(
                        [
                            ...(communicatorDetails[communicatorId]?.messages || []),
                            ...data,
                        ].map((msg) => [msg.id, msg])
                    ).values(),
                ];
                console.log("Updated messages state:", updatedMessages);

                // Update communicator details
                const updateCommunicatorData = {
                    ...communicatorDetails,
                    [communicatorId]: {
                        ...communicatorDetails[communicatorId],
                        messages: updatedMessages,
                    },
                };

                set({ communicatorDetails: updateCommunicatorData });


                return data;
            } catch (error) {
                console.error("Error fetching messages:", error);
                errorToast("Error fetching messages", error.message);
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
                    const updatedMessages = [data[0], ...state.communicatorDetails[communicatorId]?.messages || []];
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
            const { id: userId } = UserStore.getState().profileData || {};
            if (!userId) return;

            const handlePayload = async (payload) => {
                const { eventType, new: newMessage } = payload;
                const currentCommunicatorDetails = structuredClone(get().communicatorDetails);
                const currentCommunicatorId = newMessage?.sender_id === userId ? newMessage?.receiver_id : newMessage?.sender_id;
                const communicatorId = get().communicatorId;

                if (eventType === 'INSERT' || eventType === 'UPDATE') {
                    let is_read = false;
                    const messages = currentCommunicatorDetails[currentCommunicatorId]?.messages || [];

                    if (newMessage && newMessage.sender_id === communicatorId && newMessage.receiver_id === userId && !newMessage.is_read) {
                        await get().handleMessageRead(newMessage.id);
                        is_read = true;
                    }

                    currentCommunicatorDetails[currentCommunicatorId] = {
                        ...currentCommunicatorDetails[currentCommunicatorId],
                        messages: eventType === 'INSERT'
                            ? [{ ...newMessage, is_read }, ...messages.filter(msg => msg.id !== newMessage.id)]
                            : messages.map(msg => msg.id === newMessage.id ? newMessage : msg),
                    };
                } else if (eventType === 'DELETE') {
                    // Filter out the deleted message by its ID
                    const messages = currentCommunicatorDetails[communicatorId]?.messages || [];
                    currentCommunicatorDetails[communicatorId] = {
                        ...currentCommunicatorDetails[communicatorId],
                        messages: messages.filter(msg => msg.id !== payload.old.id),
                    };
                }

                set((state) => ({
                    communicatorDetails: {
                        ...state.communicatorDetails,
                        ...currentCommunicatorDetails,
                    },
                }));

                if (
                    eventType === 'INSERT' &&
                    newMessage?.receiver_id === userId && // Message is sent to the current user
                    newMessage?.sender_id !== communicatorId && // Sender is not the current communicator
                    newMessage?.receiver_id !== communicatorId // Receiver is not the current communicator (not actively chatting)
                ) {
                    msgToast(currentCommunicatorId,
                        currentCommunicatorDetails[currentCommunicatorId]?.name,
                        currentCommunicatorDetails[currentCommunicatorId]?.avatar,
                        newMessage?.content
                    );
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
                        filter: `receiver_id=eq.${userId}`,
                    }, handlePayload // Pass payload to handlePayload
                )
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'Ocean',
                        table: 'Message',
                        filter: `sender_id=eq.${userId}`,
                    }, handlePayload // Pass payload to handlePayload
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'DELETE',
                        schema: 'Ocean',
                        table: 'Message',
                    }, handlePayload
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

