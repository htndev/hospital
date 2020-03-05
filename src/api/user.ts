import axios from 'axios';
import { ApiRequest } from '@/common/types/abstract-classes';
import { API_URL } from '@/common/constants';
import { combineUrl } from '@/common/dev';

class UserEndpoint extends ApiRequest {
  protected uri = 'api/user';

  protected provider = axios.create({
    baseURL: combineUrl(API_URL, this.uri)
  });
}

export default new UserEndpoint();
