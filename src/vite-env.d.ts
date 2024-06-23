// These constants are string-replaced compile time.

// See https://vitejs.dev/config/shared-options.html#define
declare const VERSION: string;
declare const HOMEPAGE: string;
declare const BUILD_TIME: string;

// API to verify an email address
declare const REQUEST_TOKEN_API: string;
// API to confirm an email address
declare const CONFIRM_EMAIL_API: string;
// API to submit a registration
declare const REGISTER_API: string;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
