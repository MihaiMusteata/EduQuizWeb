import type { SxProps, Theme } from "@mui/material/styles";

import { CardProps } from "@mui/material";

export type HoverCardProps = CardProps & {
  sx?: SxProps<Theme>;
};
