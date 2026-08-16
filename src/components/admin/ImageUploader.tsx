"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

interface SignatureResponse {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
}

interface InFlightUpload {
  id: string;
  fileName: string;
  progress: number;
  error?: string;
}

// Uploads directly from the browser to Cloudinary using a short-lived
// signature from our own API (see cloudinary-signature/route.ts), so image
// bytes never pass through our server and the API secret never reaches
// the browser. Reused by the product create/edit forms for `imageUrls`.
export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploads, setUploads] = useState<InFlightUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    const uploadId = `${file.name}-${Date.now()}`;
    setUploads((prev) => [...prev, { id: uploadId, fileName: file.name, progress: 0 }]);

    try {
      const signatureRes = await fetch("/api/admin/cloudinary-signature", { method: "POST" });
      if (!signatureRes.ok) {
        throw new Error("Could not get an upload signature");
      }
      const signatureData: SignatureResponse = await signatureRes.json();

      const url = await uploadWithProgress(file, signatureData, (progress) => {
        setUploads((prev) => prev.map((u) => (u.id === uploadId ? { ...u, progress } : u)));
      });

      onChange([...value, url]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setUploads((prev) => prev.map((u) => (u.id === uploadId ? { ...u, error: message } : u)));
      return;
    }

    setUploads((prev) => prev.filter((u) => u.id !== uploadId));
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .forEach((file) => uploadFile(file));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  function removeImage(url: string) {
    onChange(value.filter((existing) => existing !== url));
  }

  return (
    <div>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`cursor-pointer rounded-md border-2 border-dashed p-6 text-center text-sm transition-colors ${
          isDragging ? "border-brand-primary bg-brand-primary/5" : "border-gray-300 text-gray-500"
        }`}
      >
        Drag and drop images here, or click to choose files
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {uploads.length > 0 && (
        <ul className="mt-3 space-y-2">
          {uploads.map((upload) => (
            <li key={upload.id} className="text-xs">
              <div className="flex justify-between text-gray-500">
                <span>{upload.fileName}</span>
                <span>{upload.error ? "Failed" : `${upload.progress}%`}</span>
              </div>
              {upload.error ? (
                <p className="text-red-600">{upload.error}</p>
              ) : (
                <div className="h-1.5 w-full overflow-hidden rounded bg-gray-200">
                  <div
                    className="h-full bg-brand-primary transition-all"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {value.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {value.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-md border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary URLs are arbitrary/dynamic, not worth Next/Image config here */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white group-hover:flex"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// XHR (not fetch) because it's the only browser API that exposes upload
// progress events.
function uploadWithProgress(
  file: File,
  signature: SignatureResponse,
  onProgress: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signature.apiKey);
    formData.append("timestamp", String(signature.timestamp));
    formData.append("signature", signature.signature);
    formData.append("folder", signature.folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText) as { secure_url: string };
        resolve(response.secure_url);
      } else {
        reject(new Error("Cloudinary upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}
