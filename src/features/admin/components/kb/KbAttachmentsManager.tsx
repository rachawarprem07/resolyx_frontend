import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  FileText,
  Video,
  Headphones,
  Archive,
  File,
  Trash2,
  Plus,
  Sparkles,
  Link as LinkIcon,
  Upload,
  Cloud,
  Loader2,
} from 'lucide-react';
import type { KbAttachment, KbAttachmentType } from '../../types/kb.types';

interface KbAttachmentsManagerProps {
  attachments: KbAttachment[];
  onChange: (attachments: KbAttachment[]) => void;
}

const TYPE_CONFIG: Record<
  KbAttachmentType,
  { label: string; icon: React.FC<{ className?: string }>; color: string; badge: string }
> = {
  audio: { label: 'Audio', icon: Headphones, color: 'text-violet-500', badge: 'bg-violet-500/10 text-violet-600 border-violet-500/20' },
  video: { label: 'Video', icon: Video, color: 'text-rose-500', badge: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
  image: { label: 'Image', icon: ImageIcon, color: 'text-blue-500', badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  doc: { label: 'Document', icon: FileText, color: 'text-amber-500', badge: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  archive: { label: 'Archive', icon: Archive, color: 'text-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  file: { label: 'File', icon: File, color: 'text-slate-500', badge: 'bg-slate-500/10 text-slate-600 border-slate-500/20' },
};

function detectFileType(file: File): KbAttachmentType {
  const mime = file.type.toLowerCase();
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (mime.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'opus', 'wma'].includes(ext)) {
    return 'audio';
  }
  if (mime.startsWith('video/') || ['mp4', 'webm', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'm4v'].includes(ext)) {
    return 'video';
  }
  if (mime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext)) {
    return 'image';
  }
  if (
    mime.includes('pdf') ||
    mime.includes('word') ||
    mime.includes('document') ||
    mime.includes('sheet') ||
    mime.includes('presentation') ||
    ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv', 'md'].includes(ext)
  ) {
    return 'doc';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
    return 'archive';
  }
  return 'file';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const KbAttachmentsManager: React.FC<KbAttachmentsManagerProps> = ({
  attachments,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [mediaType, setMediaType] = useState<KbAttachmentType>('audio');
  const [mediaName, setMediaName] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMediaUrl = () => {
    if (!mediaUrl.trim() && !mediaName.trim()) return;
    const newAtt: KbAttachment = {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: mediaName.trim() || `${TYPE_CONFIG[mediaType].label} Link`,
      type: mediaType,
      url: mediaUrl.trim() || '#',
      size: 'Remote Link',
    };
    onChange([...attachments, newAtt]);
    setMediaName('');
    setMediaUrl('');
  };

  const [uploadStatusMsg, setUploadStatusMsg] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatusMsg(`Uploading ${files.length} file(s) to S3 Cloud Storage...`);

    const newAttachments: KbAttachment[] = [];
    const filesList = Array.from(files);

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      if (!file) continue;

      const detected = detectFileType(file);
      setUploadStatusMsg(`Uploading ${i + 1}/${filesList.length}: ${file.name}...`);

      let uploadedUrl: string | null = null;
      let uploadedSize = formatBytes(file.size);

      // Try uploading to backend S3 storage endpoint
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'kb-media');

        const res = await fetch('http://localhost:8000/api/v1/storage/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            uploadedUrl = data.url.startsWith('/')
              ? `http://localhost:8000${data.url}`
              : data.url;
            if (data.size) uploadedSize = formatBytes(data.size);
          }
        }
      } catch (err) {
        console.warn('Backend S3 upload failed or server offline, falling back to local data URL:', err);
      }

      // If backend was not reached, fallback gracefully to client DataURL
      if (!uploadedUrl) {
        uploadedUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve((ev.target?.result as string) || '#');
          reader.onerror = () => resolve('#');
          reader.readAsDataURL(file);
        });
      }

      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        type: detected,
        url: uploadedUrl,
        size: uploadedSize,
        mimeType: file.type || undefined,
      });
    }

    onChange([...attachments, ...newAttachments]);
    setIsUploading(false);
    setUploadStatusMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    onChange(attachments.filter((a) => a.id !== id));
  };

  return (
    <div className="p-3.5 rounded-xl bg-surface-subtle/50 border border-border space-y-3">
      {/* Header with quick switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-brand-indigo" />
          <span>Attachments & Media (Audio, Video, Images, Docs & All Files)</span>
        </span>
        <div className="flex items-center gap-1 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'upload'
                ? 'bg-brand-indigo text-white shadow-sm'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface'
            }`}
          >
            <Upload className="h-3 w-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'url'
                ? 'bg-brand-indigo text-white shadow-sm'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface'
            }`}
          >
            <LinkIcon className="h-3 w-3" />
            <span>Add Link / URL</span>
          </button>
        </div>
      </div>

      {/* Tab 1: File Upload (Multi-format) */}
      {activeTab === 'upload' && (
        <div className="space-y-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-border hover:border-brand-indigo/50 bg-surface cursor-pointer transition-all text-center group"
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <Loader2 className="h-6 w-6 text-brand-indigo animate-spin" />
                <p className="text-xs font-semibold text-brand-indigo">
                  {uploadStatusMsg || 'Uploading to S3 Cloud Storage...'}
                </p>
                <p className="text-[10px] text-foreground-muted">Please wait while files are being stored securely.</p>
              </div>
            ) : (
              <>
                <Upload className="h-6 w-6 text-brand-indigo group-hover:scale-110 transition-transform mb-1.5" />
                <p className="text-xs font-semibold text-foreground">
                  Click to select or drop files here
                </p>
                <p className="text-[11px] text-foreground-muted mt-0.5">
                  Direct S3 Upload: Audio (MP3, WAV), Video (MP4, WebM), Images (PNG, JPG), PDF, Office Docs, Archives, and all file formats
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="sr-only"
              accept="*/*"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Manual URL / Link */}
      {activeTab === 'url' && (
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as KbAttachmentType)}
            className="w-full sm:w-32 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-foreground text-xs"
          >
            <option value="audio">🎵 Audio</option>
            <option value="video">🎬 Video</option>
            <option value="image">🖼️ Image</option>
            <option value="doc">📄 Document</option>
            <option value="archive">📦 Archive</option>
            <option value="file">📁 Other File</option>
          </select>
          <input
            type="text"
            value={mediaName}
            onChange={(e) => setMediaName(e.target.value)}
            placeholder="Title / Description"
            className="w-full sm:w-44 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-foreground text-xs"
          />
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="Link / Embed URL (https://...)"
            className="w-full flex-1 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-foreground text-xs"
          />
          <button
            type="button"
            onClick={handleAddMediaUrl}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-brand-indigo text-white hover:opacity-90 text-xs font-semibold shadow-sm flex items-center justify-center gap-1"
          >
            <Plus className="h-3 w-3" />
            <span>Add</span>
          </button>
        </div>
      )}

      {/* List of Attached Assets */}
      {attachments.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
            Attached Files & Links ({attachments.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {attachments.map((att) => {
              const cfg = TYPE_CONFIG[att.type] || TYPE_CONFIG.file;
              const IconComponent = cfg.icon;

              return (
                <div
                  key={att.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface border border-border text-xs group hover:border-brand-indigo/30 transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`p-1.5 rounded-lg border ${cfg.badge} shrink-0`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate" title={att.name}>
                        {att.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted">
                        <span className="capitalize">{cfg.label}</span>
                        {att.size && <span>• {att.size}</span>}
                        {att.url && (att.url.includes('s3') || att.url.includes('amazonaws') || att.url.includes('/uploads/')) && (
                          <span className="inline-flex items-center gap-0.5 text-brand-indigo font-medium">
                            • <Cloud className="h-2.5 w-2.5" /> S3 Cloud
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    className="p-1 rounded-lg text-foreground-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                    title="Remove attachment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
