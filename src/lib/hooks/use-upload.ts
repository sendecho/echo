import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UseUploadOptions {
  file: File;
  bucket: string;
  path: string;
}

interface UploadResult {
  publicUrl: string;
}

export function useUpload() {
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);

  const upload = async ({ file, bucket, path }: UseUploadOptions): Promise<UploadResult> => {
    setIsUploading(true);

    try {
      console.log('Uploading file', { fileName: file.name, fileSize: file.size });
      const { error } = await supabase.storage
        .from(bucket)
        .upload(`${path}/${file.name}`, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(`${path}/${file.name}`);

      if (!publicUrl) {
        throw new Error('No public URL returned from upload action');
      }

      console.log('Upload result:', { publicUrl });
      return { publicUrl };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }

  }

  return { upload, isUploading };
}