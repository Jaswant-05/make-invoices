"use client";

import { useState } from "react";
import { requestPasswordReset } from "../action/auth";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function RequestResetPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("email", email);

      const res = await requestPasswordReset(formData);

      if (res.error) {
        setStatus(res.error);
      } else {
        setStatus(res.message ?? "If an account exists, a reset link has been sent.");
      }
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-slate-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Forgot your password?</h1>
          <p className="text-slate-600 text-sm">
            Enter your email and we’ll send you a link to reset it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {status && (
            <div
              className={`p-3 rounded-lg text-sm ${
                status.toLowerCase().includes("sent")
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {status}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full p-3 text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Remembered your password?{" "}
          <a href="/signin" className="text-slate-900 hover:underline font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
