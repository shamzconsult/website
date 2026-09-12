"use client";

import { useId, useRef, useState } from "react";
import { FileText, Paperclip, Trash2, Upload } from "lucide-react-v1";

import {
  ACCEPT_ATTRIBUTE,
  ACCEPTED_EXTENSIONS,
  MAX_FILE_BYTES,
  MAX_FILES,
  MAX_TOTAL_BYTES,
  isAcceptedFile,
} from "@/mentorship/lib/upload-limits";
import { cn, formatBytes } from "@/mentorship/lib/utils";

type Accent = "brand" | "teal";

const ACCENTS: Record<Accent, { ring: string; soft: string; text: string; chip: string }> = {
  brand: {
    ring: "border-brand-400 bg-brand-50",
    soft: "hover:border-brand-300 hover:bg-brand-50/50",
    text: "text-brand-600",
    chip: "bg-brand-100 text-brand-700",
  },
  teal: {
    ring: "border-teal-400 bg-teal-50",
    soft: "hover:border-teal-300 hover:bg-teal-50/50",
    text: "text-teal-600",
    chip: "bg-teal-100 text-teal-700",
  },
};

export function FileDropzone({
  files,
  onChange,
  accent = "brand",
  hint,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  accent?: Accent;
  hint?: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const styles = ACCENTS[accent];

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  function addFiles(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;
    setError(null);

    const next = [...files];
    for (const file of Array.from(incoming)) {
      if (!isAcceptedFile(file.name)) {
        setError(`"${file.name}" is not a supported file type.`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setError(`"${file.name}" is larger than ${MAX_FILE_BYTES / (1024 * 1024)} MB.`);
        continue;
      }
      // Skip anything already in the list.
      if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
      if (next.length >= MAX_FILES) {
        setError(`You can attach up to ${MAX_FILES} files.`);
        break;
      }
      next.push(file);
    }

    if (next.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_BYTES) {
      setError(`Your files add up to more than ${MAX_TOTAL_BYTES / (1024 * 1024)} MB in total.`);
      return;
    }

    onChange(next);
    // Allow re-picking the same file after a removal.
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    setError(null);
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-9 text-center transition",
          dragging ? styles.ring : cn("border-ink-200 bg-ink-50/40", styles.soft),
        )}
      >
        <span
          className={cn(
            "mb-3 grid size-12 place-items-center rounded-full transition",
            dragging ? "bg-white shadow-sm" : styles.chip,
          )}
        >
          <Upload className={cn("size-5", dragging ? styles.text : "")} aria-hidden />
        </span>
        <span className="text-sm font-semibold text-ink-900">
          Drag files here, or <span className={styles.text}>browse</span>
        </span>
        <span className="mt-1.5 max-w-sm text-xs leading-relaxed text-ink-500">
          {hint ?? "PPT, PPTX, PDF, DOC, DOCX and more."} Up to {MAX_FILES} files,{" "}
          {MAX_FILE_BYTES / (1024 * 1024)} MB each.
        </span>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE}
          className="sr-only"
          onChange={(event) => addFiles(event.target.files)}
        />
      </label>

      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3 shadow-sm"
            >
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", styles.chip)}>
                <FileText className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink-900">{file.name}</span>
                <span className="block text-xs text-ink-500">{formatBytes(file.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove ${file.name}`}
                className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
          <Paperclip className="size-3.5" aria-hidden />
          {files.length} file{files.length === 1 ? "" : "s"} • {formatBytes(totalBytes)} total
        </p>
      )}

      <p className="sr-only">Accepted types: {ACCEPTED_EXTENSIONS.join(", ")}</p>
    </div>
  );
}
