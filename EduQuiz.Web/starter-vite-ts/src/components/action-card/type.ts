import { CardProps } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

export type ActionCardProps = CardProps & {
  title: string;
  image: string;
  description: string;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}
