import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

const TOKEN_KEY = "better-auth-token";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
  plugins: [genericOAuthClient()],
  fetchOptions: {
    onRequest(context) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        context.headers.set("Authorization", `Bearer ${token}`);
      }
      return context;
    },
    onSuccess(context) {
      // Store token from response body (sign-in/sign-up return it directly)
      if (context.data?.token && typeof context.data.token === "string") {
        localStorage.setItem(TOKEN_KEY, context.data.token);
      }
      const url =
        typeof context.request.url === "string"
          ? context.request.url
          : context.request.url.toString();
      if (url.includes("/sign-out")) {
        localStorage.removeItem(TOKEN_KEY);
      }
    },
  },
});
