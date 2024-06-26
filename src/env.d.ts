/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_ENABLED_EDITORS: string;
    VITE_DISABLED_EDITORS: string;
    VITE_DEFAULT_DRIVE_URL: string;
    VITE_DISABLE_ADD_PUBLIC_DRIVES: string;
    VITE_DISABLE_ADD_CLOUD_DRIVES: string;
    VITE_DISABLE_ADD_LOCAL_DRIVES: string;
    VITE_DISABLE_DELETE_PUBLIC_DRIVES: string;
    VITE_DISABLE_DELETE_CLOUD_DRIVES: string;
    VITE_DISABLE_DELETE_LOCAL_DRIVES: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
