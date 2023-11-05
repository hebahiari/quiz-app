import React from "react";
//Types
import { AnswerObject } from "../App";

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
}) => (
  <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex m-1 flex-col gap-2 justify-between leading-normal">
    <p className="align-self-center">
     {questionNumber} / {totalQuestions}
    </p>
    <p dangerouslySetInnerHTML={{ __html: question }}></p>
    {/* <p>{question}</p> */}
    <div className="answers">
      {answers.map((answer) => (
        <div className="answer" key={answer}>
          <button
            disabled={userAnswer ? true : false}
            onClick={callback}
            value={answer}
          >
            <span dangerouslySetInnerHTML={{ __html: answer }} />
            {/* <span>{answer}</span> */}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default QuestionCard;
