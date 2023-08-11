import React from "react";

type Props = {
  question: string;
  answers: string[];
  callback: any;
  userAnswer: any;
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
  <div>
    <p className="number">
      Question: {questionNumber} / {totalQuestions}
    </p>
    {/* using dangerouslySetInnerHTML because question will contain html elements not just text and we want that to be turned to html ex: <b>Hello</b> */}
    <p dangerouslySetInnerHTML={{ __html: question }} />
    <p>{question}</p>
    {answers.map((answer) => (
      <div>
        <button disabled={userAnswer} onClick={callback}>
          <span dangerouslySetInnerHTML={{ __html: answer }} />
        </button>
      </div>
    ))}
  </div>
);

export default QuestionCard;
