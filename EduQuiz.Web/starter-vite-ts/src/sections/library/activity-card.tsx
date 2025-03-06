import { usePopover } from "minimal-shared/hooks";

import Button from "@mui/material/Button";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';

import { Iconify } from "../../components/iconify";
import { RouterLink } from "../../routes/components";
import { CustomPopover } from "../../components/custom-popover";

import type { Visibility } from "../../types/quiz";

type Props = {
  title: string,
  visibility: Visibility,
  totalQuestions: number,
  createdAt: string,
  category: string,
}

export function ActivityCard({ title, visibility, totalQuestions, createdAt, category }: Props) {
  const { t } = useTranslate('activity');
  const menuActions = usePopover();

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <li>
          <MenuItem href="/edit" component={RouterLink} onClick={() => menuActions.onClose()}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </li>

        <MenuItem
          onClick={() => {
            menuActions.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>

      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Box>
          <Typography
            variant='h5'
            fontWeight='bold'
            sx={{ mb: 1 }}
          >
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {t('category')}:
            </Typography>
            <Label
              variant='soft'
              color={category === 'quiz' ? 'info' : 'warning'}
            >
              {category}
            </Label>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {t('visibility.label')}:
            </Typography>
            <Typography variant="body2">
              {visibility === 'public' ? t('visibility.public.label') : t('visibility.private.label')}
            </Typography>
            {
              visibility === 'public' ?
                <Iconify width={16} icon="solar:lock-keyhole-minimalistic-unlocked-bold-duotone" /> :
                <Iconify width={16} icon="solar:lock-keyhole-minimalistic-locked-bold-duotone" />
            }
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {t('total-questions')}:
            </Typography>
            <Typography variant="body2">
              {totalQuestions}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {t('created-at')}:
            </Typography>
            <Typography variant="body2">
              {createdAt}
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <Button variant="soft" color="secondary" sx={{ flexGrow: 1, justifyContent: 'center' }}>
            <Iconify icon="solar:play-circle-bold-duotone" sx={{ mr: 1 }} />
            Practice
          </Button>

          <IconButton
            color={menuActions.open ? 'inherit' : 'default'}
            onClick={menuActions.onOpen}
            sx={{
              padding: 0,
              marginBottom: 'auto'
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Box>
      </Box>

      {
        renderMenuActions()
      }
    </>
  )
}
