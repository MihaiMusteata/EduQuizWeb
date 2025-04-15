import type { LibraryItem, LibraryFilters } from 'src/types/library';

import { useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import {
  Box,
  List,
  Button, Dialog,
  ListItem,
  TextField,
  Typography,
  ListItemIcon,
  ListItemText,
  DialogContent,
  InputAdornment,
  ListItemButton
} from '@mui/material';

import { paths } from "src/routes/paths";
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from "src/locales";
import { useAxios } from "src/axios/hooks";

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

type Props = {
  setItemSelected: React.Dispatch<React.SetStateAction<LibraryItem | undefined>>;
  data: LibraryItem[];
}

export function SelectActivityDialog({ setItemSelected, data }: Props) {
  const { t } = useTranslate();
  const router = useRouter();
  const { getAuth, deleteAuth } = useAxios();
  const openDialog = useBoolean();

  const filters = useSetState<LibraryFilters>({ search: '', activity: 'All' });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: data,
    filters: currentFilters
  });

  const handleAddNewActivity = () => {
    router.push(paths.activity.create);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: event.target.value });
  };

  const handleResetSearch = () => {
    updateFilters({ search: '', activity: 'All' });
  };

  const handleFilterActivity = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      updateFilters({ activity: newValue });
    },
    [updateFilters]
  );

  return (
    <>
      <Button
        variant="soft"
        color='inherit'
        sx={{
          fontWeight: 400,
          padding: '14px 14px',
          border: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
        onClick={openDialog.onTrue}
      >
        <Typography>
          Selectează Activitatea
        </Typography>
      </Button>

      <Dialog
        open={openDialog.value}
        onClose={openDialog.onFalse}
        maxWidth="md"
        fullWidth
        sx={{
          mb: 20
        }}
      >
        <DialogContent
          sx={{
            py: 2,
            borderRadius: '16px',
            border: '0.1px solid rgba(255, 255, 255, 0.1)',
          }}
        >

          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            sx={{
              p: 2,
              pt: 3,
              mb: 1
            }}
          >
            <TextField
              fullWidth
              size='small'
              placeholder={`${t('search')}...`}
              value={currentFilters.search}
              onChange={handleSearch}
              sx={{ mr: 1 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button variant='soft' color='primary' onClick={handleResetSearch}>
              {t('reset')}
            </Button>
          </Box>
          <List>
            {
              dataFiltered.map((item, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <Button variant="outlined" size="small" onClick={() => {
                      console.log("Select item",item)
                      setItemSelected(item);
                      openDialog.onFalse();
                    }}
                    >
                      Select
                    </Button>
                  }
                  disablePadding
                >
                  <ListItemButton
                    onClick={() => {
                      setItemSelected(item);
                      openDialog.onFalse();
                    }}
                  >
                    <ListItemIcon>
                      <Label
                        variant='soft'
                        color={item.activity === 'Quizzes' ? 'info' : 'warning'}
                      >
                        {item.activity}
                      </Label>
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              ))
            }
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}

type ApplyFilterProps = {
  inputData: LibraryItem[];
  filters: LibraryFilters;
}

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  const { activity, search } = filters;

  if (activity !== 'All') {
    inputData = inputData.filter((item) => item.activity === activity);
  }

  if (search) {
    inputData = inputData.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
  }

  return inputData;
}
