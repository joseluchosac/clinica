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
        if (value !== null && value !== '' && value !== undefined) {
            (resultado as any)[key] = value;
        }
    }
    return resultado;
}
