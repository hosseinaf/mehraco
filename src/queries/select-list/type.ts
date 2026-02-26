import { LegalType, QueryKey } from "@/type/base";
import { Nullable } from "@/type/utility";

export interface getSelectListPayload {
  search?: string;
  id?: number;
  legalType?: LegalType;
}
export type GetSelectListQuery = QueryKey<"select-list", getSelectListPayload>;
export interface SelectList {
  id: number;
  name: Nullable<string>;
}

export interface GetSelectListResponse extends Array<SelectList> {}

