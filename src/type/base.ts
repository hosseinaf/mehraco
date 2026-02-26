import { Nullable } from './utility';

export interface ErrorData<E = {}> extends Response<E> {}
export interface Response<T = null> {
  response: {
    data: ResponseData<T>;
    status: number;
    statusText: string;
  };
}
export type ResponseData<T> = {
  detail: string;
  instance: string;
  status: string;
  title: string;
  traceId: string;
  errorMessage?: string;
};

// Base Entities
export interface BaseEntity {}
// Base Components

export interface BaseComponent<T> {
  options?: T;
}

export interface BaseComponentHook {
  baseClass?: string;
}

export interface PaginateData {
  current_page: number;
  last_page: number;
  total: number;
}

export type QueryKey<T, Q = {}> = [T] | [T, Q];

export enum LegalType {
  None = 'None',
  Real = 'Real',
  Legal = 'Legal',
}

export enum ActivationStatus {
  None = 'None',
  Active = 'Active',
  DeActive = 'DeActive',
}

// export enum Gender {
//   None = 'None',
//   Male = 'مرد',
//   Female = 'زن',
// }
export enum Gender {
  None = 'None',
  Male = 'Male',
  Female = 'Female',
}
export interface GovernmentSystemInfo {
  mclUsername: Nullable<string>;
  mclPassword: Nullable<string>;
  eServiceUsername: Nullable<string>;
  eServicePassword: Nullable<string>;
  taxUsername: Nullable<string>;
  taxPassword: Nullable<string>;
  sanaUsername: Nullable<string>;
  sanaPassword: Nullable<string>;
}
