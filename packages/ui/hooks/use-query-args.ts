import { useSearchParams } from "next/navigation";

type UseQueryArgsProps<TState> = {
  deserialize: (queryParams: URLSearchParams) => TState;
};

export default function useQueryArgs<T>(props: UseQueryArgsProps<T>) {
  const searchParams = useSearchParams();

  return props.deserialize(searchParams);
}
