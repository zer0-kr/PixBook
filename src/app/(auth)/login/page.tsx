"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { logError } from "@/lib/logger";
import { PixelButton, PixelCard, PixelInput } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/library");
      router.refresh();
    } catch (err) {
      logError("Login error:", err);
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/callback`,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <PixelCard hoverable={false} className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-pixel text-2xl text-brown mb-2">
          {"[ LOGIN ]"}
        </h1>
        <p className="text-sm text-brown-light">
          픽북에 오신 것을 환영합니다!
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="pixel-border bg-pixel-red/10 text-pixel-red p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <PixelInput
          label="이메일"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PixelInput
          label="비밀번호"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <PixelButton
          type="submit"
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? "로그인 중..." : "로그인"}
        </PixelButton>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-[3px] bg-brown/20" />
        <span className="text-xs text-brown-lighter">또는</span>
        <div className="flex-1 h-[3px] bg-brown/20" />
      </div>

      {/* Google Login */}
      <PixelButton
        type="button"
        variant="secondary"
        className="w-full"
        size="lg"
        onClick={handleGoogleLogin}
      >
        Google로 로그인
      </PixelButton>

      {/* Link to Signup */}
      <p className="text-center mt-6 text-sm text-brown-light">
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="text-pixel-blue font-bold hover:underline"
        >
          회원가입
        </Link>
      </p>
    </PixelCard>
  );
}
