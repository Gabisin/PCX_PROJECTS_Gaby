import { ToastContainer, toast, type ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Monta uma única vez em app/providers. As 3 apps de origem usavam
 * react-toastify (e uma delas também sonner) para feedback de acções —
 * padronizado aqui para que `toast.success/error/info` funcione em
 * qualquer feature sem cada uma montar o seu próprio container.
 */
export function Toaster() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      closeOnClick
      pauseOnHover
      newestOnTop
      theme="colored"
      toastClassName="rounded-md! text-sm!"
    />
  );
}

const defaultOptions: ToastOptions = { autoClose: 4000 };

/** Helpers directos — evitam importar react-toastify em cada feature. */
export const notify = {
  success: (message: string, options?: ToastOptions) => toast.success(message, { ...defaultOptions, ...options }),
  error: (message: string, options?: ToastOptions) => toast.error(message, { ...defaultOptions, ...options }),
  info: (message: string, options?: ToastOptions) => toast.info(message, { ...defaultOptions, ...options }),
  warning: (message: string, options?: ToastOptions) => toast.warning(message, { ...defaultOptions, ...options }),
};
