import React from "react";
import { Paper } from "@material-ui/core";
import classNames from "classnames";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  questionCard: {
    width: theme.spacing(16),
    cursor: "pointer",
    padding: theme.spacing(1),
  },
  activeQuestionCard: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
  },
}));

export const QuestionListItem = ({ item, isSelected = false, onClick }) => {
  const classes = useStyles();
  return (
    <Paper
      key={item.id}
      className={classNames(classes.questionCard, {
        [classes.activeQuestionCard]: isSelected,
      })}
      elevation={3}
      onClick={onClick(item)}
    >
      {item.id}) {item.c_title}
    </Paper>
  );
};
