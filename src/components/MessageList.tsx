import { useEffect, useRef } from 'react';
import { useChatStore } from '../stores/useChatStore';
import { useAuthStore } from '../stores/useAuthStore';
import type { Message } from '../types';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '🔥', '👀'];

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date: Date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'long', day: 'numeric' });
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function isSameAuthorWithinMinutes(a: Message, b: Message, mins = 5) {
  return (
    a.authorId === b.authorId &&
    Math.abs(b.timestamp.getTime() - a.timestamp.getTime()) < mins * 60 * 1000
  );
}

export function MessageList() {
  const { getActiveChannel, getUser, addReaction, activeChannelId } = useChatStore();
  const { currentUser } = useAuthStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  const channel = getActiveChannel();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channel?.messages.length, activeChannelId]);

  if (!channel) return <div className="messages-area empty">Select a channel</div>;

  const messages = channel.messages;

  return (
    <div className="messages-area">
      <div className="messages-inner">
        {messages.map((msg, i) => {
          const author = getUser(msg.authorId);
          const prev = messages[i - 1];
          const isGrouped = prev && isSameAuthorWithinMinutes(prev, msg);
          const showDateDivider = !prev || !isSameDay(prev.timestamp, msg.timestamp);
          const isSelf = msg.authorId === currentUser.id;

          return (
            <div key={msg.id}>
              {showDateDivider && (
                <div className="date-divider">
                  <span>{formatDate(msg.timestamp)}</span>
                </div>
              )}
              <div className={`message-row ${isGrouped ? 'grouped' : ''} ${isSelf ? 'self' : ''}`}>
                {!isGrouped ? (
                  <div
                    className="msg-avatar"
                    title={author?.displayName}
                  >
                    {author?.avatar}
                  </div>
                ) : (
                  <div className="msg-avatar-spacer" />
                )}

                <div className="msg-body">
                  {!isGrouped && (
                    <div className="msg-header">
                      <span
                        className="msg-author"
                        style={{ color: author?.color }}
                      >
                        {author?.displayName}
                      </span>
                      <span className="msg-time">{formatTime(msg.timestamp)}</span>
                    </div>
                  )}
                  {msg.content && (
                    <div className="msg-content">{msg.content}</div>
                  )}

                  {/* Inline image */}
                  {msg.imageUrl && (
                    <div className="msg-image-wrap">
                      <img
                        src={msg.imageUrl}
                        alt="uploaded"
                        className="msg-image"
                        onClick={() => {
                        if (!msg.imageUrl) return;
                        // data: URLs are blocked by Chrome in new tabs — convert to a Blob URL first
                        fetch(msg.imageUrl)
                          .then((r) => r.blob())
                          .then((blob) => {
                            const blobUrl = URL.createObjectURL(blob);
                            const win = window.open(blobUrl, '_blank');
                            // Revoke after the tab has had time to load the image
                            win?.addEventListener('load', () => URL.revokeObjectURL(blobUrl));
                          });
                      }}
                        title="Click to open full size"
                      />
                    </div>
                  )}

                  {/* Reactions */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="reactions">
                      {msg.reactions.map((r) => (
                        <button
                          key={r.emoji}
                          className={`reaction-chip ${r.userIds.includes(currentUser.id) ? 'reacted' : ''}`}
                          onClick={() => addReaction(channel.id, msg.id, r.emoji, currentUser.id)}
                        >
                          {r.emoji} {r.userIds.length}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover actions */}
                <div className="msg-actions">
                  {QUICK_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      className="action-btn"
                      onClick={() => addReaction(channel.id, msg.id, emoji, currentUser.id)}
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}