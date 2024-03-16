type AxiosResponse = any;

export const isFailResponse = (response: AxiosResponse) => {
  return response.status !== 200;
};

export const isError = function (e: any): e is Error {
  return e && e.stack && e.message;
};

export const getNativeErrorMessage = function (e: any): string {
  return isError(e) ? e.message : "Unknown error";
};
