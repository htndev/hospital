import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export class RequestMethods {
  protected provider = axios.create();
  async get(url: string, config?: AxiosRequestConfig | any): Promise<AxiosResponse> {
    return this.provider.get(url, config);
  }

  async post(url: string, config?: AxiosRequestConfig | any): Promise<AxiosResponse> {
    return this.provider.post(url, config);
  }

  async put(url: string, config?: AxiosRequestConfig | any): Promise<AxiosResponse> {
    return this.provider.put(url, config);
  }

  async delete(url: string, config?: AxiosRequestConfig | any): Promise<AxiosResponse> {
    return this.provider.delete(url, config);
  }

  async patch(url: string, config?: AxiosRequestConfig | any): Promise<AxiosResponse> {
    return this.provider.patch(url, config);
  }
}
