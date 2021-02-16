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
import { Button, TextField } from "@material-ui/core";
import {
  ArrowDropDown,
  ArrowDropUp,
  Description,
  Filter,
  FilterList,
  LensTwoTone,
} from "@material-ui/icons";
import classNames from "classnames";
import { EditRowForm } from "./EditRowForm";
import moment from "moment";

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
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "200px",
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
  method = "Query",
  params = null,
  select = null,
  editable = false,
  selectable = false,
  handleClick = null,
  editForm,
  sortBy: innerSortBy = [],
}) => {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);

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

  const [filterHidden, setFilterHidden] = useState(true);

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
      initialState: {
        sortBy: innerSortBy,
        pageSize: 10,
      },
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

  console.log("sortBy", sortBy);
  const classes = useStyles();

  const onFetchData = ({ pageIndex, pageSize, sortBy, filters }) => {
    return new Promise((resolve) => {
      const _filters = [];
      filters.forEach((item) => {
        switch (item.value.operator) {
          case "date":
            if (item.value.start) {
              _filters.push({
                property: item.id,
                value: moment(item.value.start).toISOString(true),
                operator: "gt",
              });
            }

            if (item.value.finish) {
              _filters.push({
                property: item.id,
                value: moment(item.value.finish).toISOString(true),
                operator: "lt",
              });
            }
            break;

          default:
            if (item.value && item.value.value) {
              _filters.push({
                property: item.id,
                value: item.value.value,
                operator: item.value.operator,
              });
            }
            break;
        }
      });

      const data = {
        page: pageIndex,
        start: pageIndex * pageSize,
        limit: pageSize,
        filter: _filters,
        sort: sortBy.map((item) => ({
          property: item.id,
          direction: item.desc ? "DESC" : "ASC",
        })),
      };

      if (params) {
        data.params = params;
      }

      if (select) {
        data.select = select;
      }

      runRpc({
        action: action,
        method: method,
        data: [data],
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
  }, [
    onFetchDataDebounced,
    pageIndex,
    pageSize,
    sortBy,
    filters,
    action,
    params,
  ]);

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    gotoPage(0);
  };

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const onEdit = (cell, row) => {
    return () => {
      if (cell.column.id !== "selection") {
        setSelectedRow(row);
      }
    };
  };

  const onClick = (cell, row) => {
    return () => {
      if (handleClick) {
        handleClick(cell, row);
      }
    };
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

      var textToSaveAsBlob = new Blob(
        [
          "\uFEFF" +
            Object.keys(data[0]).join(";") +
            "\n" +
            data
              .map((e) =>
                Object.keys(e)
                  .map((key) => e[key])
                  .join(";")
              )
              .join("\n"),
        ],
        { type: "text/csv", charset: "utf-8" }
      );

      var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

      var downloadLink = document.createElement("a");
      downloadLink.download = `${title} ${action}.csv`;

      downloadLink.href = textToSaveAsURL;
      downloadLink.onclick = function (event) {
        document.body.removeChild(event.target);
      };
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);

      downloadLink.click();
    });
  };

  function EnhancedTableHead(props) {
    const { title, numSelected, classes, setFilterHidden, filters } = props;

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
        {/* <Button
          title={"Фильтры"}
          className={classes.iconButton}
          color={filters && filters.length ? "primary" : "black"}
          onClick={() => setFilterHidden(!filterHidden)}
        >
          <FilterListIcon />
        </Button> */}
        {/* <Button
          title={"Экспорт в эксель"}
          // className={classes.iconButton}
          onClick={ExportToCsv}
        >
          <Description />
        </Button> */}
      </Toolbar>
    );
  }

  return (
    <>
      <EditRowForm
        title={title}
        action={action}
        idProperty={idProperty}
        setSelectedRow={setSelectedRow}
        selectedRow={selectedRow}
        columns={columns}
        editForm={editForm}
      />
      <Paper className={classes.paper}>
        <EnhancedTableHead
          filters={filters}
          setFilterHidden={setFilterHidden}
          title={title}
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
              {headers.map((column) => {
                let filterProps = { hidden: filterHidden };
                if (column.fieldProps) {
                  filterProps = Object.assign(filterProps, column.fieldProps);
                }
                if (!selectable && column.id === "selection") {
                  return null;
                } else {
                  return (
                    <TableCell {...column.getHeaderProps()}>
                      <div>
                        <span
                          // {...column.getSortByToggleProps()}
                          className={classes.headerTitle}
                        >
                          {column.render("Header")}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <ArrowDropUp />
                            ) : (
                              <ArrowDropDown />
                            )
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                      <div>
                        {column.canFilter
                          ? column.render("Filter", filterProps)
                          : null}
                      </div>
                    </TableCell>
                  );
                }
              })}
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
                      const filterProps = cell.column.fieldProps;
                      if (!selectable && cell.column.id === "selection") {
                        return null;
                      } else {
                        return (
                          <TableCell
                            title={cell.value}
                            onClick={
                              editable ? onEdit(cell, row) : onClick(cell, row)
                            }
                            align="left"
                            {...cell.getCellProps()}
                            className={classes.cell}
                          >
                            {cell.render("Cell", {
                              ...(filterProps || {}),
                              editable: false,
                            })}
                          </TableCell>
                        );
                      }
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
    </>
  );
};
