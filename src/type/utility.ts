import { PropsWithChildren } from "react";

export interface ReactFC<T = {}> extends React.FC<PropsWithChildren<T>> {}

export type Nullable<T> = T | null;

export interface HookOption<C = {}> {
	options?: object;
	callback?: (data?: C) => any;
}