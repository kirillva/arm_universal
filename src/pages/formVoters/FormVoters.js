import React, { useEffect, useState } from "react";
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
import { AnswerListItem, SelectedItemCard } from "./AnswerListItem";
import { QuestionCard } from "./QuestionCard";

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
  questionWrapper: {
    flex: 1,
    margin: theme.spacing(1),
    padding: theme.spacing(3),
  },
  answerList: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
}));

export const FormVoters = () => {
  const classes = useStyles();

  const { records: questions, loading: questionLoading } = useTableData({
    action: "cs_question",
  });

  const [selectedItem, setSelectedItem] = useState(null);

  const {
    records: answers,
    loading: answerLoading,
    load: loadAnswers,
  } = useTableData({
    action: "cs_answer",
    autoload: false,
    filter: [
      { property: "f_question", value: selectedItem ? selectedItem.id : "" },
    ],
  });

  const onClickQuestion = (item) => {
    return () => {
      setSelectedItem(item);
    };
  };

  useEffect(() => {
    selectedItem && loadAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  return (
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <Box display="flex" flexDirection="row" width="100%" overflow="hidden">
        <Box className={classes.questionListWrapper}>
          <TextField variant="outlined" label="Поиск" margin="dense" />
          <Box className={classes.questionScrollList} overflow="auto">
            {questions.map((item) => (
              <Paper
                key={item.id}
                className={classNames(classes.questionCard, {
                  [classes.activeQuestionCard]:
                    selectedItem && item ? selectedItem.id === item.id : false,
                })}
                elevation={3}
                onClick={onClickQuestion(item)}
              >
                {item.id}) {item.c_title}
              </Paper>
            ))}
          </Box>
        </Box>
        <Paper className={classNames(classes.questionWrapper)} elevation={3}>
          {selectedItem && (
            <QuestionCard
              title={selectedItem.c_title}
              descr={selectedItem.c_description}
              text={selectedItem.c_text}
            />
          )}
          {answers && (
            <Box className={classNames(classes.answerList)}>
              {answers.map((item) => (
                <AnswerListItem
                  key={item.id}
                  text={item.c_text}
                  setText={() => {}}
                  action={item.c_action}
                  onChange={(e) => console.log(e.target.value)}
                />
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </div>
  );
};
