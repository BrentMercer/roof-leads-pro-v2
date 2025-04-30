export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export type ErrorResponse = {
  message: string;
  status: 'error';
  code?: string;
};
