/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL?: string;
  readonly VITE_BRAND_LOGO_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
