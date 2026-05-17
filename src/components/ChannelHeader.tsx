import { useChatStore } from '../stores/useChatStore';
import { useAuthStore } from '../stores/useAuthStore';

export function ChannelHeader() {
  const { getActiveChannel, getUser } = useChatStore();
  const { currentUser } = useAuthStore();

  const channel = getActiveChannel();

  if (!channel) return <div className="channel-header" />;

  const isDm = channel.type === 'dm';
  const dmPartnerId = isDm
    ? channel.memberIds.find((id) => id !== currentUser.id)
    : null;
  const dmPartner = dmPartnerId ? getUser(dmPartnerId) : null;

  return (
    <header className="channel-header">
      <div className="ch-header-left">
        {isDm ? (
          <>
            <span className="ch-header-avatar">{dmPartner?.avatar}</span>
            <div>
              <div className="ch-header-name">{dmPartner?.displayName}</div>
              <div className="ch-header-sub">@{dmPartner?.username}</div>
            </div>
          </>
        ) : (
          <>
            <span className="ch-header-hash">#</span>
            <div>
              <div className="ch-header-name">{channel.name}</div>
              {channel.description && (
                <div className="ch-header-sub">{channel.description}</div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="ch-header-right">
        <span className="ch-header-count">
          {channel.messages.length} messages
        </span>
      </div>
    </header>
  );
}
