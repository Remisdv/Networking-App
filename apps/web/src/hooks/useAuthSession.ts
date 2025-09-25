import { useEffect, useState } from 'react';

import type { AuthSession } from '../api/types';
import { getAuthSession, subscribeAuthSession } from '../api/client';

export function useAuthSession(): AuthSession | null {
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession());

  useEffect(() => {
    return subscribeAuthSession((nextSession) => {
      setSession(nextSession ?? null);
    });
  }, []);

  return session;
}
