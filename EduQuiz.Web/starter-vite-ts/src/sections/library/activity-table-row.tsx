import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { ActivityCard } from "./activity-card";

import type { GeneralQuiz } from "../../types/quiz";


// ----------------------------------------------------------------------

type Props = {
  row: GeneralQuiz;
};

export function ActivityTableRow({ row }: Props) {

  return (
    <TableRow hover tabIndex={-1}>
      <TableCell
        sx={{
          whiteSpace: 'nowrap',
          flex: 1,
          width: '100%',
          paddingLeft: '20px',
        }}
      >
        <ActivityCard
          title={row.title}
          totalQuestions={row.totalQuestions}
          visibility={row.visibility}
          createdAt={row.createdAt}
          category="quiz"
        />
      </TableCell>
    </TableRow>
  );
}
