/* ============================================================================
 * UPLOAD LIMITS & VALIDATION
 * ============================================================================
 * Deliberately free of any server-only import, because the dropzone in the
 * browser enforces the same rules the route handler does.
 * ==========================================================================*/

/** Per-file ceiling. Gmail rejects messages above ~25 MB in total. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // 20 MB
export const MAX_FILES = 8;

export const ACCEPTED_EXTENSIONS = [
  ".ppt",
  ".pptx",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".csv",
  ".txt",
  ".png",
  ".jpg",
  ".jpeg",
  ".zip",
] as const;

/** Value for an <input type="file" accept="..."> attribute. */
export const ACCEPT_ATTRIBUTE = ACCEPTED_EXTENSIONS.join(",");

function extensionOf(filename: string) {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot).toLowerCase();
}

export function isAcceptedFile(filename: string) {
  return (ACCEPTED_EXTENSIONS as readonly string[]).includes(extensionOf(filename));
}

/**
 * Count / type / per-file-size checks that apply however the files travel.
 * MAX_TOTAL_BYTES is checked separately, and only on the email fallback path —
 * Cloudinary links carry no message-size cost.
 */
export function validateFiles(files: File[]): string | null {
  if (files.length > MAX_FILES) {
    return `Please attach no more than ${MAX_FILES} files.`;
  }
  for (const file of files) {
    if (!isAcceptedFile(file.name)) {
      return `"${file.name}" is not an accepted file type.`;
    }
    if (file.size > MAX_FILE_BYTES) {
      return `"${file.name}" is larger than ${MAX_FILE_BYTES / (1024 * 1024)} MB.`;
    }
  }
  return null;
}

