import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserStore } from "./UserStore";
import { errorToast, msgToast } from "@/components/ToasterProvider";

const supabase = createClient();

export const CommunicationStore = create(
    // persist(
    (set, get) => ({
        communicatorId: '',
        setCommunicatorId: (id) => { set({ communicatorId: id }) },
        communicatorDetails: {},
        setCommunicatorDetails: (data) => { set({ communicatorDetails: data }) },

        unreadMsgsCountRefresher: {},
        setUnreadMsgsCountRefresher: (data) => { set({ unreadMsgsCountRefresher: data }) },

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


        SendMessage: async (msgData) => {
            try {
                const communicatorId = get().communicatorId;


                if (communicatorId && msgData) {
                    console.log('communicatorId from the send msg store', communicatorId)
                    console.log('content from the send msg store', msgData)

                    const user = UserStore.getState().profileData;

                    const { data, error } = await supabase.schema("Ocean").from('Message').insert({ ...msgData, sender_id: user.id, receiver_id: communicatorId }).select('*');

                    if (error) {
                        console.log('error from the send msg', error);
                        errorToast(`error to send message: ${error.message} `);
                        return false;
                    }

                    console.log(' sending the message data', data)
                    return true;
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
            communicatorIds.unshift(user.id);
            console.log('array of communicator ids after adding user and in local string:', communicatorIds.toLocaleString())
            // if (!communicatorId || !user) return;

            console.log('starting the real time for messages');

            const channel = supabase
                .channel(`realtime-messages:user${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'Ocean',
                        table: 'Message',
                        // filter: `sender_id=in.(${user.id},${communicatorId})`
                        filter: `sender_id=in.(${communicatorIds.toLocaleString()})`
                    },
                    (payload) => {
                        console.log('Realtime event:', payload);

                        const { eventType, new: newMessage } = payload;

                        const currentCommunicatorDetails = { ...get().communicatorDetails };
                        const currentCommunicatorId = newMessage.sender_id === user.id ? newMessage.receiver_id : newMessage.sender_id;

                        if (eventType === 'INSERT') {
                            currentCommunicatorDetails[currentCommunicatorId] = {
                                ...currentCommunicatorDetails[currentCommunicatorId],
                                messages: [
                                    ...(currentCommunicatorDetails[currentCommunicatorId]?.messages || []),
                                    newMessage,
                                ],
                            };

                        }
                        else if (eventType === 'UPDATE') {

                            const updatedMessage = payload.new;

                            currentCommunicatorDetails[currentCommunicatorId] = {
                                ...currentCommunicatorDetails[currentCommunicatorId],
                                messages: currentCommunicatorDetails[currentCommunicatorId]?.messages?.map((msg) =>
                                    msg.id === updatedMessage.id ? updatedMessage : msg
                                ),
                            };
                        }

                        set({ communicatorDetails: currentCommunicatorDetails });

                        if (newMessage.sender_id === communicatorId && newMessage.sender_id !== user.id) {
                            const markRead = get().MarkMessagesAsRead;
                            const read = async () => {
                                console.log('newMessage.sender_id', newMessage.sender_id)
                                return await markRead(newMessage.sender_id);
                            }
                            read();
                        }
                        if (newMessage.sender_id !== communicatorId && newMessage.receiver_id === user.id) {
                            msgToast(currentCommunicatorDetails[currentCommunicatorId]?.name, currentCommunicatorDetails[currentCommunicatorId]?.avatar, newMessage.content)
                        }

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
    // {
    //     name: 'communicator-store',
    //     getStorage: () => localStorage, // You can replace with sessionStorage
    // }
    // )
)


// import { createClient } from "@/utils/supabase/client";
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