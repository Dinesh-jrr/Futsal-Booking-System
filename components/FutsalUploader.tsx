"use client";

import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

type Props = {
  type: "images" | "documents";
  onUploadComplete: (urls: string[]) => void;
};

export default function FutsalUploader({ type, onUploadComplete }: Props) {
  return (
    <div className="my-4">
      <h3 className="mb-2 font-medium">
        Upload {type === "images" ? "Futsal Images" : "Verification Documents"}
      </h3>
      <UploadDropzone<OurFileRouter, keyof OurFileRouter>
        endpoint={
          type === "images" ? "futsalImageUploader" : "futsalDocumentUploader"
        }
        onClientUploadComplete={(res) => {
          const urls = res.map((file) => file.url);
          onUploadComplete(urls);
        }}
        onUploadError={(error) => {
          alert(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  );
}
