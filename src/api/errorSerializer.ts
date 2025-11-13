import type { AxiosError } from "axios";

export type NormalizedError = {
  status?: number;
  code?: string;
  message: string;
  raw?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export function serializeError(err: unknown): NormalizedError {
  const axiosErr = err as AxiosError<unknown>;
  const status = axiosErr?.response?.status;
  const payload = axiosErr?.response?.data;
  const data = isRecord(payload) ? payload : undefined;

  const codeFromData =
    (data?.code as string | undefined) ??
    (data?.error as string | undefined) ??
    undefined;
  const code = codeFromData ?? axiosErr?.code;

  const messageFromData =
    (data?.message as string | undefined) ??
    (data?.error as string | undefined) ??
    (data?.detail as string | undefined) ??
    undefined;
  const message =
    messageFromData ||
    (status === 400
      ? "Solicitud inválida"
      : status === 401
        ? "No autorizado"
        : status === 403
          ? "Acceso denegado"
          : status === 404
            ? "No encontrado"
            : status && status >= 500
              ? "Error del servidor"
              : axiosErr?.message || "Ocurrió un error");
  return { status, code, message, raw: err };
}
