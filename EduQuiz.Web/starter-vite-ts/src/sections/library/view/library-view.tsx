import type { LibraryItem, LibraryFilters } from 'src/types/library';

import { varAlpha } from "minimal-shared/utils";
import { useSetState } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Card,
  Button,
  Divider, TextField,
  Typography,
  InputAdornment
} from '@mui/material';

import { paths } from "src/routes/paths";
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from "src/locales";
import { useAxios } from "src/axios/hooks";
import { endpoints } from "src/axios/endpoints";
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from "src/components/snackbar";
import { Iconify } from 'src/components/iconify';

import { ActivityList } from "../activity-list";

export function LibraryView() {
  const { t } = useTranslate();
  const router = useRouter();
  const { getAuth, deleteAuth } = useAxios();

  const [tableData, setTableData] = useState<LibraryItem[]>([]);

  const filters = useSetState<LibraryFilters>({ search: '', activity: 'All' });
  const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: currentFilters
  });

  const getData = async () => {
    const res = await getAuth<LibraryItem[]>(endpoints.library.get);
    setTableData(res);
  }

  const handleAddNewActivity = () => {
    router.push(paths.activity.create);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: event.target.value });
  };

  const handleResetSearch = () => {
    updateFilters({ search: '', activity: 'All' });
  };

  const handleDelete = async (id: string) => {
    const activity = tableData.find(item => item.id === id)?.activity;
    const url = activity === 'Quizzes' ? endpoints.quiz.delete(id) : endpoints.flashcardDeck.delete(id);
    const promise = deleteAuth(url);
    try {
      toast.promise(promise, {
        loading: t('deleting'),
        success: t('deleted'),
        error: t('error')
      });

      await promise
      setTableData(tableData.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting activity", error);
    }
  }

  const handleFilterActivity = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      updateFilters({ activity: newValue });
    },
    [updateFilters]
  );

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardContent>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
        sx={{
          mb: 2
        }}
      >
        <Typography variant="h4" sx={{ mb: 1 }}>
          {t('library-page.title')}
        </Typography>
        <Button
          variant='soft'
          color='primary'
          onClick={handleAddNewActivity}
        >
          <Iconify icon='material-symbols:add-rounded' sx={{ mr: 1 }} />
          {t('add-new-activity')}
        </Button>
      </Box>
      <Divider sx={{ mb: 4 }} />
      <Card sx={{
        border: '0.1px solid rgba(255, 255, 255, 0.1)',
      }}
      >
        <Tabs
          sx={[
            (theme) => ({
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
          value={currentFilters.activity}
          onChange={handleFilterActivity}
        >
          {['All', 'Quizzes', 'Flashcards'].map((tab) => (
            <Tab
              key={tab}
              iconPosition="end"
              value={tab}
              label={tab}
              icon={
                <Label
                  variant={(tab === currentFilters.activity && 'filled') || 'soft'}
                  color={(tab === 'Quizzes' && 'info') ||
                    (tab === 'Flashcards' && 'warning') ||
                    'default'}
                >
                  {tab === 'All' && tableData.length}
                  {tab === 'Quizzes' && tableData.filter((item) => item.activity === 'Quizzes').length}
                  {tab === 'Flashcards' && tableData.filter((item) => item.activity === 'Flashcards').length}
                </Label>
              }
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Tabs>

        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          sx={{
            p: 2.5,
            my: 1
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
        <ActivityList data={dataFiltered} onDelete={handleDelete} />
      </Card>

    </DashboardContent>
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
