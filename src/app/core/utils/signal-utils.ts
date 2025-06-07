import { computed, signal, type Signal } from '@angular/core';
import { Observable, catchError, finalize, of, tap } from 'rxjs';

export interface ResourceSignals<T> {
  data: Signal<T | null>;
  loading: Signal<boolean>;
  error: Signal<Error | null>;
  refresh: () => void;
  setData: (data: T) => void;
  setError: (error: Error) => void;
  setLoading: (loading: boolean) => void;
}

export function createResourceSignal<T>(
  fetcher: () => Observable<T>,
  initialData: T | null = null
): ResourceSignals<T> {
  const dataSignal = signal<T | null>(initialData);
  const loadingSignal = signal<boolean>(false);
  const errorSignal = signal<Error | null>(null);

  const fetchData = () => {
    loadingSignal.set(true);
    errorSignal.set(null);

    return fetcher().pipe(
      tap((result) => {
        dataSignal.set(result);
      }),
      catchError((error: Error) => {
        errorSignal.set(error);
        return of(null);
      }),
      finalize(() => {
        loadingSignal.set(false);
      })
    );
  };

  const refresh = () => {
    fetchData().subscribe();
  };

  if (initialData === null) {
    refresh();
  }

  return {
    data: dataSignal.asReadonly(),
    loading: loadingSignal.asReadonly(),
    error: errorSignal.asReadonly(),
    refresh,
    setData: (data: T) => dataSignal.set(data),
    setError: (error: Error) => errorSignal.set(error),
    setLoading: (loading: boolean) => loadingSignal.set(loading),
  };
}

export interface PaginatedResourceSignals<T> extends ResourceSignals<T[]> {
  page: Signal<number>;
  totalPages: Signal<number>;
  hasMore: Signal<boolean>;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

export function createPaginatedResourceSignal<T, R = { items: T[]; totalPages: number }>(
  fetcher: (page: number) => Observable<R>,
  getItems: (response: R) => T[],
  getTotalPages: (response: R) => number,
  initialPage = 1
): PaginatedResourceSignals<T> {
  // Create signals
  const dataSignal = signal<T[]>([]);
  const loadingSignal = signal<boolean>(false);
  const errorSignal = signal<Error | null>(null);
  const pageSignal = signal<number>(initialPage);
  const totalPagesSignal = signal<number>(1);
  const hasMoreSignal = computed(() => pageSignal() < totalPagesSignal());

  const fetchPage = (page: number) => {
    loadingSignal.set(true);
    errorSignal.set(null);

    return fetcher(page).pipe(
      tap((response) => {
        dataSignal.set(getItems(response));
        totalPagesSignal.set(getTotalPages(response));
      }),
      catchError((error: Error) => {
        errorSignal.set(error);
        return of(null as unknown as R);
      }),
      finalize(() => {
        loadingSignal.set(false);
      })
    );
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPagesSignal()) {
      return;
    }
    pageSignal.set(page);
    fetchPage(page).subscribe();
  };

  const nextPage = () => {
    if (hasMoreSignal()) {
      goToPage(pageSignal() + 1);
    }
  };

  const prevPage = () => {
    if (pageSignal() > 1) {
      goToPage(pageSignal() - 1);
    }
  };

  const refresh = () => {
    fetchPage(pageSignal()).subscribe();
  };

  refresh();

  return {
    data: dataSignal.asReadonly(),
    loading: loadingSignal.asReadonly(),
    error: errorSignal.asReadonly(),
    page: pageSignal.asReadonly(),
    totalPages: totalPagesSignal.asReadonly(),
    hasMore: hasMoreSignal,
    refresh,
    nextPage,
    prevPage,
    goToPage,
    setData: (data: T[]) => dataSignal.set(data),
    setError: (error: Error) => errorSignal.set(error),
    setLoading: (loading: boolean) => loadingSignal.set(loading),
  };
}
