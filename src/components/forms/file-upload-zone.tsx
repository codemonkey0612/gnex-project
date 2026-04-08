"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface UploadedFile {
  file: File;
  preview: string;
}

interface FileUploadZoneProps {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

export function FileUploadZone({
  files,
  onChange,
  maxFiles = 10,
}: FileUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return;

    const remaining = maxFiles - files.length;
    const toAdd = Array.from(newFiles).slice(0, remaining);

    const uploaded: UploadedFile[] = toAdd.map((file) => ({
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : "",
    }));

    onChange([...files, ...uploaded]);
  }

  function removeFile(index: number) {
    const updated = [...files];
    if (updated[index].preview) {
      URL.revokeObjectURL(updated[index].preview);
    }
    updated.splice(index, 1);
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <svg className="mb-2 h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
        </svg>
        <p className="text-sm text-muted-foreground">
          クリックまたはドラッグ＆ドロップでファイルを追加
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPEG, PNG, WebP, PDF（最大10MB / 最大{maxFiles}ファイル）
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {files.map((f, i) => (
            <div
              key={i}
              className="group relative rounded-lg border bg-card p-2"
            >
              {f.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.preview}
                  alt={f.file.name}
                  className="h-24 w-full rounded object-cover"
                />
              ) : (
                <div className="flex h-24 items-center justify-center rounded bg-muted">
                  <span className="text-xs text-muted-foreground">PDF</span>
                </div>
              )}
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {f.file.name}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export type { UploadedFile };
