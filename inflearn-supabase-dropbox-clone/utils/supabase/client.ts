// 목적: 브라우저 환경에서 Supabase 클라이언트를 생성하기 위한 함수
// 주요 기능:
// - createBrowserSupabaseClient(): 브라우저에서 사용할 Supabase 클라이언트를 생성합니다. Supabase의 URL과 익명 키를 환경 변수에서 읽어옵니다.

"use client";

import { createBrowserClient } from "@supabase/ssr";

export const createBrowserSupabaseClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );