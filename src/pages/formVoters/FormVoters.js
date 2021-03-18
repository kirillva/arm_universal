import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Table } from "components/table/Table";
import {
  NumberFilter,
  Operators,
  StringFilter,
} from "components/table/Filters";
import { NumberCell, SelectCell, StringCell } from "components/table/Cell";
import { SelectFilter } from "components/table/SelectFilter";
import { EditHouseHistory } from "../../components/EditHouseHistory";
import { Box, Drawer, Paper, TextField } from "@material-ui/core";
import { getItem } from "utils/user";
import { useTableData } from "./useTableData";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    overflow: "auto",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  questionScrollList: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  questionListWrapper: {
    display: "flex",
    flexDirection: "column",
    marginRight: theme.spacing(1),
  },
  questionCard: {
    // margin: theme.spacing(1),
    width: theme.spacing(16),
    cursor: "pointer",
    padding: theme.spacing(1),
  },
  activeQuestionCard: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
  },
  answerDescription: {
    flex: 1,
    margin: theme.spacing(1),
  },
}));

export const FormVoters = () => {
  const classes = useStyles();

  const { records: question, loading: questionLoading } = useTableData({
    action: "cs_question",
  });

  const [selectedItem, setSelectedItem] = useState(null);

  const { records: answer, loading: answerLoading } = useTableData({
    action: "cs_answer",
  });

  const onClickQuestion = (item) => {
    return () => {
      setSelectedItem(item);
    };
  };

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <Box display="flex" flexDirection="row" width="100%" overflow="hidden">
        <Box className={classes.questionListWrapper} >
          <TextField variant="outlined" label="Поиск" margin="dense" />
          <Box className={classes.questionScrollList} overflow="auto">
            {question.map((item) => (
              <Paper
                className={classNames(classes.questionCard, {
                  [classes.activeQuestionCard]:
                    selectedItem && item ? selectedItem.id === item.id : false,
                })}
                elevation={3}
                onClick={onClickQuestion(item)}
              >
                {item.id}) {item.c_description}
              </Paper>
            ))}
          </Box>
        </Box>
        <Paper className={classNames(classes.answerDescription)} elevation={3}>
          {selectedItem ? JSON.stringify(selectedItem) : ""}
        </Paper>
      </Box>
    </div>
  );
};
