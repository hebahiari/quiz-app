import React, { useState } from "react";
import { Button, Typography, Grid } from "@mui/material";
import { AnswerObject } from "../App";
import { motion } from "framer-motion";

type Props = {
  question: string;
  answers: string[];
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: AnswerObject | undefined;
  questionNumber: number;
  totalQuestions: number;
};

const QuestionCard: React.FC<Props> = ({
  question,
  answers,
  callback,
  userAnswer,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: "100%" }}
    >
      <Grid container direction="column" alignItems="center" gap={2}>
        <Typography variant="subtitle1" className="number">
          Question: {questionNumber} / {totalQuestions}
        </Typography>
        <Typography
          variant="subtitle1"
          dangerouslySetInnerHTML={{ __html: question }}
        ></Typography>
        <Grid container direction="column">
          {answers.map((answer) => {
            const userClicked = userAnswer
              ? userAnswer.answer === answer
              : false;
            const isCorrect = userAnswer
              ? userAnswer.correctAnswer === answer
              : false;

            return (
              <Button
                disabled={userAnswer ? true : false}
                onClick={callback}
                value={answer}
                key={answer}
                variant="contained"
                size="large"
                fullWidth
                style={{
                  backgroundColor: isCorrect
                    ? "#95CE7F"
                    : userClicked
                    ? "#CE7F7F"
                    : "default",
                  color: userClicked ? "white" : "default",
                  minWidth: "100%",
                }}
              >
                <Typography variant="subtitle1">
                  <span dangerouslySetInnerHTML={{ __html: answer }} />
                </Typography>
              </Button>
            );
          })}
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default QuestionCard;
