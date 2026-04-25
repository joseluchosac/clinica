import axios from 'axios';
import AsyncSelect from 'react-select/async';
import { FieldLabel } from '../ui/field';
import { debounce } from '@/lib/utils';
import { useRef } from 'react';
import { customSelectDarkStyle, customSelectLightStyle } from '@/lib/customSelectStyles';
import { useDebounce } from '@/hooks/use-debounce';

interface Location {
  id: number;
  location_name: string;
}

interface Option {
  value: number;
  label: string;
}

interface LocationSelectProps {
  option: Option;
  label: string;
  onChange: (option: Option | null) => void;
}

export default function LocationSelect({ option, label, onChange }: LocationSelectProps) {
  const abortLocations = useRef<AbortController | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. La función que hace el trabajo sucio (petición)
  const fetchUbigeos = async (inputValue: string, callback: (options: any[]) => void) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const res = await axios.get(route('locations.search'), {
        params: { query: inputValue },
        signal: abortControllerRef.current.signal
      });

      const options = res.data.map((u: any) => ({
        value: u.id,
        label: u.location_name,
      }));

      callback(options);
    } catch (e) {
      if (!axios.isCancel(e)) callback([]);
    }
  };

  // 2. Creamos la versión debounced usando nuestro hook de utils
  const debouncedLoadOptions = useDebounce(fetchUbigeos, 400);

  // 3. Función puente para React Select
  const loadOptions = (inputValue: string, callback: (options: any[]) => void) => {
    if (inputValue.length < 2) return callback([]);
    debouncedLoadOptions(inputValue, callback);
  };

  // const loadUbigeosOptions = async (inputValue: string): Promise<Option[]> => {
  //     console.log(inputValue)
  //     if (inputValue.length < 2) return [];
  //     const res = await axios.get(route('locations.search'), {
  //         params: { query: inputValue },
  //         // signal: abortLocations.current?.signal
  //     });
  //     return res.data.map((u: Location) => ({
  //         value: u.id,
  //         label: u.location_name,
  //     }));
  // };

  // const loadUbigeosOptions = debounce((search: string, callback: any) => {
  //     abortLocations.current?.abort(); // ✅ Cancela la petición anterior
  //     abortLocations.current = new AbortController();

  //     return axios.get(route('locations.search'), {
  //         params: { query: search },
  //         signal: abortLocations.current?.signal
  //     })
  //     .then((res) =>{
  //         callback(
  //             res.data.map((u: Location) => ({
  //                 value: u.id,
  //                 label: u.location_name,
  //             })),
  //         );
  //     })
  // }, 500);

  const isDark = document.documentElement.classList.contains('dark');


  return (
    <div>
      <FieldLabel className="mb-1">{label ?? ''}</FieldLabel>
      <AsyncSelect
        // cacheOptions
        // defaultOptions
        loadOptions={loadOptions}
        isClearable
        value={option}
        onChange={(selectedOpt) => {
          onChange(selectedOpt);
        }}
        placeholder="Buscar ubicación..."
        styles={isDark ? customSelectDarkStyle : customSelectLightStyle}
      />
    </div>
  );
}
