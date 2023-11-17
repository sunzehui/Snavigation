/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_SUPABASE_URL: string;
  VITE_APP_SUPABASE_KEY: string;
}
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

