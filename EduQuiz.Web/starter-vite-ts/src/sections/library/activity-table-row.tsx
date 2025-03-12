import type { LibraryItem } from "src/types/library";

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { ActivityCard } from "./activity-card";


// ----------------------------------------------------------------------

type Props = {
  row: LibraryItem;
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
          totalItems={row.totalItems}
          visibility={row.visibility}
          createdAt={row.createdAt}
          activity={row.activity}
        />
      </TableCell>
    </TableRow>
  );
}
