'use client';

import React, { useRef, useState } from 'react';

export interface AttachedFile {
  name: string;
  size: string;
}

function attachedFile(file: File): AttachedFile {
  return {
    name: file.name,
    size: file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(1)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
  };
}

interface FileDropzoneProps {
  id?: string;
  label?: string;
  required?: boolean;
  file: AttachedFile | null;
  onFileChange: (file: AttachedFile | null) => void;
  accept?: string;
  helperText?: string;
  error?: string;
  buttonText?: string;
}

export function FileDropzone({
  id = 'file-upload-dropzone',
  label = 'Attach Document',
  required = false,
  file,
  onFileChange,
  accept = 'image/*,.pdf',
  helperText = 'Click to browse files (JPG, PNG or PDF up to 2MB).',
  error,
  buttonText = 'Choose File',
}: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      onFileChange(attachedFile(selected));
    }
  }

  function handleTriggerClick() {
    fileInputRef.current?.click();
  }

  function handleRemoveFile(e: React.MouseEvent) {
    e.stopPropagation();
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      onFileChange(attachedFile(dropped));
    }
  }

  return (
    <div className={`epfo-field-group epfo-file-dropzone-group ${error ? 'has-error' : ''}`}>
      {label && (
        <span className="epfo-field-label">
          {label} {required && <span className="epfo-req-star">*</span>}
        </span>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="epfo-visually-hidden"
        aria-label={label}
      />

      {file ? (
        /* Uploaded File Chip */
        <div className="epfo-file-chip-card">
          <span className="file-chip-icon" aria-hidden="true">
            {file.name.endsWith('.pdf') ? '📄' : '🖼️'}
          </span>
          <div className="file-chip-info">
            <strong className="file-name">{file.name}</strong>
            <small className="file-size">{file.size} · Ready to submit</small>
          </div>
          <button
            type="button"
            className="file-remove-btn"
            onClick={handleRemoveFile}
            title="Remove file"
            aria-label="Remove file"
          >
            ✕
          </button>
        </div>
      ) : (
        /* Upload Action Box */
        <div
          className={`epfo-file-upload-box ${isDragOver ? 'drag-over' : ''}`}
          onClick={handleTriggerClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTriggerClick();
            }
          }}
        >
          <div className="upload-prompt-text">
            <span className="upload-icon" aria-hidden="true">📁</span>
            <div>
              <strong>Attach Document</strong>
              <p>{helperText}</p>
            </div>
          </div>

          <button
            type="button"
            className="epfo-btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleTriggerClick();
            }}
          >
            {buttonText}
          </button>
        </div>
      )}

      {error && <small className="epfo-field-error">{error}</small>}
    </div>
  );
}
