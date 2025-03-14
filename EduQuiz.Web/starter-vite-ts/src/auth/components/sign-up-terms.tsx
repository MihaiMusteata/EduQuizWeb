import type { TFunction } from 'i18next';
import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------
interface Props extends BoxProps {
  t: TFunction;
}
export function SignUpTerms({ t, sx, ...other }: Props) {
  return (
    <Box
      component="span"
      sx={[
        () => ({
          mt: 3,
          display: 'block',
          textAlign: 'center',
          typography: 'caption',
          color: 'text.secondary',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {t('agreement.agreeTo')}
      <Link underline="always" color="text.primary">
        {t('agreement.terms')}
      </Link>
      {t('agreement.and')}
      <Link underline="always" color="text.primary">
        {t('agreement.privacy')}
      </Link>
      .
    </Box>
  );
}
