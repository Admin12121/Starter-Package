import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "@/api/service/localStorageServices";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_KEY_BACKEND_DOMAIN}/`,
  prepareHeaders: (headers) => {
    const { access_token } = getToken();
    if (access_token) {
      headers.set('authorization', `Bearer ${access_token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Handle token expiration
    // Optionally, you can refresh the token here
  } else if (result.error && result.error.status === 'FETCH_ERROR') {
    // Handle no internet or backend not responding
  }

  return result;
};

export const userAuthapi = createApi({
  reducerPath: "userAuthapi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => {
        return {
          url: "/api/account/register/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    loginUser: builder.mutation({
      query: ({user}) => {
        return {
          url: "api/account/login/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    getLoggedUser: builder.query({
      query: () => {
        const {access_token} = getToken();
        return {
          url: "api/account/user/profile/",
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetLoggedUserQuery,
} = userAuthapi;
