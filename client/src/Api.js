// @flow

// import LocalStorage from './LocalStorage';

import type { HttpMethod, GetBooksResponse } from './ApiTypes';

export default class Api {
  static requestHeaders() {
    // const token = LocalStorage.getLoginToken();
    return {
      // Authorization: `Bearer ${token || ''}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      apiVersion: 'v1',
      platform: '', // TODO
      operatingSystem: '', // TODO
      deviceModel: '', // TODO
      deviceUuid: '', // TODO
      latitude: '',
      longitude: '',
    };
  }

  static async request(
    method: HttpMethod, path: string, payload: any, formData: ?FormData,
  ): Promise<*> {
    const headers = this.requestHeaders();
    if (formData) {
      delete headers['Content-Type'];
    }
    const body = formData || (payload
      ? JSON.stringify(payload)
      : null);
    const host = process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000'
      : `http://${window.location.host}`;
    const request = await new Request(
      `${host}/api/${path}`,
      {
        headers,
        method,
        body,
      },
    );
    console.log('Sending API request:', request);
    return fetch(request).then(response => response.json())
      .then((parsed) => {
        console.log('Got API response:', parsed);
        return parsed;
      })
      .catch((error) => {
        console.log('Api.request error:', error);
        throw error;
      });
  }

  static getRequest(path: string): Promise<*> {
    return this.request('GET', path, null);
  }

  static postRequest(path: string, payload: any, formData: ?FormData): Promise<*> {
    return this.request('POST', path, payload, formData);
  }

  static putRequest(path: string, payload: any): Promise<*> {
    return this.request('PUT', path, payload);
  }

  static deleteRequest(path: string): Promise<*> {
    return this.request('DELETE', path, null);
  }

  static getBooks(): Promise<GetBooksResponse> {
    return this.getRequest('books');
  }
}
