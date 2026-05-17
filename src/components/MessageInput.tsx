import { useState, useRef } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { useChatStore } from '../stores/useChatStore';
import { useAuthStore } from '../stores/useAuthStore';

export function MessageInput() {
  const [value, setValue] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const { sendMessage, getActiveChannel } = useChatStore();
  const { currentUser } = useAuthStore();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const channel = getActiveChannel();

  // ── Convert a File to a base64 data URL ──────────────────────────────
  const readFileAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

  // ── Handle file chosen via the file picker or dropped ────────────────
  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Please choose an image under 8 MB.');
      return;
    }

    const dataUrl = await readFileAsDataURL(file);
    setImagePreview(dataUrl);
    setImageName(file.name);
    textareaRef.current?.focus();
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  // ── Drag-and-drop ─────────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear when leaving the whole input-bar, not child elements
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // ── Send ──────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!value.trim() && !imagePreview) return;
    sendMessage(value, currentUser.id, imagePreview ?? undefined);
    setValue('');
    setImagePreview(null);
    setImageName('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageName('');
  };

  const canSend = !!value.trim() || !!imagePreview;

  const placeholder = channel
    ? channel.type === 'dm'
      ? `Message ${channel.name}`
      : `Message #${channel.name}`
    : 'Select a channel';

  return (
    <div
      className={`input-bar ${isDragging ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="drag-hint">🖼️ Drop image to upload</div>
      )}

      {imagePreview && (
        <div className="image-preview-bar">
          <div className="image-preview-wrap">
            <img src={imagePreview} alt="preview" className="image-preview-thumb" />
            <div className="image-preview-info">
              <span className="image-preview-name">{imageName}</span>
              <span className="image-preview-label">Ready to send</span>
            </div>
            <button className="image-preview-remove" onClick={removeImage} title="Remove">
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="input-wrap">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />

        <button
          className="input-attach"
          title="Upload image"
          onClick={() => fileInputRef.current?.click()}
          disabled={!channel}
        >
          ＋
        </button>

        <textarea
          ref={textareaRef}
          className="message-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleTextareaInput}
          placeholder={imagePreview ? 'Add a caption (optional)…' : placeholder}
          disabled={!channel}
          rows={1}
        />

        <button
          className={`input-send ${canSend ? 'ready' : ''}`}
          onClick={handleSend}
          disabled={!canSend}
          title="Send (Enter)"
        >
          ↑
        </button>
      </div>
    </div>
  );
}