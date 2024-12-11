import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserStore } from "./UserStore";

const supabase = createClient();

export const CommunicationStore = create(
    // persist(
    (set, get) => ({
        communicatorId: '',
        setCommunicatorId: (id) => { set({ communicatorId: id }) },
        communicatorDetails: {},
        setCommunicatorDetails: (data) => { set({ communicatorDetails: data }) },

        FetchCommunicationMessages: async () => {
            try {
                const communicatorId = get().communicatorId;
                if (communicatorId) {
                    const user = UserStore.getState().profileData;

                    const { data, error } = await supabase.schema("Ocean").from('Message').select('*').or(`and(sender_id.eq.${user.id},receiver_id.eq.${communicatorId}),and(sender_id.eq.${communicatorId},receiver_id.eq.${user.id})`).order('created_at', { ascending: true });

                    if (error) console.log('error from the fetching the messages', error)

                    console.log('data from the fetch communications', data)

                    const updateCommunicatorData = { ...get().communicatorDetails };

                    // Safely handle undefined messages
                    const existingMessages = updateCommunicatorData[communicatorId]?.messages || [];

                    // Combine new and existing messages and remove duplicates
                    const combinedMessages = [...existingMessages, ...data];
                    const uniqueMessages = Array.from(
                        new Map(combinedMessages.map(msg => [msg.id, msg])).values()
                    );

                    // Update the communicator details with deduplicated messages
                    updateCommunicatorData[communicatorId] = {
                        ...updateCommunicatorData[communicatorId], // Preserve existing properties
                        messages: uniqueMessages, // Store only unique messages
                    };

                    // Update Zustand state
                    set({ communicatorDetails: updateCommunicatorData });


                    console.log('fetch messages data', data)

                    return data;
                }
            } catch (error) {
                console.log('error from the catch fetching the messages', error)

            }
        },


        SendMessage: async (content) => {
            try {
                const communicatorId = get().communicatorId;


                if (communicatorId && content) {
                    console.log('communicatorId from the send msg store', communicatorId)
                    console.log('content from the send msg store', content)

                    const user = UserStore.getState().profileData;

                    const { data, error } = await supabase.schema("Ocean").from('Message').insert({ content, sender_id: user.id, receiver_id: communicatorId }).select('*');

                    if (error) console.log('error from the send msg', error)

                    console.log(' sending the message data', data)
                    return data;
                }
            } catch (error) {
                console.log(' catch error from send msg', error)
            }
        },

        subscribeToMessages: () => {

            const communicatorId = get().communicatorId;
            const communicatorIds = Object.keys(get().communicatorDetails);
            console.log('array of communicator ids:', communicatorIds)
            const user = UserStore.getState().profileData;

            // if (!communicatorId || !user) return;

            console.log('starting the real time for messages');

            const channel = supabase
                .channel(`realtime-messages:user${user.id}:to:${communicatorIds.toLocaleString()}:time:${new Date().getTime()}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'Ocean',
                        table: 'Message',
                        filter: `sender_id=in.(${user.id},${communicatorId})`
                    },
                    (payload) => {
                        console.log('Realtime event:', payload);

                        const { eventType, new: newMessage } = payload;

                        const currentCommunicatorDetails = { ...get().communicatorDetails };

                        if (eventType === 'INSERT') {
                            currentCommunicatorDetails[communicatorId] = {
                                ...currentCommunicatorDetails[communicatorId],
                                messages: [
                                    ...(currentCommunicatorDetails[communicatorId]?.messages || []),
                                    newMessage,
                                ],
                            };
                            
                        }
                        else if (eventType === 'UPDATE') {

                            const updatedMessage = payload.new;

                            currentCommunicatorDetails[communicatorId] = {
                                ...currentCommunicatorDetails[communicatorId],
                                messages: currentCommunicatorDetails[communicatorId]?.messages?.map((msg) =>
                                    msg.id === updatedMessage.id ? updatedMessage : msg
                                ),
                            };
                        }

                        set({ communicatorDetails: currentCommunicatorDetails });

                    }
                ).on(
                    'postgres_changes',
                    {
                        event: 'DELETE',
                        schema: 'Ocean',
                        table: 'Message'
                    },
                    (payload) => {
                        console.log('Realtime event for delete:', payload);

                        const currentCommunicatorDetails = { ...get().communicatorDetails };
                        if (payload.eventType === 'DELETE') {

                            const deletedMessage = payload.old;

                            currentCommunicatorDetails[communicatorId] = {
                                ...currentCommunicatorDetails[communicatorId],
                                messages: currentCommunicatorDetails[communicatorId]?.messages?.filter((msg) => msg.id !== deletedMessage.id),
                            };
                        }

                        set({ communicatorDetails: currentCommunicatorDetails });

                    }
                )
                .subscribe();

            console.log(channel.state); // Should log 'subscribed'

            return channel;
        },

        FetchUnreadMessagesCount: async (sender_id) => {
            const user = UserStore.getState().profileData;
            if (user) {
                const { data, error } = await supabase
                    .schema('Ocean')
                    .from('Message')
                    .select('id')
                    .eq('receiver_id', user.id)
                    .eq('sender_id', sender_id)
                    .eq('is_read', false);

                if (error) {
                    console.error('Error fetching unread messages:', error);
                    return 0;
                }

                console.log('data.length from unread msg count', data.length)

                return data.length === 0 ? 0 : data.length;
            }
        },

        MarkMessagesAsRead: async (senderId) => {
            const user = UserStore.getState().profileData; // Fetch the logged-in user data
            if (user) {
                const { error } = await supabase.schema('Ocean')
                    .from('Message') // Update the appropriate table
                    .update({ is_read: true }) // Set is_read to true
                    .eq('receiver_id', user.id) // Receiver is the logged-in user
                    .eq('sender_id', senderId) // Messages are from the sender
                    .eq('is_read', false);

                if (error) {
                    console.error("Failed to mark messages as read:", error);
                }
            }
        },


    }),
    {
        // name: 'communicator-store',
        // getStorage: () => localStorage, // You can replace with sessionStorage
    }
)
// )