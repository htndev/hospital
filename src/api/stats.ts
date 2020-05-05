import axios from 'axios';
import { API_URL } from '@/common/constants';
import { combineUrl } from '@/common/dev';
import { RequestMethods } from '@/common/request';

export class StatsEndpoint extends RequestMethods {
  protected uri = 'stats';

  protected provider = axios.create({
    baseURL: combineUrl(API_URL, this.uri)
  });
}

export default new StatsEndpoint();
