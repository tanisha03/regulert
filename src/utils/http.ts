import { stringify } from "querystring";

// export const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;
export const API_BASE_URL = `http://localhost:8000`;

export const getApiUrl = (endpoint: string) => API_BASE_URL + endpoint;

export const httpWrapper = ({
  url,
  method,
  body,
  useCredentials = false,
  headers = {},
  queryParams = {},
}) => {
  const options = {
    method: method,
    headers: new Headers({ 'content-type': 'application/json', ...headers }), // by default setting the content-type to be json type
    body: body ? JSON.stringify(body) : null,
  };
  // @ts-ignore
  if (useCredentials) options.credentials = 'include';
//   if (queryParams) {
    // url = `${url}?${stringify(queryParams)}`;
//   }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return res.json().then(function (json) {
        // to be able to access error status when you catch the error
        return Promise.reject({
          status: res.status,
          ok: false,
          message: json.message,
          body: json,
        });
      });
    }
  });
};

export const fetchAlertsFromAPI = async (timeRange: any) => {
  const url = getApiUrl(`/fetch-alerts?timeRange=${timeRange}`);
//   const url = getApiUrl(`/fetch-alerts`);
  const method = 'GET';
  return httpWrapper({
    url: url,
    method
    // body: {
    //   timeRange
    // },
  });
};