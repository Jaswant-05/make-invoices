// lib/invoice/create-blob-url.ts
export function createBlobUrl({ blob }: { blob: Blob }) {
    return URL.createObjectURL(blob);
  }
  export function revokeBlobUrl({ url }: { url: string }) {
    URL.revokeObjectURL(url);
  }
  