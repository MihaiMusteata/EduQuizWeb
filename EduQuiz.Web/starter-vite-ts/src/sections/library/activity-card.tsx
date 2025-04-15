import type { LibraryItem } from "src/types/library";

import { usePopover } from "minimal-shared/hooks";

import Button from "@mui/material/Button";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from "src/components/iconify";
import { CustomPopover } from "src/components/custom-popover";

type Props = {
  item: LibraryItem;
  editHref: string;
  practiceHref: string;
  onDelete: (id: string) => void;
}

export function ActivityCard({ item, editHref, practiceHref, onDelete }: Props) {
  const { t } = useTranslate();
  const menuActions = usePopover();

  const handleDelete = () => {
    menuActions.onClose();
    onDelete(item.id);
  }

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        {
          item.activity === 'Quizzes' &&
          <MenuItem
            href={paths.activity.pdfDocument(item.id)}
            component={RouterLink}
            onClick={() => menuActions.onClose()}
          >
            <Iconify icon="ant-design:file-pdf-twotone" />
            Descarca PDF
          </MenuItem>
        }
        <MenuItem
          href={paths.activity.importExport(item.id)}
          component={RouterLink}
          onClick={() => menuActions.onClose()}
        >
          <Iconify icon="ic:twotone-cloud-download" />
          Export
        </MenuItem>
        <MenuItem href={editHref} component={RouterLink} onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:pen-bold" />
          {t('edit')}
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('delete')}
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
            {item.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {t('category')}:
            </Typography>
            <Label
              variant='soft'
              color={item.activity === 'Quizzes' ? 'info' : 'warning'}
            >
              {item.activity}
            </Label>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {t('visibility.label')}:
            </Typography>
            <Typography variant="body2">
              {item.visibility === 'public' ? t('visibility.public.label') : t('visibility.private.label')}
            </Typography>
            {
              item.visibility === 'public' ?
                <Iconify width={16} icon="solar:lock-keyhole-minimalistic-unlocked-bold-duotone" /> :
                <Iconify width={16} icon="solar:lock-keyhole-minimalistic-locked-bold-duotone" />
            }
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {t('total-questions')}:
            </Typography>
            <Typography variant="body2">
              {item.totalItems}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {t('created-at')}:
            </Typography>
            <Typography variant="body2">
              {item.createdAt}
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
          <Button
            variant="soft"
            color="secondary"
            sx={{ flexGrow: 1, justifyContent: 'center' }}
            href={practiceHref}
            component={RouterLink}
          >
            <Iconify icon="solar:play-circle-bold-duotone" sx={{ mr: 1 }} />
            {t('practice')}
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
