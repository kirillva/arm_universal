import React, { useEffect, useState } from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useGroupBy,
  useExpanded,
  useRowSelect,
  useAsyncDebounce,
} from "react-table";
import { runRpc } from "utils/rpc";

import { lighten, makeStyles } from "@material-ui/core/styles";
import MaterialTable from "@material-ui/core/Table";
import MaterialTableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { Button, TableHead, TextField } from "@material-ui/core";
import {
  ArrowDropDown,
  ArrowDropUp,
  TableChartOutlined,
} from "@material-ui/icons";
import classNames from "classnames";
import { EnhancedTableHead } from "./EnhancedTableHead";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  header: {},
  table: {
    color: theme.palette.text.main,
  },
  cell: {
    color: theme.palette.common.grey,
    borderColor: theme.palette.common.grey,
  },
  headerTitle: {
    userSelect: "none",
    display: "flex",
    flexDirection: "row",
  },
  headerTitleText: {
    flex: 1,
  },
  container: {
    // maxHeight: "400px",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  iconButton: {
    // color: theme.palette.primary.main,
    margin: "0 0 0 auto",
  },
  highlight: {
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.main, 0.85),
  },
}));

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <Checkbox ref={resolvedRef} {...rest} color={"primary"} />
      </>
    );
  }
);

export const Table = ({
  columns,
  action,
  idProperty = "id",
  title = "Таблица",
}) => {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);

  const DefaultColumnFilter = ({ column, className }) => {
    const { filterValue } = column;
    return (
      <TextField
        className={className}
        value={filterValue && filterValue.value ? filterValue.value : ""}
        onChange={(e) => {
          column.setFilter({ value: e.target.value, operator: "like" });
        }}
      />
    );
  };

  const DefaultHeader = ({ column, className }) => {
    return (
      <Typography className={classes.headerTitleText}>
        {column.title}
      </Typography>
    );
  };

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      Header: DefaultHeader,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    // headerGroups,
    headers,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // selectedFlatRows,
    state: {
      pageIndex,
      pageSize,
      sortBy,
      groupBy,
      expanded,
      filters,
      selectedRowIds,
    },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      pageCount: pageCount,
      autoResetPage: false,
      autoResetExpanded: false,
      autoResetGroupBy: false,
      autoResetSelectedRows: false,
      autoResetSortBy: false,
      autoResetFilters: false,
      autoResetRowState: false,
      getRowId: (row, relativeIndex) => {
        return row[idProperty];
      },
      manualSortBy: true,
      manualFilters: true,
      manualPagination: true,
    },
    useFilters,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: "selection",
            groupByBoundary: true,
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ];
      });
    }
  );

  const classes = useStyles();

  const onFetchData = ({ pageIndex, pageSize, sortBy, filters }) => {
    return new Promise((resolve) => {
      const _filters = [];

      filters.forEach((item) => {
        if (item.value && item.value.value) {
          _filters.push({
            property: item.id,
            value: item.value.value,
            operator: item.value.operator,
          });
        }
      });
      runRpc({
        action: action,
        method: "Query",
        data: [
          {
            select: (columns.map((item) => item.accessor) || [])
              .concat([idProperty])
              .join(","),
            page: pageIndex,
            start: pageIndex * pageSize,
            limit: pageSize,
            filter: _filters,
          },
        ],
        type: "rpc",
      }).then((responce) => {
        if (responce.meta && responce.meta.success) {
          const _records = responce.result.records;
          resolve({
            total: responce.result.total,
            pageCount: Math.ceil(responce.result.total / pageSize),
            data: _records,
          });
        } else {
          resolve({
            total: 0,
            pageCount: 0,
            data: [],
          });
        }
      });
    });
  };

  const onFetchDataDebounced = useAsyncDebounce(onFetchData, 100);

  useEffect(() => {
    onFetchDataDebounced({ pageIndex, pageSize, sortBy, filters, action }).then(
      ({ total, pageCount, data }) => {
        setTotal(total);
        setPageCount(pageCount);
        setData(data);
      }
    );
  }, [onFetchDataDebounced, pageIndex, pageSize, sortBy, filters, action]);

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    gotoPage(0);
  };

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const ExportToCsv = () => {
    onFetchData({
      pageIndex,
      pageSize,
      sortBy,
      filters,
      action,
    }).then(({ data }) => {
      if (!data || !data.length) return null;
      const csv =
        "data:text/csv;charset=utf-8,\uFEFF" +
        Object.keys(data[0]).join(";") + "\n" + 
        data
          .map((e) =>
            Object.keys(e)
              .map((key) => e[key])
              .join(";")
          )
          .join("\n");
      global.window.open(encodeURI(csv));
    });
  };

  function EnhancedTableHead(props) {
    const { title = "Таблица", numSelected, classes } = props;

    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <Typography variant="subtitle1">Выбрано: {numSelected}</Typography>
        ) : (
          <Typography variant="h6">{title}</Typography>
        )}
        <Button className={classes.iconButton} onClick={ExportToCsv}>
          <TableChartOutlined />
        </Button>
      </Toolbar>
    );
  }

  return (
    <>
      <Paper className={classes.paper}>
        <EnhancedTableHead
          classes={classes}
          numSelected={Object.keys(selectedRowIds).length}
        />
        <TableContainer {...getTableProps()} className={classes.container}>
          <MaterialTable
            stickyHeader
            {...getTableBodyProps()}
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
          >
            <MaterialTableHead>
              {headers.map((column) => (
                <TableCell {...column.getHeaderProps()}>
                  <div>
                    <span
                      {...column.getSortByToggleProps()}
                      className={classes.headerTitle}
                    >
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ArrowDropDown />
                        ) : (
                          <ArrowDropUp />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </TableCell>
              ))}
            </MaterialTableHead>
            <TableBody>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <TableCell
                          align="left"
                          {...cell.getCellProps()}
                          className={classes.cell}
                        >
                          {cell.isGrouped ? (
                            <>
                              <span {...row.getToggleRowExpandedProps()}>
                                {row.isExpanded ? "👇" : "👉"}
                              </span>
                              {cell.render("Cell", { editable: false })} (
                              {row.subRows.length})
                            </>
                          ) : cell.isAggregated ? (
                            cell.render("Aggregated")
                          ) : cell.isPlaceholder ? null : (
                            cell.render("Cell", { editable: true })
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </MaterialTable>
        </TableContainer>
        <TablePagination
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count}`
          }
          labelRowsPerPage="Записей на странице:"
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
          component="div"
          count={total}
          rowsPerPage={pageSize}
          page={pageIndex}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
              sortBy,
              groupBy,
              expanded: expanded,
              filters,
              selectedRowIds: selectedRowIds,
              // 'selectedFlatRows[].original': selectedFlatRows.map(
              //   d => d.original
              // )
            },
            null,
            2
          )}
        </code>
      </pre> */}
      {/* <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  <div>
                    {column.canGroupBy ? (
                      <span {...column.getGroupByToggleProps()}>
                        {column.isGrouped ? "🛑 " : "👊 "}
                      </span>
                    ) : null}
                    <span {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </div>
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.isGrouped ? (
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? "👇" : "👉"}
                          </span>
                          {cell.render("Cell", { editable: false })} (
                          {row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        cell.render("Aggregated")
                      ) : cell.isPlaceholder ? null : (
                        cell.render("Cell", { editable: true })
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>
        <span>
          Page
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span>
          | Go to page:
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div> */}
    </>
  );
};
