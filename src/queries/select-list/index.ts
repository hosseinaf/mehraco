import { useQuery } from "@tanstack/react-query";

import {
  getSelectListPayload,
  GetSelectListQuery,
  GetSelectListResponse,
} from "./type";
import selectListApi from "./request";
import { ErrorData } from "@/type/base";
import { HookOption } from "@/type/utility";

interface GetSelectListHook extends getSelectListPayload, HookOption {}
export function useGetEmployerSelectList(query?: GetSelectListHook) {
  const { options, ...search } = query || {};
  return useQuery<
    GetSelectListResponse,
    ErrorData,
    GetSelectListResponse,
    GetSelectListQuery
  >({
    queryKey: ["select-list", search],
    queryFn: () => selectListApi.get(query),
  });
}

