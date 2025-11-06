/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOGIN_ID: string;
  readonly VITE_LOGIN_PASSWORD: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
