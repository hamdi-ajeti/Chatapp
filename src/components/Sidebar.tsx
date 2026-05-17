import { useChatStore } from '../stores/useChatStore';
import { useAuthStore } from '../stores/useAuthStore';
import type { Channel } from '../types';
import { USERS } from '../data/mockData';

const statusColors: Record<string, string> = {
  online: '#3ba55c',
  idle: '#faa61a',
  dnd: '#ed4245',
  offline: '#747f8d',
};

export function Sidebar() {
  const {
    getActiveServer,
    dmChannels,
    activeChannelId,
    selectChannel,
    getUser,
  } = useChatStore();
  const { currentUser, setStatus } = useAuthStore();

  const server = getActiveServer();

  const getDmPartner = (ch: Channel) => {
    const partnerId = ch.memberIds.find((id) => id !== currentUser.id);
    return partnerId ? getUser(partnerId) : undefined;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="server-name">{server?.name ?? 'Direct Messages'}</h2>
      </div>

      <div className="sidebar-scroll">
        {/* Server channels */}
        {server && (
          <section className="channel-section">
            <div className="section-label">Text Channels</div>
            {server.channels.map((ch) => (
              <button
                key={ch.id}
                className={`channel-item ${activeChannelId === ch.id ? 'active' : ''}`}
                onClick={() => selectChannel(ch.id)}
              >
                <span className="ch-hash">#</span>
                <span className="ch-name">{ch.name}</span>
                {ch.unread > 0 && (
                  <span className="unread-badge">{ch.unread}</span>
                )}
              </button>
            ))}
          </section>
        )}

        {/* Direct Messages */}
        <section className="channel-section">
          <div className="section-label">Direct Messages</div>
          {dmChannels.map((ch) => {
            const partner = getDmPartner(ch);
            return (
              <button
                key={ch.id}
                className={`channel-item dm-item ${activeChannelId === ch.id ? 'active' : ''}`}
                onClick={() => selectChannel(ch.id)}
              >
                <div className="dm-avatar-wrap">
                  <span className="dm-avatar">{partner?.avatar ?? '?'}</span>
                  <span
                    className="status-dot-sm"
                    style={{ background: statusColors[partner?.status ?? 'offline'] }}
                  />
                </div>
                <span className="ch-name">{partner?.displayName ?? ch.name}</span>
                {ch.unread > 0 && (
                  <span className="unread-badge">{ch.unread}</span>
                )}
              </button>
            );
          })}
        </section>

        {/* Online members */}
        {server && (
          <section className="channel-section">
            <div className="section-label">Members — {server.memberIds.length}</div>
            {server.memberIds.map((uid) => {
              const user = USERS.find((u) => u.id === uid);
              if (!user) return null;
              return (
                <div key={uid} className="member-item">
                  <div className="dm-avatar-wrap">
                    <span className="dm-avatar">{user.avatar}</span>
                    <span
                      className="status-dot-sm"
                      style={{ background: statusColors[user.status] }}
                    />
                  </div>
                  <span
                    className="ch-name"
                    style={{ opacity: user.status === 'offline' ? 0.45 : 1 }}
                  >
                    {user.displayName}
                  </span>
                </div>
              );
            })}
          </section>
        )}
      </div>

      {/* User panel */}
      <div className="user-panel">
        <div className="user-panel-avatar-wrap">
          <span className="user-panel-avatar">{currentUser.avatar}</span>
          <span
            className="status-dot-sm"
            style={{ background: statusColors[currentUser.status] }}
          />
        </div>
        <div className="user-panel-info">
          <div className="user-panel-name">{currentUser.displayName}</div>
          <div className="user-panel-tag">#{currentUser.username}</div>
        </div>
        <select
          className="status-select"
          value={currentUser.status}
          onChange={(e) => setStatus(e.target.value as any)}
          title="Set status"
        >
          <option value="online">🟢 Online</option>
          <option value="idle">🟡 Idle</option>
          <option value="dnd">🔴 Do Not Disturb</option>
          <option value="offline">⚫ Offline</option>
        </select>
      </div>
    </aside>
  );
}
