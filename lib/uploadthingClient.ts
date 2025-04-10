// // utils/uploadthing.ts
// import {
//     UploadButton as UTButton,
//     UploadDropzone as UTDropzone,
//     type UploadButton,
//     type UploadDropzoneProps,
//   } from "@uploadthing/react";
//   import type { OurFileRouter } from "@/lib/uploadthing";
  
//   // Properly type and re-export the components
//   export const UploadButton = UTButton as <TEndpoint extends keyof OurFileRouter>(
//     props: UploadButtonProps<OurFileRouter, TEndpoint>
//   ) => JSX.Element;
  
//   export const UploadDropzone = UTDropzone as <TEndpoint extends keyof OurFileRouter>(
//     props: UploadDropzoneProps<OurFileRouter, TEndpoint>
//   ) => JSX.Element;
  