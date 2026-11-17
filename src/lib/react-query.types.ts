import {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import { ApplicationException, GeneralErrorCodes } from "./rest/error-handling";

type Function = (...args: never) => unknown;
type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
type IsAny<T> = IfAny<T, true, never>;
type IsUnknown<T, Y, N = T> = IsAny<T> extends never ? (unknown extends T ? Y : N) : N;

export type AppQueryOptions<
  TFunction extends Function,
  TData = Awaited<ReturnType<TFunction>>,
  TErrorCodes = GeneralErrorCodes,
> = Omit<
  UseQueryOptions<
    Awaited<ReturnType<TFunction>>,
    ApplicationException<TErrorCodes>,
    IsUnknown<TData, Awaited<ReturnType<TFunction>>>
  >,
  "queryKey" | "queryFn"
>;

export type AppMutationOptions<
  TFunction extends Function,
  TVariables = void,
  TData = Awaited<ReturnType<TFunction>>,
  TErrorCodes = GeneralErrorCodes,
> = Omit<UseMutationOptions<TData, ApplicationException<TErrorCodes>, TVariables>, "mutationKey" | "mutationFn">;

export type AppInfiniteQueryOptions<
  TFunction extends Function,
  TData = InfiniteData<Awaited<ReturnType<TFunction>>>,
  TErrorCodes = GeneralErrorCodes,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = number,
> = Omit<
  UseInfiniteQueryOptions<
    Awaited<ReturnType<TFunction>>,
    ApplicationException<TErrorCodes>,
    IsUnknown<TData, InfiniteData<Awaited<ReturnType<TFunction>>, TPageParam>>,
    TQueryKey,
    TPageParam
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

/** Options of a generated cursor paginated infinite query hook, whose page param is the page cursor. */
export type AppCursorInfiniteQueryOptions<
  TFunction extends Function,
  TData = InfiniteData<Awaited<ReturnType<TFunction>>, string | undefined>,
  TErrorCodes = GeneralErrorCodes,
  TQueryKey extends QueryKey = QueryKey,
> = AppInfiniteQueryOptions<TFunction, TData, TErrorCodes, TQueryKey, string | undefined>;
