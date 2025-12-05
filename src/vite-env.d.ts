/// <reference types="@arcgis/map-components/types/react" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISCOVER: string;
  readonly VITE_FIREBASE_CONFIG: string;
  readonly PACKAGE_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
