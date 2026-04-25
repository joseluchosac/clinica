import axios from "axios";
import { useState } from "react"

const token = 'apis-token-14205.BsXqAhs4d2oJCiup9gofNeTfCzFMrYxP'
const url = 'https://api.decolecta.com/v1/reniec/dni?numero='
const datosReniecInit = {
  identity_number: '',
  first_name: '',
  last_name: '',
}
interface ReniecResponse {
  success: boolean;
  data?: any;
  message?: string;
}
export default function useReniec() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consultarDni = async (numero: string) => {
    setLoading(true);
    setError(null);
    if (!numero) {
      setError('El número de DNI es requerido');
      setLoading(false);
      return;
    }
    if (numero.length !== 8) {
      setError('El número de DNI debe tener 8 dígitos');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post<ReniecResponse>('/services/consultar-dni', {
        numero,
      });

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Error en la consulta');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, consultarDni };
}
