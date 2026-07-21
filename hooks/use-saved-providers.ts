"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "protocollink:saved-providers";

export function useSavedProviders() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      setSavedIds(raw ? JSON.parse(raw) : []);
    } catch {
      setSavedIds([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  const toggle = useCallback((providerId: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback((providerId: string) => savedIds.includes(providerId), [savedIds]);

  return { savedIds, toggle, isSaved, loaded };
}
