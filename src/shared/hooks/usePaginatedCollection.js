import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_PAGINATION = {
    currentPage: 1,
    lastPage: 1,
    total: 0,
};

export function usePaginatedCollection({ activeTab, initialCounts, loadCounts, loadPage, onUnauthorized }) {
    const isMountedRef = useRef(true);
    const countsRequestRef = useRef(0);
    const pageRequestRef = useRef(0);

    const [items, setItems] = useState([]);
    const [tabCounts, setTabCounts] = useState(initialCounts);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleUnauthorized = useCallback(
        async (error) => {
            if (error?.status !== 401) {
                return false;
            }

            await onUnauthorized?.();
            return true;
        },
        [onUnauthorized]
    );

    const refresh = useCallback(() => {
        setReloadKey((currentValue) => currentValue + 1);
    }, []);

    const refreshCounts = useCallback(async () => {
        if (!loadCounts) {
            return;
        }

        const requestId = countsRequestRef.current + 1;
        countsRequestRef.current = requestId;

        try {
            const nextCounts = await loadCounts();

            if (!isMountedRef.current || requestId !== countsRequestRef.current) {
                return;
            }

            setTabCounts((currentValue) => ({ ...currentValue, ...nextCounts }));
        } catch (error) {
            if (!isMountedRef.current || requestId !== countsRequestRef.current) {
                return;
            }

            await handleUnauthorized(error);
        }
    }, [handleUnauthorized, loadCounts]);

    const refreshPage = useCallback(async () => {
        const requestId = pageRequestRef.current + 1;
        pageRequestRef.current = requestId;

        setIsLoading(true);
        setLoadError('');

        try {
            const result = await loadPage({ activeTab, page: 1 });

            if (!isMountedRef.current || requestId !== pageRequestRef.current) {
                return;
            }

            setItems(result?.items || []);
            setPagination(result?.meta || DEFAULT_PAGINATION);
        } catch (error) {
            if (!isMountedRef.current || requestId !== pageRequestRef.current) {
                return;
            }

            const wasUnauthorized = await handleUnauthorized(error);

            if (!wasUnauthorized) {
                setLoadError(error instanceof Error ? error.message : 'Unable to load data right now.');
            }
        } finally {
            if (isMountedRef.current && requestId === pageRequestRef.current) {
                setIsLoading(false);
            }
        }
    }, [activeTab, handleUnauthorized, loadPage]);

    useEffect(() => {
        void refreshCounts();
    }, [refreshCounts, reloadKey]);

    useEffect(() => {
        void refreshPage();
    }, [refreshPage, reloadKey]);

    const loadMore = useCallback(async () => {
        if (isLoading || isLoadingMore || pagination.currentPage >= pagination.lastPage) {
            return { ok: false, reason: 'unavailable' };
        }

        setIsLoadingMore(true);

        try {
            const nextPage = pagination.currentPage + 1;
            const result = await loadPage({ activeTab, page: nextPage });

            if (!isMountedRef.current) {
                return { ok: false, reason: 'unmounted' };
            }

            setItems((currentValue) => [...currentValue, ...(result?.items || [])]);
            setPagination(result?.meta || DEFAULT_PAGINATION);

            return { ok: true };
        } catch (error) {
            if (!isMountedRef.current) {
                return { ok: false, reason: 'unmounted' };
            }

            const wasUnauthorized = await handleUnauthorized(error);

            if (wasUnauthorized) {
                return { ok: false, reason: 'unauthorized' };
            }

            return {
                ok: false,
                message: error instanceof Error ? error.message : 'Unable to load more data.',
                reason: 'error',
            };
        } finally {
            if (isMountedRef.current) {
                setIsLoadingMore(false);
            }
        }
    }, [activeTab, handleUnauthorized, isLoading, isLoadingMore, loadPage, pagination.currentPage, pagination.lastPage]);

    return {
        isLoading,
        isLoadingMore,
        items,
        loadError,
        loadMore,
        pagination,
        refresh,
        reloadKey,
        setItems,
        tabCounts,
    };
}