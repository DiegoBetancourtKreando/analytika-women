import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth-store';

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    if (store.isLoading) {
      store.initialize();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return store;
}
