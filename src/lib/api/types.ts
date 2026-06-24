export interface ErrorStructure {
  errorCode: number | string;
  userErrorText: string;
  developerErrorText: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ErrorStructure | null;
}
