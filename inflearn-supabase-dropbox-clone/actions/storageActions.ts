'use server';

import {
  createServerSupabaseAdminClient,
  createServerSupabaseClient,
} from 'utils/supabase/server';

function handleError(error) {
  if (error) {
    console.error(error);
    throw error;
  }
}

// 파일 업로드
export async function uploadFile(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const file = formData.get('file') as File;

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
    .upload(file.name, file, {
      upsert: true, // upsert: insert+update file.name으로 이미 파일이 존재하면 update, file.name으로 파일이 존재하지 않으면 insert
    });

  handleError(error);

  return data;
}

// 파일 조회
export async function searchFiles(search: string = '') {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
    .list('', {
      // path?(null), options?({search,}), parameters?
      search, // parameter로 받은 search 그대로 전달
    });

  handleError(error);

  return data;
}

// 파일 삭제
export async function deleteFile(fileName: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET)
    .remove([fileName]);

  handleError(error);

  return data;
}
