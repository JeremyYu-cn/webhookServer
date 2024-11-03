interface ImportMetaEnv {
  VITE_REQUEST_BASE_URL: string;
}

interface APIData<T> {
  success: boolean;
  err?: string;
  data: T;
}
