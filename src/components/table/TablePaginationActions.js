import { IconButton } from "@material-ui/core";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  Refresh,
} from "@material-ui/icons";
import { GotoPageField } from "./GotoPageField";
import { useTableComponentStyles } from "./tableComponentStyles";

export function TablePaginationActions(props) {
  const classes = useTableComponentStyles();
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
