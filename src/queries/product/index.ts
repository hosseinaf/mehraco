import { useQuery } from "@tanstack/react-query";

import productApi from "./request";
import { ErrorData } from "@/type/base";
import { HookOption } from "@/type/utility";
import {
  GetProductsPayload,
  GetProductsQuery,
  GetProductsResponse,
} from "./type";

type GetProductsHook = HookOption & GetProductsPayload;

export function useGetProducts(_options?: GetProductsHook) {
  const { options, page = 1, limit = 10, q } = _options || {};

  return useQuery<
    GetProductsResponse,
    ErrorData,
    GetProductsResponse,
    GetProductsQuery
  >({
    queryKey: ["products", { page, limit, q }],
    queryFn: () => productApi.list({ page, limit, q }),
    ...options,
  });
}
