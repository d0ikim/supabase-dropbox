// 목적: 서버 환경에서 Supabase 클라이언트를 생성하기 위한 함수들
// 주요 기능:
// - createServerSupabaseClient(): 서버에서 사용할 Supabase 클라이언트를 생성합니다. 환경 변수에서 Supabase의 URL과, 주어진 권한에 따라 비공식 또는 관리 권한 키를 사용합니다. 쿠키 관리 기능도 포함되어 있습니다.
// - createServerSupabaseAdminClient(): 관리 권한을 가진 Supabase 클라이언트를 생성합니다. 서버 측에서만 호출되며, admin 플래그를 true로 설정하여 관리 키를 사용합니다.

"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "types_db";

export const createServerSupabaseClient = async (
  cookieStore: ReturnType<typeof cookies> = cookies(),
  admin: boolean = false
) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    admin
      ? process.env.NEXT_SUPABASE_SERVICE_ROLE!  // admin일 경우 절대 공유되면 안되는 service role
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // admin이 아닐 경우
    {
      cookies: {  // 쿠키 설정해야 user 관련 operation이 다 동작 - 인증 구축 시 큰 역할
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

export const createServerSupabaseAdminClient = async (
  cookieStore: ReturnType<typeof cookies> = cookies()
) => {
  return createServerSupabaseClient(cookieStore, true); // admin=true 로 전달
};