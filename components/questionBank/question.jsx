import React from "react";
import Icon from '@/components/icons/icons'


export default function Question({ question, solveQuestion }) {
    var questionFrame;
    if (question.type == "MCQ") {
        questionFrame = QuestionMCQ(question, solveQuestion);
    }else if(question.type == "statements" || question.type == "Statements") {
        questionFrame = QuestionStatements(question, solveQuestion);
    }else if(question.type == "list" || question.type == "List") {
        questionFrame = QuestionList(question, solveQuestion);
    }else if(question.type == "chronology" || question.type == "Chronology") {
        questionFrame = QuestionChronology(question, solveQuestion);
    }

    return(
        <>
            {questionFrame}
        </>
    );
}

function QuestionMCQ(question, solveQuestion) {
    var additionalStyles = {
        A: [],
        B: [],
        C: [],
        D: [],
        Answer: [],
        Explanation: [],
        AnswerDiv: [],
    };

    if (question.hasOwnProperty("selectedOption") && question.isCorrect) {
        additionalStyles[question.selectedOption].push("border-2 border-green-500");
        additionalStyles["Answer"].push("text-green-500");
    } else if (question.hasOwnProperty("selectedOption")) {
        additionalStyles[question.selectedOption].push("border-2 border-red-500");
        additionalStyles["Answer"].push("text-red-500");
    } else {
        additionalStyles["AnswerDiv"].push("hidden");
    }

  return (
    <>
        {
            <div>
                <div className="font-semibold">{question.question}</div>
                <div className="m-4 space-y-2">
                    {
                        question.options.map((option, index) => (
                            <div id={`question-${question.questionId}-option-${option[0]}`} onClick={() => solveQuestion( question.questionId, option[0], question.answer, question.subject, question.type)} className={`${ additionalStyles[option[0]] } flex cursor-pointer p-1 rounded-lg  border-2`}>
                                <p>{option}</p>
                                <div id={`result-icon-${question.questionId}`} className="my-auto flex ml-auto">
                                    <div id={`result-icon-${ option[0] }-${question.questionId}-true`} className="hidden">
                                        <Icon name={'CheckCircle2'} color={'green'} size={'15'}/>
                                    </div>
                                    <div id={`result-icon-${ option[0] }-${question.questionId}-false`} className="hidden">
                                        <Icon name={'XCircle'} color={'red'} size={'15'}/>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div id={`answer-explanation-${question.questionId}`} className={` ${additionalStyles["AnswerDiv"]} `}>
                    <div> {" "} <b className={` ${additionalStyles["Answer"]} `}>Answer:</b>{" "}
                        {question.answer}
                    </div>
                    <div> {" "} <b className={` ${additionalStyles["Answer"]} `}>Explanation:</b>{" "}
                        {question.explanation}
                    </div>
                </div>
            </div>
        }
    </>
  );
}

function QuestionStatements(question, solveQuestion) {
    var additionalStyles = {
        A: [],
        B: [],
        C: [],
        D: [],
        Answer: [],
        Explanation: [],
        AnswerDiv: [],
    };

    if (question.hasOwnProperty("selectedOption") && question.isCorrect) {
        additionalStyles[question.selectedOption].push("border-2 border-green-500");
        additionalStyles["Answer"].push("text-green-500");
    } else if (question.hasOwnProperty("selectedOption")) {
        additionalStyles[question.selectedOption].push("border-2 border-red-500");
        additionalStyles["Answer"].push("text-red-500");
    } else {
        additionalStyles["AnswerDiv"].push("hidden");
    }

    return (
        <div>
            <div className="font-semibold">{question.question}</div>
            <div className="ml-2 mt-2 border-2 rounded-md border-black p-2">
                {
                    question.statements.map((statement) => (
                        <div className="mt-2">
                            {statement}
                        </div>
                    ))
                }
            </div>
            <div className="m-4 space-y-2">
                {
                    question.options.map((option, index) => (
                        <div id={`question-${question.questionId}-option-${option[0]}`} onClick={() => solveQuestion( question.questionId, option[0], question.answer, question.subject, question.type)} className={`${ additionalStyles[option[0]] } flex cursor-pointer p-1 rounded-lg  border-2`}>
                            <p>{option}</p>
                            <div id={`result-icon-${question.questionId}`} className="my-auto flex ml-auto">
                                <div id={`result-icon-${ option[0] }-${question.questionId}-true`} className="hidden">
                                    <Icon name={'CheckCircle2'} color={'green'} size={'15'}/>
                                </div>
                                <div id={`result-icon-${ option[0] }-${question.questionId}-false`} className="hidden">
                                    <Icon name={'XCircle'} color={'red'} size={'15'}/>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div id={`answer-explanation-${question.questionId}`} className={` ${additionalStyles["AnswerDiv"]} `}>
                <div>
                    <p className={` ${additionalStyles["Answer"]} `}></p>Answer: {question.answer}
                </div>
                <div>
                    <p className={` ${additionalStyles["Answer"]} `}>Explanation: </p>{question.explanation}
                </div>
            </div>
        </div>
    );
}

function QuestionList(question, solveQuestion) {
    var additionalStyles = {
        A: [],
        B: [],
        C: [],
        D: [],
        Answer: [],
        Explanation: [],
        AnswerDiv: [],
    };

    if (question.hasOwnProperty("selectedOption") && question.isCorrect) {
        additionalStyles[question.selectedOption].push("border-2 border-green-500");
        additionalStyles["Answer"].push("text-green-500");
    } else if (question.hasOwnProperty("selectedOption")) {
        additionalStyles[question.selectedOption].push("border-2 border-red-500");
        additionalStyles["Answer"].push("text-red-500");
    } else {
        additionalStyles["AnswerDiv"].push("hidden");
    }

    return (
        <div>
            <div className="font-semibold">{question.question}</div>
            <div className="flex flex-col space-x-2 mt-2 border-2 rounded-md border-black p-2">
                <div className="flex">
                    <div className="w-[50%] ml-1 font-semibold">
                        {question.listI.heading}
                    </div>
                    <div className="w-[50%] font-semibold">
                        {question.listII.heading}
                    </div>
                </div>
                {
                    question.listI.items.map((item, index) =>
                        <div className="flex mt-2 space-x-2">
                            <div className="w-[50%]">
                                { item }
                            </div>
                            <div className="w-[50%]">
                                { question.listII.items[index] }
                            </div>
                        </div>
                    )
                }
            </div>
            <div className="m-4 space-y-2">
                {
                    question.options.map((option, index) => (
                        <div id={`question-${question.questionId}-option-${option[0]}`} onClick={() => solveQuestion( question.questionId, option[0], question.answer, question.subject, question.type)} className={`${ additionalStyles[option[0]] } flex cursor-pointer p-1 rounded-lg border-2`}>
                            <p>{option}</p>
                            <div id={`result-icon-${question.questionId}`} className="my-auto flex ml-auto">
                                <div id={`result-icon-${ option[0] }-${question.questionId}-true`} className="hidden">
                                    <Icon name={'CheckCircle2'} color={'green'} size={'15'}/>
                                </div>
                                <div id={`result-icon-${ option[0] }-${question.questionId}-false`} className="hidden">
                                    <Icon name={'XCircle'} color={'red'} size={'15'}/>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div id={`answer-explanation-${question.questionId}`} className={` ${additionalStyles["AnswerDiv"]} `}>
                <div>{" "}<b className={` ${additionalStyles["Answer"]} `}>Answer:</b>{" "}
                    {question.answer}
                </div>
                <div>{" "} <b className={` ${additionalStyles["Answer"]} `}>Explanation:</b>{" "}
                    {question.explanation}
                </div>
            </div>
        </div>
    );
}

function QuestionChronology(question, solveQuestion) {
    var additionalStyles = {
        A: [],
        B: [],
        C: [],
        D: [],
        Answer: [],
        Explanation: [],
        AnswerDiv: [],
    };

    if (question.hasOwnProperty("selectedOption") && question.isCorrect) {
        additionalStyles[question.selectedOption].push(
            "border border-2 border-green-500"
        );
        additionalStyles["Answer"].push("text-green-500");
    } else if (question.hasOwnProperty("selectedOption")) {
        additionalStyles[question.selectedOption].push(
            "border border-2 border-red-500"
        );
        additionalStyles["Answer"].push("text-red-500");
    } else {
        additionalStyles["AnswerDiv"].push("hidden");
    }

    return (
        <div>
            <div className=" font-semibold">{question.question}</div>
            <div className="mt-2 mx-2 border-2 rounded-md border-black p-2">
                {question.items.map((item) => (
                    <div className="mt-2">
                        {item}
                    </div>
                ))}
            </div>
            <div className="m-4 space-y-2">
                {
                    question.options.map((option, index) => (
                        <div id={`question-${question.questionId}-option-${option[0]}`} onClick={() => solveQuestion( question.questionId, option[0], question.answer, question.subject, question.type)} className={`${ additionalStyles[option[0]] } flex cursor-pointer p-1 rounded-lg  border-2`}>
                            <p>{option}</p>
                            <div id={`result-icon-${question.questionId}`} className="my-auto flex ml-auto">
                                <div id={`result-icon-${ option[0] }-${question.questionId}-true`} className="hidden">
                                    <Icon name={'CheckCircle2'} color={'green'} size={'15'}/>
                                </div>
                                <div id={`result-icon-${ option[0] }-${question.questionId}-false`} className="hidden">
                                    <Icon name={'XCircle'} color={'red'} size={'15'}/>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div id={`answer-explanation-${question.questionId}`} className={` ${additionalStyles["AnswerDiv"]} `}>
                <div>
                    <b className={` ${additionalStyles["Answer"]} `}>Answer:</b>{" "}
                    {question.answer}
                </div>
                <div>
                    <b className={` ${additionalStyles["Answer"]} `}>Explanation:</b>{" "}
                    {question.explanation}
                </div>
            </div>
        </div>
    );
}