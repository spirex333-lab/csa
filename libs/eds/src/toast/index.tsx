'use client';

export { Toaster } from '@workspace/ui/toast';
import { toast as sonnerToast, type ExternalToast } from 'sonner';

export const toast = {
  success: (message: string, opts?: ExternalToast) =>
    sonnerToast.success(message, { duration: 4000, ...opts }),
  error: (message: string, opts?: ExternalToast) =>
    sonnerToast.error(message, { duration: 4000, ...opts }),
  info: (message: string, opts?: ExternalToast) =>
    sonnerToast.info(message, { duration: 4000, ...opts }),
};
