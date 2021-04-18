import React, { useEffect, useRef, useState } from "react";
import MaterialTable from "@material-ui/core/Table";
import MaterialTableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
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
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { useTableComponentStyles } from "./tableComponentStyles";
import { runRpc } from "utils/rpc";
import classNames from "classnames";
import FilterListIcon from "@material-ui/icons/FilterList";
import { EditRowForm } from "./EditRowForm";
import { ArrowDropDown, ArrowDropUp, ReplayOutlined } from "@material-ui/icons";
import { TablePaginationActions } from "./TablePaginationActions";

export const useTableComponent = ({
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
  className,
  allowLoad = true,
  onLoadData = () => {},
  pageIndex: innerPageIndex = 0,
  sortBy: innerSortBy = [],
  filter: innerFilter = [],
  getRowClassName = () => "",
  buttons = null,
  state: innerState = {},
  setState = () => {},
  globalFilters = [],
  actionButtons = [
    /** {  icon, title, handler },*/
  ],
  selectedRow: _selectedRow,
  handleSave = () => {},
  handleAdd = () => {},
}) => {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedRow, _setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState({ width: 500, height: 300 });
  const [filterHidden, setFilterHidden] = useState(false);
  const [editError, setEditError] = useState("");

  const setSelectedRow = (...props) => {
    _setSelectedRow(...props);
    setEditError("");
  };
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
    state,
    stateReducer,
    toggleAllRowsSelected,
  } = useTable(
    {
      initialState: {
        filters: innerFilter,
        sortBy: innerSortBy,
        pageIndex: innerPageIndex,
        pageSize: 10,
        ...innerState,
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
              <IndeterminateCheckbox
                {...getToggleAllRowsSelectedProps()}
                title="Выбрать все"
                className={classes.checkBoxComponent}
              />
            ),
            Cell: ({ row }) => (
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps()}
                title="Выбрать"
                className={classes.checkBoxComponent}
              />
            ),
          },
          ...columns,
        ];
      });
    }
  );

  const {
    pageIndex,
    pageSize,
    sortBy,
    groupBy,
    expanded,
    filters,
    selectedRowIds,
  } = state;

  const handleUnselectAll = () => {
    state.selectedRowIds = {};
    toggleAllRowsSelected(false);
  };

  const classes = useTableComponentStyles();

  useEffect(() => {
    gotoPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const onFetchData = ({ pageIndex, pageSize, sortBy, filters }) => {
    return new Promise((resolve) => {
      let _filters = [];
      filters.forEach((item) => {
        const column = columns.find((column) => column.accessor === item.id);

        if (column) {
          switch (column.operator) {
            case "fromTo":
              if (item.value.from) {
                _filters.push({
                  property: item.id,
                  value: item.value.from,
                  operator: ">=",
                });
              }

              if (item.value.to) {
                _filters.push({
                  property: item.id,
                  value: item.value.to,
                  operator: "<=",
                });
              }
              break;

            case "date":
              // if (item.value.start) {
              //   _filters.push({
              //     property: item.id,
              //     value: moment(item.value.start).toISOString(true),
              //     operator: "gt",
              //   });
              // }

              // if (item.value.finish) {
              //   _filters.push({
              //     property: item.id,
              //     value: moment(item.value.finish).toISOString(true),
              //     operator: "lt",
              //   });
              // }
              break;

            case "bool":
              if (item.value === "true") {
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

              if (item.value === "false") {
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

            case "number":
              if (item.value) {
                _filters.push({
                  property: item.id,
                  value: item.value,
                  operator: "=",
                });
              }
              break;

            default:
              if (item.value) {
                _filters.push({
                  property: item.id,
                  value: item.value,
                  operator: "like",
                });
              }
              break;
          }
        } else {
          _filters.push({
            property: item.id,
            value: item.value,
            operator: "=",
          });
        }
      });

      if (globalFilters) {
        _filters = [..._filters, ...globalFilters];
      }

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
    if (!loading && allowLoad) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    onFetchDataDebounced,
    pageIndex,
    pageSize,
    sortBy,
    filters,
    action,
    params,
    globalFilters,
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
        <Box className={classes.buttonsWrapper}>
          {buttons}
          {numSelected > 0 ? (
            <Button
              title={"Сбросить выделение"}
              className={classes.iconButton}
              color={filters && filters.length ? "primary" : "black"}
              onClick={() => handleUnselectAll()}
            >
              <ReplayOutlined />
            </Button>
          ) : null}
          {/* <Button
            endIcon={<FilterListIcon />}
            title={"Фильтры"}
            variant="contained"
            color="primary"
            onClick={() => setFilterHidden(!filterHidden)}
          >
            Фильтры
          </Button> */}
          {numSelected > 0 &&
            actionButtons.map((item) => {
              const { handler, title, icon } = item;
              return (
                <Button
                  onClick={() => {
                    handler(selectedRowIds);
                    handleUnselectAll();
                    loadData();
                  }}
                  title={title}
                >
                  {icon}
                </Button>
              );
            })}
        </Box>
      </Toolbar>
    );
  }

  // useEffect(() => {
  //   gotoPage(0);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [globalFilters]);

  useEffect(() => {
    gotoPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters]);

  useEffect(() => {
    setState(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters, state.pageSize]);

  return {
    loading,
    loadData,
    selectedRowIds,
    setSelectedRow,
    selectedRow,
    handleUnselectAll,
    setEditError,
    table: (
      <Box className={className} ref={parentRef}>
        <EditRowForm
          error={editError}
          title={title}
          action={action}
          idProperty={idProperty}
          setSelectedRow={setSelectedRow}
          selectedRow={_selectedRow || selectedRow}
          columns={columns}
          editForm={editForm}
          handleSave={handleSave}
          handleAdd={handleAdd}
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
              height: size.height - 116,

              // width: size.width,
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
                        style={
                          column.style ||
                          (column.id === "selection" ? { width: "80px" } : {})
                        }
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
                        // classes={{
                        //   hover: classes.hoverRow
                        // }}
                        role="checkbox"
                        tabIndex={-1}
                        {...row.getRowProps()}
                        className={classNames(
                          getRowClassName(row),
                          classes.tableRow
                        )}
                      >
                        {row.cells.map((cell) => {
                          const filterProps = cell.column.fieldProps;
                          if (!selectable && cell.column.id === "selection") {
                            return null;
                          } else {
                            return (
                              <TableCell
                                title={
                                  cell.column.getTitle
                                    ? cell.column.getTitle(cell.row.original)
                                    : cell.column.mapAccessor
                                    ? cell.row.original[cell.column.mapAccessor]
                                    : cell.value
                                }
                                onClick={
                                  cell.column.id !== "selection"
                                    ? editable
                                      ? onEdit(cell, row)
                                      : onClick(cell, row)
                                    : () => {}
                                }
                                align="left"
                                {...cell.getCellProps()}
                                className={classes.cell}
                                style={
                                  cell.column.style ||
                                  (cell.column.id === "selection"
                                    ? { width: "80px" }
                                    : {})
                                }
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
            labelRowsPerPage={size.width < 700 ? "" : "Записей на странице:"}
            rowsPerPageOptions={[10, 50, 100, 150, 200]}
            component="div"
            count={total}
            rowsPerPage={pageSize}
            page={pageIndex}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    ),
  };
};
