import Box from "@mui/material/Box";
import { Typography, CardContent } from "@mui/material";

import { HoverCard } from "../hover-card";

import type { ActionCardProps } from "./type";

export function ActionCard({ title, image, description, onClick, sx }: ActionCardProps) {
  return (
    <HoverCard onClick={onClick} sx={sx}>
      <CardContent
        sx={{
          padding: 2,
          '&.MuiCardContent-root': {
            paddingBottom: 2,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: '60px',
              height: '60px',
              borderRadius: '10%',
              backgroundColor: 'primary.light',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <img
              src={image}
              alt={title}
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'contain',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography
              variant="h6"
              component="div"
            >
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </HoverCard>
  );
}
