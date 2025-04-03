import {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

type Function = (...args: any) => any;
type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
type IsAny<T> = IfAny<T, true, never>;
type IsUnknown<T, Y, N = T> = IsAny<T> extends never ? (unknown extends T ? Y : N) : N;

export type AppQueryOptions<TFunction extends Function, TData = Awaited<ReturnType<TFunction>>> = Omit<
  UseQueryOptions<Awaited<ReturnType<TFunction>>, Error, IsUnknown<TData, Awaited<ReturnType<TFunction>>>>,
  "queryKey" | "queryFn"
>;

export type AppMutationOptions<
  TFunction extends Function,
  TVariables = void,
  TData = Awaited<ReturnType<TFunction>>,
> = Omit<UseMutationOptions<TData, Error, TVariables>, "mutationKey" | "mutationFn"> & {
  enableInvalidateAll?: boolean;
};

export type AppInfiniteQueryOptions<
  TFunction extends Function,
  TData = InfiniteData<Awaited<ReturnType<TFunction>>>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = number,
> = Omit<
  UseInfiniteQueryOptions<
    Awaited<ReturnType<TFunction>>,
    Error,
    IsUnknown<TData, InfiniteData<Awaited<ReturnType<TFunction>>>>,
    Awaited<ReturnType<TFunction>>,
    TQueryKey,
    TPageParam
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;
