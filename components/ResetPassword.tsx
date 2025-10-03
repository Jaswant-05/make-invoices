"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/app/action/auth";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const code = params.get("code") ?? "";

  const [status, setStatus] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setIsError(false);

    const formData = new FormData(e.currentTarget);

    const res = await resetPassword({
      password1: String(formData.get("password1")),
      password2: String(formData.get("password2")),
      code,
    });

    if (res.error) {
      setStatus(res.error);
      setIsError(true);
    } else if (res.errors?.length) {
      setStatus(res.errors[0]);
      setIsError(true);
    } else {
      setStatus(res.message ?? "Password changed successfully");
      setIsError(false);
      // setTimeout(() => router.push("/signin"), 1500);
    }

    setLoading(false);
  }

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Link</h1>
          <p className="text-slate-600 text-sm">The reset link is missing or invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border border-slate-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Reset your password</h1>
          <p className="text-slate-600 text-sm">Enter and confirm your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            name="password1"
            placeholder="New password"
            required
          />
          <Input
            type="password"
            name="password2"
            placeholder="Confirm new password"
            required
          />

          {status && (
            <div
              className={[
                "p-3 rounded-lg text-sm border",
                isError
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-green-50 border-green-200 text-green-700",
            ].join(" ")}
            >
              {status}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full p-3 text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Updating..." : "Reset Password"}
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
