"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
    
  const params = useSearchParams();
  const code = params.get("code") ?? "";

  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch("/api/verify/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();
        if (res.ok) {
          setStatus(data.message ?? "Email verified successfully!");
        } else {
          setStatus(data.error ?? "Verification failed");
        }
      } catch (err) {
        setStatus("Network error, please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (code) {
      verify();
    } else {
      setStatus("Invalid verification link");
      setLoading(false);
    }
  }, [code]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-slate-200 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Email Verification</h1>
        {loading ? (
          <p className="text-slate-600 text-sm">Verifying your email...</p>
        ) : (
          <div
            className={`p-3 mt-4 rounded-lg text-sm ${
              status?.toLowerCase().includes("success")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
