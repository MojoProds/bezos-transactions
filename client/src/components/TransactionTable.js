import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import Category from './Category';

export default function TransactionTable({ data, onClickRow, getSelectedId }) {
  const columns = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Merchant',
        accessor: 'merchant_name',
      },
      {
        Header: 'Category',
        accessor: 'category',
        Cell: ({ cell: { value } }) => <Category values={value} />,
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
    ],
    []
  );

  const getRowProps = (row) => ({
    style: {
      background: row.original.isBezosCompany ? '#ff6961' : 'white',
      border: row.original.id === getSelectedId() ? '4px solid blue' : '0px',
    },
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={
                  column.isSorted
                    ? column.isSortedDesc
                      ? 'sort-desc'
                      : 'sort-asc'
                    : ''
                }
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps(getRowProps(row))}
              onClick={() => onClickRow(row.original)}
            >
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
