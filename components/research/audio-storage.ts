'use client'

import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

/**
 * Voice answers. Uploads to the Supabase Storage bucket `research-audio` (public read);
 * falls back to an inline data URL so nothing is lost before the bucket exists.
 */
export const AUDIO_BUCKET = 'research-audio'

export async function uploadAudio(blob: Blob, path: string): Promise<string> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.storage.from(AUDIO_BUCKET).upload(path, blob, {
      contentType: blob.type || 'audio/webm',
      upsert: true,
    })
    if (!error) {
      const { data } = supabase.storage.from(AUDIO_BUCKET).getPublicUrl(path)
      if (data?.publicUrl) return data.publicUrl
    }
  }
  return blobToDataUrl(blob)
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error)
    r.readAsDataURL(blob)
  })
}

/** Answer key that carries the audio URL for a question. */
export const audioKey = (questionId: string) => `${questionId}:audio`
