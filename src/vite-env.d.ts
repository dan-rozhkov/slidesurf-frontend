/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_BETTER_AUTH_URL: string;
  readonly VITE_AWS_ENDPOINT: string;
  readonly VITE_AWS_BUCKET_NAME: string;
  readonly VITE_DEFAULT_ZOOM: string;
  readonly VITE_PLUS_PRICE: string;
  readonly VITE_PRO_PRICE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
