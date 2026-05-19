import { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  canDelete: boolean; // false when it's the last channel
}

export function ContextMenu({ x, y, onEdit, onDelete, onClose, canDelete }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Adjust position so the menu never goes off-screen
  const adjustedX = Math.min(x, window.innerWidth - 160);
  const adjustedY = Math.min(y, window.innerHeight - 100);

  useEffect(() => {
    const handleClick = () => onClose();
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{ top: adjustedY, left: adjustedX }}
      onMouseDown={(e) => e.stopPropagation()} // prevent immediate close
    >
      <button
        className="context-item"
        onClick={() => { onEdit(); onClose(); }}
      >
        ✏️ Edit Channel
      </button>
      <div className="context-divider" />
      <button
        className={`context-item context-item-danger ${!canDelete ? 'disabled' : ''}`}
        onClick={() => { if (canDelete) { onDelete(); onClose(); } }}
        title={!canDelete ? "Can't delete the last channel" : undefined}
      >
        🗑️ Delete Channel
      </button>
    </div>
  );
}