import axios from 'axios';
import AsyncSelect from 'react-select/async';
import { FieldLabel } from '../ui/field';
import { debounce } from '@/lib/utils';
import { useRef } from 'react';

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

export default function LocationReactSelect({ option, label, onChange }: LocationSelectProps) {
    const abortLocations = useRef<AbortController | null>(null);


    // const loadOptions = async (inputValue: string): Promise<Option[]> => {
    //     if (inputValue.length < 2) return [];
    //     const res = await axios.get(route('locations.search'), {
    //         params: { query: inputValue },
    //         signal: abortLocations.current?.signal
    //     });
    //     return res.data.map((u: Location) => ({
    //         value: u.id,
    //         label: u.location_name,
    //     }));
    // };

    const loadUbigeosOptions = debounce((search: string, callback: any) => {
        abortLocations.current?.abort(); // ✅ Cancela la petición anterior
        abortLocations.current = new AbortController();

        return axios.get(route('locations.search'), {
            params: { query: search },
            signal: abortLocations.current?.signal
        })
        .then((res) =>{
            callback(
                res.data.map((u: Location) => ({
                    value: u.id,
                    label: u.location_name,
                })),
            );
        })
    }, 500);

    const isDark = document.documentElement.classList.contains('dark');

    return (
        <div>
            <FieldLabel className="mb-1">{label ?? ''}</FieldLabel>
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadUbigeosOptions}
                isClearable
                value={option}
                onChange={(selectedOpt) => {
                    onChange(selectedOpt);
                }}
                placeholder="Buscar ubicación..."
                styles={
                    isDark
                        ? {
                              control: (base) => ({
                                  ...base,
                                  backgroundColor: '#111111',
                                  color: '#f9fafb',
                                  borderColor: '#333',
                              }),
                              input: (styles: any) => ({ ...styles, color: '#f9fafb' }),
                              singleValue: (styles: any) => ({ ...styles, color: '#f9fafb' }),
                              menuList: (base) => ({
                                  ...base,
                                  backgroundColor: '#374151',
                                  color: '#f9fafb',
                              }),
                              menu: (base) => ({
                                  ...base,
                                  backgroundColor: '#374151',
                                  color: '#f9fafb',
                              }),
                          }
                        : {}
                }
            />
        </div>
    );
}
