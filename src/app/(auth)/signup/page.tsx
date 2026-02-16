"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { logError } from "@/lib/logger";
import { PixelButton, PixelCard, PixelInput } from "@/components/ui";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      logError("Signup error:", err);
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PixelCard hoverable={false} className="p-8">
        <div className="text-center">
          <div className="text-4xl mb-4">{"[ OK ]"}</div>
          <h2 className="font-pixel text-xl text-brown mb-4">
            가입 완료!
          </h2>
          <p className="text-sm text-brown-light mb-6">
            확인 이메일을 확인해주세요.
            <br />
            이메일의 링크를 클릭하면 로그인할 수 있습니다.
          </p>
          <Link href="/login">
            <PixelButton variant="primary" size="lg">
              로그인으로 돌아가기
            </PixelButton>
          </Link>
        </div>
      </PixelCard>
    );
  }

  return (
    <PixelCard hoverable={false} className="p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-pixel text-2xl text-brown mb-2">
          {"[ SIGNUP ]"}
        </h1>
        <p className="text-sm text-brown-light">
          새로운 모험을 시작하세요!
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="pixel-border bg-pixel-red/10 text-pixel-red p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSignup} className="space-y-4">
        <PixelInput
          label="닉네임"
          type="text"
          placeholder="모험가 이름"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
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
          placeholder="6자 이상"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <PixelButton
          type="submit"
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? "가입 중..." : "회원가입"}
        </PixelButton>
      </form>

      {/* Link to Login */}
      <p className="text-center mt-6 text-sm text-brown-light">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="text-pixel-blue font-bold hover:underline"
        >
          로그인
        </Link>
      </p>
    </PixelCard>
  );
}
