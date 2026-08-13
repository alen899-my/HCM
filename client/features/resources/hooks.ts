"use client";

// features/resources/hooks.ts
// ─────────────────────────────────────────────────────────────────────────────
// Data-fetching hooks for the Resources module.
// Follows the project's lightweight hook pattern (local state, no react-query).
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useState } from "react";
import { resourceApi } from "./api";
import type { Resource, ResourceListParams, ResourcePayload } from "./types";

function extractError(err: unknown): string {
  const axiosErr = err as { response?: { data?: { message?: string } } };
  return (
    axiosErr?.response?.data?.message ??
    "Something went wrong. Please try again."
  );
}

// ─── List ────────────────────────────────────────────────────────────────────

export interface UseResourcesResult {
  data: Resource[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useResources(params: ResourceListParams): UseResourcesResult {
  const [data, setData] = useState<Resource[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stable dependency on the serialized params — object identity changes
  // on every render of the caller, so stringify instead.
  const paramsKey = JSON.stringify(params);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await resourceApi.list(JSON.parse(paramsKey));
      if (res.success) {
        setData(res.data ?? []);
        setTotal(res.meta?.total ?? 0);
      } else {
        setError(res.message || "Failed to load resources.");
        setData([]);
        setTotal(0);
      }
    } catch (err) {
      setError(extractError(err));
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetch();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetch]);

  return { data, total, loading, error, refetch: fetch };
}

// ─── Mutations ───────────────────────────────────────────────────────────────

interface UseMutationResult {
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useCreateResource(): UseMutationResult & {
  create: (payload: ResourcePayload) => Promise<boolean>;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (payload: ResourcePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await resourceApi.create(payload);
      if (!res.success) {
        setError(res.message || "Failed to create resource.");
        return false;
      }
      return true;
    } catch (err) {
      setError(extractError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error, clearError: () => setError(null) };
}

export function useUpdateResource(): UseMutationResult & {
  update: (id: string, payload: ResourcePayload) => Promise<boolean>;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (id: string, payload: ResourcePayload): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const res = await resourceApi.update(id, payload);
        if (!res.success) {
          setError(res.message || "Failed to update resource.");
          return false;
        }
        return true;
      } catch (err) {
        setError(extractError(err));
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { update, loading, error, clearError: () => setError(null) };
}

export function useDeleteResource(): UseMutationResult & {
  remove: (id: string) => Promise<boolean>;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await resourceApi.remove(id);
      if (!res.success) {
        setError(res.message || "Failed to delete resource.");
        return false;
      }
      return true;
    } catch (err) {
      setError(extractError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error, clearError: () => setError(null) };
}
