import type { LinkProps } from '@mui/material/Link';

import { forwardRef } from 'react';
import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export const Logo = forwardRef<HTMLAnchorElement, LogoProps>((props, ref) => {
  const { className, href = '/', isSingle = true, disabled, sx, ...other } = props;

  const theme = useTheme();

  const PRIMARY_MAIN = theme.vars.palette.primary.main;

  const customLogo = (
    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 286.74 286.73">
      <defs>
        <style>
          {`.cls-1{fill:${PRIMARY_MAIN};}.cls-2{fill:#fff;}`}
        </style>
      </defs>
      <path className="cls-1"
            d="M439.39,320.39V538.86A34.14,34.14,0,0,1,405.25,573H186.79a34.13,34.13,0,0,1-34.14-34.13V320.39a34.13,34.13,0,0,1,34.14-34.13H405.25A34.14,34.14,0,0,1,439.39,320.39Z"
            transform="translate(-152.65 -286.26)" />
      <path className="cls-2"
            d="M309.53,484.67l30,30a2.57,2.57,0,0,1-.62,4.09,100,100,0,0,1-43.73,11.29v0h-98a5.22,5.22,0,0,1-5.2-5.21V334.32a5.21,5.21,0,0,1,5.19-5.2H290a5.18,5.18,0,0,1,5.18,5.18v33.87a5.22,5.22,0,0,1-5.2,5.21H241.5a5.22,5.22,0,0,0-5.21,5.2v23.71a5.23,5.23,0,0,0,5.21,5.21H290a5.19,5.19,0,0,1,5.2,5.19v33.86a5.22,5.22,0,0,1-5.2,5.2H241.5a5.22,5.22,0,0,0-5.21,5.2v23.72a5.22,5.22,0,0,0,5.21,5.2h53A56.5,56.5,0,0,0,307,484,2.57,2.57,0,0,1,309.53,484.67Z"
            transform="translate(-152.65 -286.26)" />
      <path className="cls-2"
            d="M400,429.57a100.08,100.08,0,0,1-22.1,62.89,2.57,2.57,0,0,1-3.82.22l-27.93-27.93a2.55,2.55,0,0,1-.3-3.24,56.31,56.31,0,0,0-33.53-86.76,2.62,2.62,0,0,1-2-2.56V332.64a2.65,2.65,0,0,1,3-2.62A100.5,100.5,0,0,1,400,429.57Z"
            transform="translate(-152.65 -286.26)" />
      <path className="cls-2"
            d="M388.4,516.91v7.61a5.61,5.61,0,0,1-5.6,5.61H365.23a3.44,3.44,0,0,1-2.42-1l-14-14-32.87-32.88-2.46-2.46a.9.9,0,0,1-.25-.6V467.07a2.19,2.19,0,0,1,2.2-2.18h21a3.42,3.42,0,0,1,2.42,1l.11.11,31.33,31.32,17.16,17.17A3.42,3.42,0,0,1,388.4,516.91Z"
            transform="translate(-152.65 -286.26)" />
    </svg>
  )

  return (
    <LogoRoot
      ref={ref}
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        () => ({
          width: 40,
          height: 40,
          ...(!isSingle && { width: 102, height: 36 }),
          ...(disabled && { pointerEvents: 'none' }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {customLogo}
    </LogoRoot>
  );
});

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
