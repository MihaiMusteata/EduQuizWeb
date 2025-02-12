import { styled } from "@mui/system";
import { Card } from "@mui/material";

import { HoverCardProps } from "./type";

export const HoverCard = styled(Card)<HoverCardProps>(({ theme }) => ({
  cursor: 'pointer',
  border: '0.1px solid',
  borderColor: theme.palette.surf,
  transition: 'border 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    boxShadow: `0 4px 15px rgba(0, 0, 0, 0.15)`,
    borderColor: theme.palette.primary.main,
  },
}));
