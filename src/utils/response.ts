export const sendSuccess = (message: string, data?: unknown, meta?: unknown) => ({
    success: true,
    message,
    data: data ?? null,
    ...(meta ? { meta } : {}),
});

export const sendError = (message: string, error?: string) => ({
    success: false,
    message,
    error: error ?? "INTERNAL_ERROR",
});