import type { LibraryItem } from "src/types/library";

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { paths } from 'src/routes/paths';

import { ActivityCard } from "./activity-card";


// ----------------------------------------------------------------------

type Props = {
  row: LibraryItem;
};

type ActivityPathGenerator = (id: string) => string;

export function ActivityTableRow({ row }: Props) {
  const hrefMap: Record<string, ActivityPathGenerator> = {
    Quizzes: (id: string) => paths.activity.quiz.edit(id),
  };

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
          totalItems={row.totalItems}
          visibility={row.visibility}
          createdAt={row.createdAt}
          activity={row.activity}
          editHref={hrefMap[row.activity](row.id)}
        />
      </TableCell>
    </TableRow>
  );
}
