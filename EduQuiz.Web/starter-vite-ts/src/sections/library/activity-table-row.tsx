import type { LibraryItem } from "src/types/library";

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { paths } from 'src/routes/paths';

import { ActivityCard } from "./activity-card";


// ----------------------------------------------------------------------

type Props = {
  row: LibraryItem;
  onDelete: (id: string) => void;
};

type ActivityPathGenerator = (id: string) => string;

export function ActivityTableRow({ row, onDelete }: Props) {
  const editHrefMap: Record<string, ActivityPathGenerator> = {
    Quizzes: (id: string) => paths.activity.quiz.edit(id),
    Flashcards: (id: string) => paths.activity.flashcardDeck.edit(id),
  };

  const practiceHrefMap: Record<string, ActivityPathGenerator> = {
    Quizzes: (id: string) => paths.activity.quiz.practice(id),
    Flashcards: (id: string) => paths.activity.flashcardDeck.practice(id),
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
          item={row}
          onDelete={onDelete}
          editHref={editHrefMap[row.activity](row.id)}
          practiceHref={practiceHrefMap[row.activity](row.id)}
        />
      </TableCell>
    </TableRow>
  );
}
