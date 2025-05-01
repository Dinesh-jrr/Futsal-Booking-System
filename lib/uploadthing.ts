import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  // Profile image upload (for single profile photo)
  profileImageUploader: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return { userId: "demo-user-id" }; // Replace with real auth if needed
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Profile image uploaded:", file.url);
    }),

  // Futsal images upload
  futsalImageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      return { userId: "demo-user-id" };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Image uploaded:", file.url);
    }),

  // Futsal documents upload (PDF)
  futsalDocumentUploader: f({
    "application/pdf": { maxFileSize: "4MB", maxFileCount: 3 },
  })
    .middleware(async () => {
      return { userId: "demo-user-id" };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Doc uploaded:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
