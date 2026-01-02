export function successResponse<T>(data: T, message?: string) {
  return Response.json({
    success: true,
    data,
    message
  });
}

export function errorResponse(message: string, status = 400) {
  return Response.json({
    success: false,
    error: message
  }, { status });
}