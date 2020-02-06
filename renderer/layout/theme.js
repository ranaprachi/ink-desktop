import { makeTheme } from 'bootstrap-styled/lib/theme';
import {
  buttonPrimary,
  buttonSecondary,
  buttonInfo,
  backgroundPrimary,
  backgroundSecondary,
  backgroundPanel,
  inputBackground
} from './colors';
import '@ibm/plex/css/ibm-plex.css';

const inkTheme = makeTheme({
  '$font-family-sans-serif:':
    "'Roboto', 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
  '$font-family-base': "'Roboto', 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
  '$text-color': '#fff',
  '$headings-color': '#fff',
  '$body-bg': backgroundPrimary,
  '$brand-primary': backgroundPrimary,
  '$brand-info': backgroundSecondary,
  '$link-decoration': 'none',
  '$headings-font-weight': 300,
  '$panel-bg': backgroundPanel,
  '$btn-primary-bg': buttonPrimary,
  '$btn-secondary-bg': buttonSecondary,
  '$btn-secondary-border': buttonSecondary,
  '$btn-secondary-color': '#fff',
  '$btn-info-bg': buttonInfo,
  '$btn-line-height': '1em',
  '$input-color': buttonInfo,
  '$input-border-color': buttonInfo,
  '$input-border-radius': '5px',
  '$input-btn-border-width': '3px',
  '$input-bg': inputBackground,
  '$input-border-radius-sm': '.5rem',
  '$input-padding-x-sm': '.875rem',
  '$input-padding-y-sm': '.875rem',
  '$font-size-lg': '1.25rem',
  '$font-size-md': '1rem',
  '$font-size-sm': '.88rem',
  '$font-size-xs': '.75rem',
  '$font-size-base': '1rem',
  '$btn-padding-x': '.87rem',
  '$btn-padding-y': '.87rem',
  '$btn-padding-x-sm': '1rem',
  '$btn-padding-y-sm': '.5rem',
  '$btn-border-radius': '.3rem',
  '$btn-border-radius-sm': '.3rem',
  '$btn-font-weight': '900'
});

export default inkTheme;
