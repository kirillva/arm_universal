import React from "react";
import { Box, Typography } from "@material-ui/core";

export const QuestionCard = ({ title, descr, text }) => {
  return (
    <Box>
      <Typography>{title}</Typography>
      <Typography>{descr}</Typography>
      <Typography>{text}</Typography>
    </Box>
  );
};
