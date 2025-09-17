// lib/neverthrow/parseCatchError.ts
export function parseCatchError(err: unknown, fallback = "Something went wrong") {
    if (err instanceof Error) return err.message || fallback;
    if (typeof err === "string") return err;
    try {
      return JSON.stringify(err);
    } catch {
      return fallback;
    }
  }
  