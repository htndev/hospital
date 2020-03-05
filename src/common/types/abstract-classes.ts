import axios, { AxiosInstance } from 'axios';

export abstract class ApiRequest {
  protected uri = '';
  protected provider: AxiosInstance = axios.create();
}
