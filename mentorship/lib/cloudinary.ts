import { v2 as cloudinary } from "cloudinary";

/* ============================================================================
 * CLOUDINARY — RESOURCE UPLOADS & SHARING
 * ============================================================================
 * Slides, PDFs and documents go to Cloudinary rather than being bolted onto
 * an email. Recipients get a link, which sidesteps Gmail's 25 MB ceiling and
 * gives the organiser one durable place to find every shared resource.
 *
 * Set in .env.local:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * If those are absent the app falls back to plain email attachments, so
 * nothing breaks before the keys arrive.
 * ==========================================================================*/

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
const API_KEY = process.env.CLOUDINARY_API_KEY || "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

/** Everything is filed under this prefix so the media library stays tidy. */
const ROOT_FOLDER = process.env.CLOUDINARY_FOLDER || "mentors-feedback-channel";

export function isCloudinaryConfigured() {
  return Boolean(CLOUD_NAME && API_KEY && API_SECRET);
}

let configured = false;

function configure() {
  if (!configured) {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
      secure: true,
    });
    configured = true;
  }
}

export interface StoredResource {
  /** The original filename, as the sender saw it. */
  name: string;
  url: string;
  bytes: number;
  format: string;
  publicId: string;
}

/** Cloudinary rejects a lot of punctuation in public ids. */
function safeId(filename: string) {
  const dot = filename.lastIndexOf(".");
  const stem = dot === -1 ? filename : filename.slice(0, dot);
  return (
    stem
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "file"
  );
}

export async function uploadResources(
  files: File[],
  folder: string,
): Promise<StoredResource[]> {
  if (files.length === 0) return [];
  configure();

  const uploads = files.map(async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `${ROOT_FOLDER}/${folder}`,
          public_id: `${Date.now()}-${safeId(file.name)}`,
          resource_type: "auto",
          use_filename: true,
          unique_filename: false,
        },
        (error, uploaded) => {
          if (error || !uploaded) reject(error ?? new Error("Cloudinary returned no result"));
          else resolve(uploaded as unknown as Record<string, unknown>);
        },
      );
      stream.end(buffer);
    });

    return {
      name: file.name,
      url: String(result.secure_url ?? result.url ?? ""),
      bytes: Number(result.bytes ?? file.size),
      format: String(result.format ?? ""),
      publicId: String(result.public_id ?? ""),
    } satisfies StoredResource;
  });

  return Promise.all(uploads);
}
