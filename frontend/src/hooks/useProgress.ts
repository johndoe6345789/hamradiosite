import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from '@/i18n/navigation';
import {
  fetchOverallProgress,
  fetchTopicBreakdown,
  fetchWeakAreas,
  fetchHistory,
} from '@/store/slices/progressSlice';

export default function useProgress() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const progress = useAppSelector((state) => state.progress);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    dispatch(fetchOverallProgress());
    dispatch(fetchTopicBreakdown());
    dispatch(fetchWeakAreas());
    dispatch(fetchHistory());
  }, [dispatch, isAuthenticated, router]);

  return { ...progress, isAuthenticated };
}
