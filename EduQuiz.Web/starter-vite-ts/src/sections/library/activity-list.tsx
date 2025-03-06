import type { TFunction } from "i18next";
import type {
  TableHeadCellProps
} from 'src/components/table';

import { useState, useEffect } from "react";

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

import type { GeneralQuiz } from "../../types/quiz";

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
  data: GeneralQuiz[];
}

export function ActivityList({ data }: Props) {
  const table = useTable();
  const [dataFiltered, setDataFiltered] = useState<GeneralQuiz[]>(data);
  const { t } = useTranslate('common');

  const notFound = (!dataFiltered.length);

  useEffect(() => {
    setDataFiltered(data);
  }, [data]);
  return (
    <>
      <Table size={table.dense ? 'small' : 'medium'} sx={{ width: '100%' }}>
        <TableHeadCustom
          order={table.order}
          orderBy={table.orderBy}
          headCells={TABLE_HEAD(t)}
          rowCount={dataFiltered.length}
          numSelected={table.selected.length}
          onSort={table.onSort}
        />

        <TableBody>
          {dataFiltered
            .slice(
              table.page * table.rowsPerPage,
              table.page * table.rowsPerPage + table.rowsPerPage
            )
            .map((row) => (
              <ActivityTableRow
                key={row.id}
                row={row}
              />

            ))}

          <TableEmptyRows
            height={table.dense ? 56 : 56 + 20}
            emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
          />

          <TableNoData notFound={notFound} />
        </TableBody>
      </Table>

      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </>
  );
}
