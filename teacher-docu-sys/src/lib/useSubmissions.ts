import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from './api';
import type { SubmissionRecord } from './api';

const AUTH_TOKEN_KEY = 'auth_token';

// Fetches submissions for the admin pages and opens documents through short-lived signed URLs
export function useSubmissions() {
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) ?? '';

    try {
      const response = await api.listSubmissions(token);
      setSubmissions(response.data);
      setError('');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Unable to load submissions.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // State is only updated once the request settles, never synchronously during the effect
    void Promise.resolve().then(load);
  }, [load]);

  const openDocument = useCallback(async (id: string, download: boolean) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) ?? '';

    try {
      const response = await api.getSubmissionFileUrl(id, token, download);
      const link = window.document.createElement('a');
      link.href = response.data.url;
      link.rel = 'noopener noreferrer';

      if (!download) {
        link.target = '_blank';
      }

      window.document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Unable to open this document.'
      );
    }
  }, []);

  const viewDocument = useCallback((id: string) => openDocument(id, false), [openDocument]);
  const downloadDocument = useCallback((id: string) => openDocument(id, true), [openDocument]);

  return { submissions, loading, error, reload: load, viewDocument, downloadDocument };
}
