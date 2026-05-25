// src/app/features/onboarding/utils/file-validation.ts
export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
export const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File): FileValidationResult {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const typeOk =
    ALLOWED_FILE_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);

  if (!typeOk) {
    return {
      valid: false,
      error: 'Invalid file type. Only PDF, JPG, and PNG files are allowed.',
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'File is too large. Maximum allowed size is 10MB.',
    };
  }
  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
