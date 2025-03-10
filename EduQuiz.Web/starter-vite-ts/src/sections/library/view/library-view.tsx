import type { LibraryFilters } from 'src/types/library';

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

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { useTranslate } from "../../../locales";
import { useAxios } from "../../../axios/hooks";
import { ActivityList } from "../activity-list";
import { endpoints } from "../../../axios/endpoints";

import type { GeneralQuiz } from "../../../types/quiz";

export function LibraryView() {
  const { t: tPages } = useTranslate('pages');
  const { t: tActivity } = useTranslate('activity');
  const router = useRouter();
  const { getAuth } = useAxios();
  const { state, setState } = useSetState<LibraryFilters>({ activity: 'All' });
  const [data, setData] = useState<GeneralQuiz[]>([]);

  const getData = async () => {
    const res = await getAuth<GeneralQuiz[]>(endpoints.quiz.userQuizzes);
    setData(res);
  }

  const handleAddNewActivity = () => {
    router.push('/create');
  };

  const handleFilterActivity = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setState({ activity: newValue });
    },
    [setState]
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
          {tPages('library-page.title')}
        </Typography>
        <Button
          variant='soft'
          color='primary'
          onClick={handleAddNewActivity}
        >
          <Iconify icon='material-symbols:add-rounded' sx={{ mr: 1 }} />
          {tActivity('add-new-activity')}
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
          value={state.activity}
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
                  variant={(tab === state.activity && 'filled') || 'soft'}
                  color={(tab === 'Quizzes' && 'info') ||
                    (tab === 'Flashcards' && 'warning') ||
                    'default'}
                >
                  {tab === 'All' && data.length}
                  {tab === 'Quizzes' && data.length}
                  {tab === 'Flashcards' && data.length}
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
            placeholder="Search..."
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
          <Button variant='soft' color='primary'>
            Search
          </Button>
        </Box>
        <ActivityList data={data} />
      </Card>

    </DashboardContent>
  );
}
