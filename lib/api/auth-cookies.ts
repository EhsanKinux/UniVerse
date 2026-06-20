// Cookie names for the auth tokens. Kept in a dependency-free module so both the
// browser token store (js-cookie) and the server-side `proxy` can import them
// without pulling client-only code into the server bundle.

export const ACCESS_TOKEN_COOKIE = "uv_access_token";
export const REFRESH_TOKEN_COOKIE = "uv_refresh_token";
