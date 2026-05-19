import { useState, useEffect, useRef } from 'react';
import { useUIStore } from '../stores/useUIStore';
import { useChatStore } from '../stores/useChatStore';

const SERVER_EMOJIS = ['🚀', '🎮', '🎨', '🎵', '📚', '💼', '🏆', '🔥', '⚡', '🌍', '🤖', '🛸'];

export function Modal() {
  const { modal, closeModal } = useUIStore();
  const { addServer, addChannel, editChannel, deleteChannel, servers } = useChatStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🚀');
  const [error, setError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-fill when editing a channel
  useEffect(() => {
    if (modal?.type === 'edit-channel') {
      const server = servers.find((s) => s.id === modal.serverId);
      const channel = server?.channels.find((c) => c.id === modal.channelId);
      if (channel) {
        setName(channel.name);
        setDescription(channel.description ?? '');
      }
    } else {
      setName('');
      setDescription('');
      setIcon('🚀');
    }
    setError('');
    // Focus the input after the modal opens
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [modal]);

  if (!modal) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit();
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required.');
      return;
    }

    if (modal.type === 'create-server') {
      addServer(trimmed, icon);
      closeModal();
    } else if (modal.type === 'create-channel') {
      addChannel(modal.serverId, trimmed, description.trim() || undefined);
      closeModal();
    } else if (modal.type === 'edit-channel') {
      editChannel(modal.serverId, modal.channelId, trimmed, description.trim() || undefined);
      closeModal();
    }
  };

  const handleDelete = () => {
    if (modal.type !== 'edit-channel') return;
    deleteChannel(modal.serverId, modal.channelId);
    closeModal();
  };

  const titles: Record<NonNullable<typeof modal>['type'], string> = {
    'create-server': 'Create a Server',
    'create-channel': 'Create Channel',
    'edit-channel': 'Edit Channel',
  };

  return (
    <div className="modal-overlay" onClick={closeModal} onKeyDown={handleKeyDown}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{titles[modal.type]}</h2>
          <button className="modal-close" onClick={closeModal}>✕</button>
        </div>

        {/* Emoji picker — only for create-server */}
        {modal.type === 'create-server' && (
          <div className="modal-field">
            <label className="modal-label">Server Icon</label>
            <div className="emoji-grid">
              {SERVER_EMOJIS.map((e) => (
                <button
                  key={e}
                  className={`emoji-btn ${icon === e ? 'selected' : ''}`}
                  onClick={() => setIcon(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Name field */}
        <div className="modal-field">
          <label className="modal-label">
            {modal.type === 'create-server' ? 'Server Name' : 'Channel Name'}
          </label>
          <input
            ref={inputRef}
            className={`modal-input ${error ? 'input-error' : ''}`}
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder={modal.type === 'create-server' ? "My awesome server" : "e.g. announcements"}
            maxLength={40}
          />
          {error && <span className="modal-error">{error}</span>}
        </div>

        {/* Description — only for channels */}
        {modal.type !== 'create-server' && (
          <div className="modal-field">
            <label className="modal-label">Description <span className="modal-optional">(optional)</span></label>
            <input
              className="modal-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              maxLength={80}
            />
          </div>
        )}

        <div className="modal-footer">
          {/* Delete button — only when editing */}
          {modal.type === 'edit-channel' && (
            <button className="modal-btn modal-btn-danger" onClick={handleDelete}>
              Delete Channel
            </button>
          )}
          <div className="modal-footer-right">
            <button className="modal-btn modal-btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="modal-btn modal-btn-primary" onClick={handleSubmit}>
              {modal.type === 'edit-channel' ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}