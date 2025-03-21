import type { ReactNode } from 'react';

import { ListItem } from '@mui/material';

interface ListItemHoverProps {
  onClick: () => void;
  children: ReactNode;
}

export function ListItemHover({ onClick, children }: ListItemHoverProps) {
  return (
    <ListItem
      sx={{
        p: 0,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
      }}
      onClick={onClick}
    >
      {children}
    </ListItem>
  );
}
