import client from "@/config/http/public/page";
import { productPath } from "./const";
import { GetProductsPayload, GetProductsResponse } from "./type";

const productApi = {
  list: async (params?: GetProductsPayload) => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;
    const q = params?.q;

    const paramsObj: Record<string, unknown> = { limit, skip };
    if (q) paramsObj.q = q;
    if (params?.sort) paramsObj.sort = params.sort;
    if (params?.category) paramsObj.category = params.category;
    if (params?.brand) paramsObj.brand = params.brand;
    if (params?.price) paramsObj.price = params.price;
    if (typeof params?.inStock === "boolean")
      paramsObj.inStock = params.inStock;

    const response = await client.get<GetProductsResponse>(productPath.list, {
      params: paramsObj,
    });
    return response.data;
  },
};

export default productApi;
