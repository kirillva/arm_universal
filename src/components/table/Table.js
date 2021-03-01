import React, { useEffect, useRef, useState } from "react";
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
import { Box, Button, CircularProgress, TextField } from "@material-ui/core";
import {
  ArrowDropDown,
  ArrowDropUp,
  Description,
  Filter,
  FilterList,
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  LensTwoTone,
  Refresh,
} from "@material-ui/icons";
import classNames from "classnames";
import { EditRowForm } from "./EditRowForm";
import moment from "moment";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  // root: {
  //   width: "100%",
  // },
  // paper: {
  //   width: "100%",
  //   // marginBottom: theme.spacing(2),
  // },
  // header: {},
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
    borderLeft: "1px solid #e0e0e0",
  },
  headerTitle: {
    overflow: "hidden",
    maxHeight: "30px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    userSelect: "none",
    display: "flex",
    flexDirection: "row",
  },
  headerTitleText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    // flex: 1,
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
  iconButtonFlex: {
    flex: 1,
  },
  highlight: {
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.main, 0.85),
  },
  progress: {
    margin: "auto",
  },
  progressWrapper: {
    height: 100,
    display: "flex",
    alignItems: "center",
  },
  paginationRoot: {
    display: "flex",
    margin: `0 0 0 ${theme.spacing(2)}px`,
  },
  gotoPage: {
    margin: "auto",
    width: 40,
    height: 30,
  },
  input: {
    padding: 0,
    height: 30,
    textAlign: "center",
  },
  body: {
    backgroundColor: '#FFFFFF'
  },
  container: {
    backgroundColor: '#FAFAFA'
  }
}));

const GotoPageField = ({ pageCount, gotoPage, pageIndex }) => {
  const [error, setError] = useState(null);
  const classes = useStyles();

  const [targetPage, setTargetPage] = useState(pageIndex + 1);

  useEffect(() => {
    const schema = Yup.number().required().nullable().max(pageCount).min(1);

    schema
      .validate(targetPage)
      .then(() => setError(null))
      .catch((err) => setError(err));
  }, [targetPage]);

  const isValid = error && error.errors.length ? false : true;
  return (
    <TextField
      inputProps={{
        className: classes.input,
      }}
      variant="outlined"
      value={targetPage}
      className={classes.gotoPage}
      onKeyPress={(e) => {
        if (e.key === "Enter" && isValid) gotoPage(Number(targetPage) - 1);
      }}
      onChange={(e) => setTargetPage(e.target.value || "")}
    />
  );
};

function TablePaginationActions(props) {
  const classes = useStyles();
  // const theme = useTheme();
  const {
    count,
    page,
    rowsPerPage,
    onChangePage,
    gotoPage,
    loadData,
    loading,
  } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.paginationRoot}>
      <IconButton onClick={loadData} disabled={loading}>
        <Refresh />
      </IconButton>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        <FirstPage />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <GotoPageField pageIndex={page} pageCount={count} gotoPage={gotoPage} />
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <LastPage />
      </IconButton>
    </div>
  );
}

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
  filter = null,
  className,
  onLoadData = () => {},
  pageIndex: innerPageIndex = 0,
  sortBy: innerSortBy = [],
  getRowClassName = () => "",
  buttons = null,
}) => {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState({ width: 500, height: 300 });

  const childRef = useRef(null);
  const parentRef = useRef(null);

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
        pageIndex: innerPageIndex,
        pageSize: 10,
      },
      columns,
      data,
      defaultColumn,
      pageCount: pageCount,
      autoResetPage: true,
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

          case "bool":
            if (item.value && item.value.value === true) {
              _filters.push({
                property: item.id,
                value: true,
                operator: "=",
              });
              _filters.push({
                property: item.id,
                value: null,
                operator: "isnot",
              });
            }

            if (item.value && item.value.value === false) {
              _filters.push({
                property: item.id,
                value: false,
                operator: "=",
              });
              _filters.push({
                property: item.id,
                value: null,
                operator: "isnot",
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

      if (filter) {
        data.filter = filter;
      }

      if (select) {
        data.select = select;
      }
      setLoading(true);
      runRpc({
        action: action,
        method: method,
        data: [data],
        type: "rpc",
      }).then((responce) => {
        if (responce.meta && responce.meta.success) {
          const _records = responce.result.records;
          setLoading(false);
          resolve({
            total: responce.result.total,
            pageCount: Math.ceil(responce.result.total / pageSize),
            data: _records,
          });
        } else {
          setLoading(false);
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

  const loadData = () => {
    onFetchDataDebounced({ pageIndex, pageSize, sortBy, filters, action }).then(
      ({ total, pageCount, data }) => {
        setTotal(total);
        setPageCount(pageCount);
        setData(data);
        onLoadData(data, pageCount);
      }
    );
  };

  useEffect(() => {
    loadData();
  }, [
    onFetchDataDebounced,
    pageIndex,
    pageSize,
    sortBy,
    filters,
    action,
    params,
  ]);

  useEffect(() => {
    if (parentRef && parentRef.current && childRef && childRef.current) {
      setSize({
        width: parentRef.current.offsetWidth,
        height: parentRef.current.offsetHeight,
      });
    }
  }, [parentRef, childRef]);

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
        <div className={classes.iconButtonFlex} />
        {buttons}
        <Button
          title={"Фильтры"}
          className={classes.iconButton}
          color={filters && filters.length ? "primary" : "black"}
          onClick={() => setFilterHidden(!filterHidden)}
        >
          <FilterListIcon />
        </Button>
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
    <Box className={className} ref={parentRef}>
      <EditRowForm
        title={title}
        action={action}
        idProperty={idProperty}
        setSelectedRow={setSelectedRow}
        selectedRow={selectedRow}
        columns={columns}
        editForm={editForm}
      />
      <Paper
        className={classes.paper}
        ref={childRef}
        // style={{ width: size.width, height: size.height }}
      >
        <EnhancedTableHead
          filters={filters}
          setFilterHidden={setFilterHidden}
          title={title}
          classes={classes}
          numSelected={Object.keys(selectedRowIds).length}
        />
        <TableContainer
          {...getTableProps()} 
          className={classes.container}
          style={{ 
            maxHeight: size.height - 116, 
            height: size.height - 116 ,
            
            width: size.width, 
          }}
          // className={className}
        >
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
                    <TableCell
                      style={column.style || {}}
                      {...column.getHeaderProps()}
                    >
                      <span
                        {...column.getSortByToggleProps()}
                        title={column.title}
                        className={classes.headerTitle}
                        style={{
                          ...column.style,
                        }}
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
            {loading ? (
              <div className={classes.progressWrapper}>
                <CircularProgress className={classes.progress} />
              </div>
            ) : (
              <TableBody className={classes.body}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      {...row.getRowProps()}
                      className={getRowClassName(row)}
                    >
                      {row.cells.map((cell) => {
                        const filterProps = cell.column.fieldProps;
                        if (!selectable && cell.column.id === "selection") {
                          return null;
                        } else {
                          return (
                            <TableCell
                              title={
                                cell.column.mapAccessor
                                  ? cell.row.original[cell.column.mapAccessor]
                                  : cell.value
                              }
                              onClick={
                                editable
                                  ? onEdit(cell, row)
                                  : onClick(cell, row)
                              }
                              align="left"
                              {...cell.getCellProps()}
                              className={classes.cell}
                              style={cell.column.style || {}}
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
            )}
          </MaterialTable>
        </TableContainer>
        <TablePagination
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count}`
          }
          ActionsComponent={(props) => (
            <TablePaginationActions
              {...props}
              gotoPage={gotoPage}
              loadData={loadData}
              loading={loading}
            />
          )}
          labelRowsPerPage={size.width < 700 ? '' : "Записей на странице:"}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
          component="div"
          count={total}
          rowsPerPage={pageSize}
          page={pageIndex}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
