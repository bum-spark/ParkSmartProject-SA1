
export interface ApiResponse<T> {
  error: boolean;
  msg: string;
  data?: T;
}
