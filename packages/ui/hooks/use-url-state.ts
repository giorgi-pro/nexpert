import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useQueryArgs from "./use-query-args";

type UseUrlStateProps<TState> = {
  base?: string;
  defaultFields?: (keyof Partial<TState>)[];
  defaultValues?: Partial<TState>;
  deserialize: (queryParams: URLSearchParams) => TState;
  serialize: (state: Partial<TState>) => URLSearchParams;
};

type HistorySource = `pushstate` | `popstate`;

export default function useUrlState<TState>({
  serialize,
  deserialize,
  base,
  defaultFields,
  defaultValues,
}: UseUrlStateProps<TState>) {
  const isDefaultValuesSet = useRef(false);

  const [readyForUrlChanges, setReadyForUrlChanges] = useState(false);
  const [isCleanState, setIsCleanState] = useState(true);

  const [urlState, setUrlState] = useState<Partial<TState>>({});

  const searchArgs = useQueryArgs({ deserialize });

  const [searchParams, setSearchParams] = useState<{
    params: string;
    source?: HistorySource;
  }>({
    params: window.location.search,
  });

  useEffect(() => {
    if (!defaultValues || isDefaultValuesSet.current) return;
    if (!readyForUrlChanges) return;
    if (searchParams.params !== ``) return;

    setIsCleanState(false);
    setUrlState({
      ...defaultValues,
    });
    isDefaultValuesSet.current = true;
  }, [defaultValues, readyForUrlChanges, searchParams.params]);

  useEffect(
    function setUrlBasedOnState() {
      if (!!base && !window.location.pathname.toLowerCase().startsWith(base))
        return;
      if (!readyForUrlChanges || isCleanState) {
        return;
      }
      const queryParams = serialize(urlState);

      const queryString = queryParams.size ? `?${queryParams}` : ``;

      const newUrl = `${window.location.href.split(`?`)[0]}${queryString}`;
      if (newUrl !== window.location.href) {
        window.history.pushState({ path: newUrl }, ``, newUrl);
        setSearchParams({
          params: queryString,
          source: `pushstate`,
        });
      }
    },
    [base, isCleanState, readyForUrlChanges, serialize, urlState],
  );

  useEffect(
    function setFilterBasedOnUrl() {
      if (!!base && !window.location.pathname.toLowerCase().startsWith(base))
        return;
      if (searchParams.source === `pushstate`) return;
      const state = deserialize(new URLSearchParams(searchParams.params));

      setUrlState(state);
      setReadyForUrlChanges(true);
    },
    [base, deserialize, searchParams],
  );

  useEffect(
    function handleWindowHistoryEvents() {
      if (!readyForUrlChanges) return;
      function handlePopState() {
        setSearchParams({
          params: window.location.search,
          source: `popstate`,
        });
      }

      window.addEventListener(`popstate`, handlePopState);
      return () => {
        window.removeEventListener(`popstate`, handlePopState);
      };
    },
    [readyForUrlChanges],
  );

  const setState = useCallback(
    (partialState: Partial<TState>) => {
      setIsCleanState(false);
      setUrlState({
        ...urlState,
        ...partialState,
      });
    },
    [urlState],
  );

  const clearState = useCallback((partialState?: Partial<TState>) => {
    setIsCleanState(false);
    setUrlState({
      ...partialState,
    });
  }, []);

  const isDirty = useMemo(() => {
    if (!urlState) return false;

    const criteria = Object.entries(urlState).filter(
      ([_, value]) => !!value,
    ) as [keyof TState, unknown][];

    return criteria.some(([key]) => !defaultFields?.includes(key));
  }, [defaultFields, urlState]);

  return {
    state: searchArgs,
    isDirty,
    setState,
    clearState,
  };
}
