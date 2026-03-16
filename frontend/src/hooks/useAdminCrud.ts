import { useEffect, useState, useCallback } from 'react';

interface UseAdminCrudOptions<T> {
  fetchFn: () => Promise<T[]>;
  deleteFn?: (id: string) => Promise<void>;
}

export default function useAdminCrud<T extends { id: string }>({ fetchFn, deleteFn }: UseAdminCrudOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFn();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const confirmDelete = (item: T) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete || !deleteFn) return;
    try {
      await deleteFn(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return {
    items, loading, error, setError, fetchData,
    deleteDialogOpen, itemToDelete, confirmDelete, handleDelete, closeDeleteDialog,
  };
}
