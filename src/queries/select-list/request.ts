import client from '@/config/http/admin/page';
import { selectListPath } from './constant';

import { GetSelectListResponse } from './type';

const selectListApi = {
  get: async (query?: any) => {
    const response = await client.get<GetSelectListResponse>(
      selectListPath.get,
      {
        params: query,
      }
    );
    return response.data;
  },
};
export default selectListApi;

