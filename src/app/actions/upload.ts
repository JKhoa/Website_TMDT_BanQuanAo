'use server'

import { createClient } from '../../utils/supabase/server'

export async function uploadImageAction(formData: FormData) {
  const file = formData.get('file') as File
  const bucket = formData.get('bucket') as string || 'avatars'

  if (!file) {
    return { success: false, error: 'Không tìm thấy file' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Vui lòng đăng nhập để upload' }
  }

  // Create a unique file name
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  // Convert File to ArrayBuffer for uploading
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true
    })

  if (error) {
    return { success: false, error: error.message }
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return { success: true, url: publicUrlData.publicUrl }
}
