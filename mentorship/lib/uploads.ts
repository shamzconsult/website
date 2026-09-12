import { isCloudinaryConfigured, uploadResources, type StoredResource } from "@/mentorship/lib/cloudinary";
import type { MailAttachment } from "@/mentorship/lib/mail";
import { MAX_TOTAL_BYTES, validateFiles } from "@/mentorship/lib/upload-limits";

/* ============================================================================
 * SERVER-SIDE UPLOAD HANDLING
 * ============================================================================
 * Turns the files on a submitted form into either Cloudinary links or email
 * attachments. Server-only — the browser gets its rules from
 * `@/lib/upload-limits`, which this re-exports for convenience.
 * ==========================================================================*/

export * from "@/mentorship/lib/upload-limits";

/** Strips path separators so a crafted filename cannot escape the attachment name. */
function safeFilename(filename: string) {
  return filename.replace(/[\\/]/g, "_").replace(/[\r\n]/g, "").slice(0, 160) || "attachment";
}

export interface UploadResult {
  attachments: MailAttachment[];
  error?: string;
}

/**
 * Turns the uploaded files into nodemailer attachments.
 *
 * Only used when Cloudinary is not configured — the total-size ceiling here
 * exists because Gmail rejects messages above roughly 25 MB.
 */
export async function collectAttachments(files: File[]): Promise<UploadResult> {
  if (files.length === 0) return { attachments: [] };

  const invalid = validateFiles(files);
  if (invalid) return { attachments: [], error: invalid };

  let total = 0;
  const attachments: MailAttachment[] = [];

  for (const file of files) {
    total += file.size;
    if (total > MAX_TOTAL_BYTES) {
      return {
        attachments: [],
        error: `Your attachments add up to more than ${MAX_TOTAL_BYTES / (1024 * 1024)} MB in total.`,
      };
    }

    attachments.push({
      filename: safeFilename(file.name),
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || "application/octet-stream",
    });
  }

  return { attachments };
}

/* ==========================================================================
 * THE ONE ENTRY POINT ROUTE HANDLERS USE
 * ========================================================================== */

/**
 * Validates the uploaded files, then either
 *   - uploads them to Cloudinary and returns shareable links, or
 *   - (when Cloudinary is not configured yet) falls back to attaching them
 *     to the email exactly as this app did before.
 *
 * `folder` is the Cloudinary sub-folder, e.g. "mentee-messages".
 */
export async function prepareResources(
  files: File[],
  folder: string,
): Promise<{ resources: StoredResource[]; attachments: MailAttachment[]; error?: string }> {
  if (files.length === 0) return { resources: [], attachments: [] };

  const invalid = validateFiles(files);
  if (invalid) return { resources: [], attachments: [], error: invalid };

  if (!isCloudinaryConfigured()) {
    const { attachments, error } = await collectAttachments(files);
    return { resources: [], attachments, error };
  }

  try {
    const resources = await uploadResources(files, folder);
    return { resources, attachments: [] };
  } catch (error) {
    console.error("[uploads] Cloudinary upload failed:", error);
    return {
      resources: [],
      attachments: [],
      error: "We could not upload your files right now. Please try again in a moment.",
    };
  }
}
