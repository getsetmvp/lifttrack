// Pull-to-refresh helper. Wraps N react-query result objects and exposes
// refreshing/onRefresh suitable for ScrollView/FlatList RefreshControl.

import { useCallback, useState } from 'react';

type RefetchHolder = { refetch: () => Promise<unknown> };

export function useRefresh(...queries: RefetchHolder[]) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(queries.map((q) => q.refetch?.()));
    } finally {
      setRefreshing(false);
    }
  }, [queries]);
  return { refreshing, onRefresh };
}
