import type { StylesConfig } from 'react-select';

interface OptionType {
  value: number;
  label: string;
}

const zIndex = 'auto'; // no necesario si se esta
const optionPadding = '4px';
const optionFontSize = '14px';
export const customSelectDarkStyle: StylesConfig<OptionType, false> = {
  menuPortal: base => ({ ...base, zIndex: zIndex }),
  control: (styles, state) => ({
    ...styles,
    fontSize: optionFontSize,
    backgroundColor: 'var(--card)',
    borderColor: state.isFocused ? 'var(--ring)' : 'var(--border)',
    '&:hover': {
      borderColor: state.isFocused ? 'var(--ring)' : 'var(--border)',
    },
    boxShadow: state.isFocused ? '0 0 0 1px var(--ring)' : 'none',

  }),
  input: (styles: any) => ({ ...styles, color: 'white' }),
  singleValue: (styles: any, state) => ({ 
    ...styles, 
    color: state.isDisabled ? 'var(--muted-foreground)' : 'white',
  }),
  menuList: (styles: any) => ({ ...styles, backgroundColor: '#2b3035', fontSize: optionFontSize }),

  option: (styles: any, { isDisabled, isFocused, isSelected }: any) => {
    return {
      ...styles,
      padding: optionPadding,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? "#2684ff"
        : isFocused
        ? "#2684ff20"
        : undefined,
      color: isDisabled
        ? '#888'
        : isSelected
        ? 'white'
        : 'white',
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? "#2684ff"
            : "#2684ff40"
          : undefined,
      },
    };
  },
}
export const customSelectLightStyle:  StylesConfig<OptionType, false> = {
  menuPortal: base => ({ ...base, zIndex: zIndex }),
  control: (styles) => ({
    ...styles,
    fontSize: optionFontSize, // tamaño de fuente del input principal
  }),
  menuList: (styles: any) => ({ ...styles, fontSize: optionFontSize }),
  option: (styles: any) => {
    return {...styles, padding: optionPadding,};
  },
} 