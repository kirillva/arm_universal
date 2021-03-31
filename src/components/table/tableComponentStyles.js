const { lighten } = require("@material-ui/core");
const { makeStyles } = require("@material-ui/styles");

export const useTableComponentStyles = makeStyles((theme) => ({
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
    margin: 'auto'
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
    backgroundColor: "#FFFFFF",
  },
  container: {
    backgroundColor: "#FAFAFA",
  },
  checkBoxComponent: {
    padding: '0px',
    display: 'flex',
    margin: 'auto'
  }
}));
