import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Retraso en ejecutar una acción.
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Quita los elementos de un objeto que son vacíos o nulos
export function limpiarObjeto<T extends Record<string, any>>(obj: T): Partial<T> {
    const resultado: Partial<T> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value.trim() !== '' && value !== undefined) {
            (resultado as any)[key] = value;
        }
    }
    return resultado;
}

// Extrae los parámetros de búsqueda de una URL y los devuelve como un objeto
export function getSearchParams<T = Record<string, string>>(url: string): T {
  const queryString = url.split("?")[1] || "";
  const params = new URLSearchParams(queryString);

  const obj: Record<string, string> = {};
  params.forEach((value, key) => {
    obj[key] = value;
  });

  return obj as unknown as T;
}

// Calcula la edad a partir de una fecha de nacimiento
export function calcularEdad(fechaNacimiento: string): number | null {
  let edad: number | null = null;
  if(fechaNacimiento){
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
  
    edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
  }

  return edad;
}

export const dialogConfirmInit = {
  open: false,
  title: '¿Confirmar acción?',
  description: '¿Deseas confirmar esta operación?',
  confirmText: 'Sí, continuar',
  cancelText: 'Cancelar',
};
