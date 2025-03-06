import type { CardProps } from "@mui/material";
import type { Theme, SxProps } from "@mui/material/styles";

export type HoverCardProps = CardProps & {
  sx?: SxProps<Theme>;
};
