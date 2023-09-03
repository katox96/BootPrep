import React from 'react';
import { Question } from './question';
import TestStats from './testStats';
import { Clock } from './clock';
import { Instructions } from './instructions';


export const QuestionPaper = ({ data, answerQuestion }) => {
    const testPaper = data.testPaper;
    const testId = data.testId;
    const testType = data.testType;
    const startTime = data.startTime;
    const currentTime = data.currentTime;
    const isSubmitted = data.isSubmitted;

    const questionProp = {
        testId: testId,
        answers: data.answers,
        solutions: data.solutions,
        isSubmitted: isSubmitted,
        review: data.review,
        markAsReview: data.markAsReview
    };

    const statsProps = {
        testId: testId,
        solutions: data.solutions,
        answers: data.answers,
        isSubmitted: isSubmitted,
        testPaper: testPaper
    };

    const clockProp = {
        testId: testId,
        testType: testType,
        startTime: startTime,
        currentTime: currentTime
    }

    return(
        <div className="mt-6">
            <TestStats data={statsProps}></TestStats>
            <Instructions></Instructions>
            {(startTime != 0 && !isSubmitted)?  <Clock data={ clockProp }></Clock> : "" }
            {
                testPaper.map(question =>
                    <Question data={questionProp} question={question} answerQuestion={answerQuestion}></Question>
                )
            }
        </div>
    );
}