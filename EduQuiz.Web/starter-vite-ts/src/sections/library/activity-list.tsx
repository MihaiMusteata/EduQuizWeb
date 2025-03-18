import type { TFunction } from "i18next";
import type { LibraryItem } from "src/types/library";
import type {
  TableHeadCellProps
} from 'src/components/table';

import { Table, TableBody } from "@mui/material";

import { useTranslate } from 'src/locales';

import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { ActivityTableRow } from "./activity-table-row";

const TABLE_HEAD = (t: TFunction): TableHeadCellProps[] => [
  {
    id: 'activity-card',
    label: t('activity'),
    sx: {
      paddingLeft: '20px',
    },
  },
];

type Props = {
  data: LibraryItem[];
  onDelete: (id: string) => void;
}

export function ActivityList({ data, onDelete }: Props) {
  const table = useTable();

  const { t } = useTranslate('common');

  const notFound = (!data.length);

  return (
    <>
      <Table size={table.dense ? 'small' : 'medium'} sx={{ width: '100%' }}>
        <TableHeadCustom
          order={table.order}
          orderBy={table.orderBy}
          headCells={TABLE_HEAD(t)}
          rowCount={data.length}
          numSelected={table.selected.length}
          onSort={table.onSort}
        />

        <TableBody>
          {data
            .slice(
              table.page * table.rowsPerPage,
              table.page * table.rowsPerPage + table.rowsPerPage
            )
            .map((row) => (
              <ActivityTableRow
                key={row.id}
                row={row}
                onDelete={onDelete}
              />

            ))}

          <TableEmptyRows
            height={table.dense ? 56 : 56 + 20}
            emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
          />

          <TableNoData notFound={notFound} />
        </TableBody>
      </Table>

      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={data.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </>
  );
}
