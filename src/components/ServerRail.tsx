import { useChatStore } from '../stores/useChatStore';
import { useAuthStore } from '../stores/useAuthStore';

const statusColors: Record<string, string> = {
  online: '#3ba55c',
  idle: '#faa61a',
  dnd: '#ed4245',
  offline: '#747f8d',
};

export function ServerRail() {
  const { servers, activeServerId, selectServer } = useChatStore();
  const { currentUser } = useAuthStore();

  return (
    <aside className="server-rail">
      <div className="rail-servers">
        {servers.map((server) => (
          <button
            key={server.id}
            className={`server-btn ${activeServerId === server.id ? 'active' : ''}`}
            onClick={() => selectServer(server.id)}
            title={server.name}
          >
            <span className="server-icon">{server.icon}</span>
            {activeServerId === server.id && <div className="active-pip" />}
          </button>
        ))}
        <div className="rail-divider" />
        <button className="server-btn add-btn" title="Add server">
          <span>+</span>
        </button>
      </div>
      <div className="rail-user">
        <div className="rail-avatar-wrap">
          <span className="rail-avatar">{currentUser.avatar}</span>
          <span
            className="status-dot"
            style={{ background: statusColors[currentUser.status] }}
          />
        </div>
      </div>
    </aside>
  );
}
