import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Channel, Message, Server } from '../types';
import { SERVERS, DM_CHANNELS, USERS } from '../data/mockData';

interface ChatState {
  // Data
  servers: Server[];
  dmChannels: Channel[];
  users: typeof USERS;

  // Selection
  activeServerId: string;
  activeChannelId: string;

  // Derived helpers
  getActiveServer: () => Server | undefined;
  getActiveChannel: () => Channel | undefined;
  getUser: (id: string) => typeof USERS[0] | undefined;
  getAllChannels: () => Channel[];

  // Actions
  selectServer: (serverId: string) => void;
  selectChannel: (channelId: string) => void;
  sendMessage: (content: string, authorId: string, imageUrl?: string) => void;
  addReaction: (channelId: string, messageId: string, emoji: string, userId: string) => void;
  markChannelRead: (channelId: string) => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      servers: SERVERS,
      dmChannels: DM_CHANNELS,
      users: USERS,
      activeServerId: SERVERS[0].id,
      activeChannelId: SERVERS[0].channels[0].id,

      // --- Derived helpers ---
      getActiveServer: () => {
        const { servers, activeServerId } = get();
        return servers.find((s) => s.id === activeServerId);
      },

      getActiveChannel: () => {
        const { activeChannelId, getActiveServer, dmChannels } = get();
        const serverChannel = getActiveServer()
          ?.channels.find((c) => c.id === activeChannelId);
        return serverChannel ?? dmChannels.find((c) => c.id === activeChannelId);
      },

      getUser: (id) => get().users.find((u) => u.id === id),

      getAllChannels: () => {
        const { servers, dmChannels } = get();
        return [...servers.flatMap((s) => s.channels), ...dmChannels];
      },

      // --- Actions ---
      selectServer: (serverId) =>
        set((state) => {
          const server = state.servers.find((s) => s.id === serverId);
          const firstChannel = server?.channels[0];
          return {
            activeServerId: serverId,
            activeChannelId: firstChannel?.id ?? state.activeChannelId,
          };
        }, false, 'chat/selectServer'),

      selectChannel: (channelId) => {
        set({ activeChannelId: channelId }, false, 'chat/selectChannel');
        get().markChannelRead(channelId);
      },

      sendMessage: (content, authorId, imageUrl) => {
        if (!content.trim() && !imageUrl) return;
        const { activeChannelId } = get();
        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          authorId,
          content: content.trim(),
          ...(imageUrl ? { imageUrl } : {}),
          timestamp: new Date(),
          reactions: [],
        };

        set((state) => ({
          servers: state.servers.map((server) => ({
            ...server,
            channels: server.channels.map((ch) =>
              ch.id === activeChannelId
                ? { ...ch, messages: [...ch.messages, newMsg] }
                : ch
            ),
          })),
          dmChannels: state.dmChannels.map((ch) =>
            ch.id === activeChannelId
              ? { ...ch, messages: [...ch.messages, newMsg] }
              : ch
          ),
        }), false, 'chat/sendMessage');
      },

      addReaction: (channelId, messageId, emoji, userId) => {
        const updateMessages = (channels: Channel[]): Channel[] =>
          channels.map((ch) =>
            ch.id !== channelId ? ch : {
              ...ch,
              messages: ch.messages.map((msg) => {
                if (msg.id !== messageId) return msg;
                const reactions = msg.reactions ?? [];
                const existing = reactions.find((r) => r.emoji === emoji);
                const hasReacted = existing?.userIds.includes(userId);

                const updatedReactions = existing
                  ? reactions.map((r) =>
                      r.emoji !== emoji ? r : {
                        ...r,
                        userIds: hasReacted
                          ? r.userIds.filter((id) => id !== userId)
                          : [...r.userIds, userId],
                      }
                    ).filter((r) => r.userIds.length > 0)
                  : [...reactions, { emoji, userIds: [userId] }];

                return { ...msg, reactions: updatedReactions };
              }),
            }
          );

        set((state) => ({
          servers: state.servers.map((s) => ({
            ...s,
            channels: updateMessages(s.channels),
          })),
          dmChannels: updateMessages(state.dmChannels),
        }), false, 'chat/addReaction');
      },

      markChannelRead: (channelId) => {
        set((state) => ({
          servers: state.servers.map((s) => ({
            ...s,
            channels: s.channels.map((ch) =>
              ch.id === channelId ? { ...ch, unread: 0 } : ch
            ),
          })),
          dmChannels: state.dmChannels.map((ch) =>
            ch.id === channelId ? { ...ch, unread: 0 } : ch
          ),
        }), false, 'chat/markChannelRead');
      },
    }),
    { name: 'ChatStore' }
  )
);