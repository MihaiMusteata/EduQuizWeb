import type { CardProps } from "@mui/material";
import type { Theme, SxProps } from "@mui/material/styles";

export type ActionCardProps = CardProps & {
  title: string;
  image: string;
  description: string;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}
