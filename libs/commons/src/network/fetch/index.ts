import { ApolloClient, DocumentNode, InMemoryCache } from '@apollo/client';
import { getAuthToken } from '../../auth';
// import { cookies } from "next/headers"
export const API_DOMAIN =
  process?.env?.['NEXT_PUBLIC_API_DOMAIN'] ?? 'http://localhost:4000';
export const API_PREFIX = process?.env?.['NEXT_PUBLIC_API_PREFIX'] ?? 'api';
export const API_URL =
  process?.env?.['NEXT_PUBLIC_API_URL'] ?? (API_DOMAIN + '/' + API_PREFIX + '/');
export const API_GRAPHQL_PREFIX =
  process?.env?.['NEXT_PUBLIC_API_GRAPHQL_PREFIX'] ?? 'graphql';
export const API_GRAPHQL_URL =
  process?.env?.['NEXT_PUBLIC_API_GRAPHL_URL'] ?? API_DOMAIN + '/' + API_GRAPHQL_PREFIX;

// const gClient = new ApolloClient({
//   uri: API_GRAPHQL_URL,
//   cache: new InMemoryCache(),
//   link: new ApolloLink
// });

export const fromURIToAPIURL = (url: string) => {
  if (url?.startsWith('/')) url = url.substring(1);
  if (url?.includes('://')) return url;
  const url_ = `${API_URL}` + url;
  return url_;
};

export const fromURIToImageURL = (url: string) => {
  if (url?.startsWith('/')) url = url.substring(1);
  if (url?.includes('://')) return url;
  const url_ = `${API_DOMAIN}/` + url;
  return url_;
};

export type CustomFetchOptions = RequestInit & { multipart?: boolean, appendAsURI?:boolean };

export const customFetch = async (url: string, opts?: CustomFetchOptions) => {
  const appendAsURI=opts?.appendAsURI ?? true;
  const url_ = appendAsURI?fromURIToAPIURL(url):url;
  if (typeof fetch === 'undefined') return;
  const result = await fetch(url_, {
    ...(opts || {}),
    headers: {
      ...(opts?.multipart ? {} : { 'content-type': 'application/json' }),
      ...(opts?.headers || {}),
    },
    ...(opts?.body
      ? opts?.multipart
        ? { body: opts.body }
        : { body: JSON.stringify(opts?.body || {}) }
      : {}),
  });
  return await result?.json?.();
};

// export const gFetch = async (query: DocumentNode) => {
//   if (gClient) {
//     return await gClient.query({ query });
//   }
//   console.error('GraphQL client not initialized!');
//   return;
// };

export const authFetch = async (url: string, opts?: CustomFetchOptions) => {
  let token;
  if (typeof window !== 'undefined') {
    token = getAuthToken();
  } else {
    const { cookies } = await import('next/headers');
    token = JSON.parse((await cookies?.())?.get('token')?.value ?? '""');
  }
  return await customFetch(url, {
    ...(opts ?? {}),
    headers: {
      ...(opts?.headers ?? {}),
      Authorization: 'Bearer ' + token,
    },
  });
};
