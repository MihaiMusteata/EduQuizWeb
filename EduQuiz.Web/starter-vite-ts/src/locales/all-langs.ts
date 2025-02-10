import {
  enUS as enUSDate,
  roRO as roRODate,
  ruRU  as ruRUDate,
} from '@mui/x-date-pickers/locales';
import {
  enUS as enUSDataGrid,
  roRO as roRODataGrid,
  ruRU as ruRUDataGrid,
} from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: 'en',
    label: 'English',
    countryCode: 'GB',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
  },
  {
    value: 'ro',
    label: 'Română',
    countryCode: 'MD',
    adapterLocale: 'ro',
    numberFormat: { code: 'ro-RO', currency: 'MDL' },
    systemValue: {
      components: { ...roRODate.components, ...roRODataGrid.components },
    },
  },
  {
    value: 'ru',
    label: 'Русский',
    countryCode: 'RU',
    adapterLocale: 'ru',
    numberFormat: { code: 'ru-RU', currency: 'RUB' },
    systemValue: {
      components: { ...ruRUDate.components, ...ruRUDataGrid.components },
    },
  },
];
