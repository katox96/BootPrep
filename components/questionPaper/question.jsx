import React from 'react';
import Icon from '@/components/icons/icons'


export const Question = ({ data, question, answerQuestion}) => {
    var questionFrame;
    if (question.type == "MCQ") {
        questionFrame = QuestionMCQ(data, question, answerQuestion);
    }else if(question.type == "statements" || question.type == "Statements") {
        questionFrame = QuestionStatements(data, question, answerQuestion);
    }else if(question.type == "list" || question.type == "List") {
        questionFrame = QuestionList(data, question, answerQuestion);
    }else if(question.type == "chronology" || question.type == "Chronology") {
        questionFrame = QuestionChronology(data, question, answerQuestion);
    }

    return(
        <div id={`questionId${question.questionId}`} className="mt-6 border border-1 border-grey-500 p-4 rounded-lg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]">
            { questionFrame }
        </div>
    )
}

function QuestionMCQ(data, question, answerQuestion){
    const isSubmitted = data.isSubmitted;
    const answers = data.answers;
    const solutions = data.solutions;
    const questionId = question.questionId
    const type = question.type;
    const subject = question.subject;

    var additionalStyles = {
        A: [],
        B: [],
        C: [],
        D: [],
        Answer: [],
        Explanation: [],
        AnswerDiv: [],
    };
    additionalStyles["AnswerDiv"] = "hidden";

    var reviewButton;
    if(!isSubmitted){
        var reviewStatus = <Icon name={'CheckSquare'} color={'black'} />;
        var reviewFlag = true;
        if(data.review[questionId] == true){
            reviewStatus = <Icon name={'CheckSquare'} color={'violet'} />;
            var reviewFlag = false;
        }
        reviewButton = <button onClick={() => data.markAsReview(questionId, reviewFlag)}>{ reviewStatus }</button>;
    }

    var icon;
    if(isSubmitted && answers[questionId]!= null){
        additionalStyles["AnswerDiv"] = "";
        if(answers[questionId] == solutions[questionId-1].answer[0]){
            additionalStyles[answers[questionId]].push("border-2 border-green-500");
            additionalStyles["Answer"].push("text-green-500");
        }else{
            additionalStyles[answers[questionId]].push("border-2 border-red-500");
            additionalStyles["Answer"].push("text-red-500");
        }
        icon = (answers[questionId] == solutions[questionId-1].answer[0])? <Icon name={'CheckCircle2'} color={'green'} size={'15'}/> : <Icon name={'XCircle'} color={'red'} size={'15'}/>;
    }else if(isSubmitted){
        additionalStyles["AnswerDiv"] = "";
        additionalStyles[solutions[questionId-1].answer[0]].push("border-2 border-black");
    }else if(answers[questionId] != null){
        const style = (reviewFlag)? "border-2 border-green-500" : "border-2 border-purple-500";
        additionalStyles[answers[questionId]].push(style);
    }

    return(
        <div>
            <div className=" text-right">
                {reviewButton}
            </div>
            <div className="font-semibold">
                { questionId }. {question.question}
            </div>
            <div className="m-4 space-y-2">
                {
                    question.options.map((option) => (
                        <div onClick={ () => (!isSubmitted)? answerQuestion(question.questionId, option[0], type, subject) : "" } className={`${ additionalStyles[option[0]] } border-2 border-grey-700 p-1 rounded-md flex`}>
                            <p>{option}</p>
                            <div id={`result-icon-${question.questionId}`} className="my-auto flex ml-auto">
                                { ( answers[questionId]==option[0] )? icon : "" }
                            </div>
                        </div>
                    ))
                }
            </div>
            <div id={`answer-explanation-${question.questionId}`} className={`${additionalStyles["AnswerDiv"]}`}>
                <div> {" "} <b className={` ${additionalStyles["Answer"]} `}>Answer:</b>{" "}
                    {(isSubmitted)? solutions[questionId-1].answer : ""}
                </div>
                <div> {" "} <b className={` ${additionalStyles["Answer"]} `}>Explanation:</b>{" "}
                    {(isSubmitted)? solutions[questionId-1].explanation : ""}
                </div>
            </div>
        </div>
    )
}

function QuestionStatements(data, question, answerQuestion){
    const isSubmitted = data.isSubmitted;
    const answers = data.answers;
    const solutions = data.solutions;
    const questionId = question.questionId
    const type = question.type;
    const subject = question.subject;

    var additionalStyles = {
        A: [],
        B: [],
        C: [],
        D: [],
        Answer: [],
        Explanation: [],
        AnswerDiv: [],
    };
    additionalStyles["AnswerDiv"] = "hidden";

    var reviewButton;
    if(!isSubmitted){
        var reviewStatus = <Icon name={'CheckSquare'} color={'black'} />;
        var reviewFlag = true;
        if(data.review[questionId] == true){
            reviewStatus = <Icon name={'CheckSquare'} color={'violet'} />;
            var reviewFlag = false;
        }
        reviewButton = <button onClick={() => data.markAsReview(questionId, reviewFlag)}>{ reviewStatus }</button>;
    }
    
    var icon;
    if(isSubmitted && answers[questionId]!= null){
        additionalStyles["AnswerDiv"] = "";
        if(answers[questionId] == solutions[questionId-1].answer[0]){
            additionalStyles[answers[questionId]].push("border-2 border-green-500");
            additionalStyles["Answer"].push("text-green-500");
        }else{
            additionalStyles[answers[questionId]].push("border-2 border-red-500");
            additionalStyles["Answer"].push("text-red-500");
        }
        icon = (answers[questionId] == solutions[questionId-1].answer[0])? <Icon name={'CheckCircle2'} color={'green'} size={'15'}/> : <Icon name={'XCircle'} color={'red'} size={'15'}/>;
    }else if(isSubmitted){
        additionalStyles["AnswerDiv"] = "";
        additionalStyles[solutions[questionId-1].answer[0]].push("border-2 border-black");
    }else if(answers[questionId] != null){
        const style = (reviewFlag)? "border-2 border-green-500" : "border-2 border-purple-500";
        additionalStyles[answers[questionId]].push(style);
    }
    
    return(
        <>
            <div>
                <div className=" text-right">
                    { reviewButton }
                </div>
                <div className="font-semibold">
                    { questionId }. {question.question}
                </div>
                <div className="mx-2 mt-2 border-2 rounded-md border-black p-2">
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
                        question.options.map((option) => (
                            <div onClick={ () => (!isSubmitted)? answerQuestion(question.questionId, option[0], type, subject) : "" } className={`${ additionalStyles[option[0]] } border-2 border-grey-700 p-1 rounded-md flex`}>
                                <p>{option}</p>
                                <div id={`result-icon-${question.questionId}`} className="my-auto flex ml-auto">
                                    { ( answers[questionId]==option[0] )? icon : "" }
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div id={`answer-explanation-${question.questionId}`} className={`${additionalStyles["AnswerDiv"]}`}>
                    <div> {" "} <b className={` ${additionalStyles["Answer"]} `}>Answer:</b>{" "}
                        {(isSubmitted)? solutions[questionId-1].answer : ""}
                    </div>
                    <div> {" "} <b className={` ${additionalStyles["Answer"]} `}>Explanation:</b>{" "}
                        {(isSubmitted)? solutions[questionId-1].explanation : ""}
                    </div>
                </div>
            </div>
        </>
    )
}

function QuestionList(data, question, answerQuestion){
    const isSubmitted = data.isSubmitted;
    const answers = data.answers;
    const solutions = data.solutions;
    const questionId = question.questionId
    const type = question.type;
    const subject = question.subject;

    var additionalStyles = {
        A: [],
        B: [],
        C: [],
        D: [],
        Answer: [],
        Explanation: [],
        AnswerDiv: [],
    };
    additionalStyles["AnswerDiv"] = "hidden";

    var reviewButton;
    if(!isSubmitted){
        var reviewStatus = <Icon name={'CheckSquare'} color={'black'} />;
        var reviewFlag = true;
        if(data.review[questionId] == true){
            reviewStatus = <Icon name={'CheckSquare'} color={'violet'} />;;
            var reviewFlag = false;
        }
        reviewButton = <button onClick={() => data.markAsReview(questionId, reviewFlag)}>{ reviewStatus }</button>;
    }
    
    var icon;
    if(isSubmitted && answers[questionId]!= null){
        additionalStyles["AnswerDiv"] = "";
        if(answers[questionId] == solutions[questionId-1].answer[0]){
            additionalStyles[answers[questionId]].push("border-2 border-green-500");
            additionalStyles["Answer"].push("text-green-500");
        }else{
            additionalStyles[answers[questionId]].push("border-2 border-red-500");
            additionalStyles["Answer"].push("text-red-500");
        }
        icon = (answers[questionId] == solutions[questionId-1].answer[0])? <Icon name={'CheckCircle2'} color={'green'} size={'15'}/> : <Icon name={'XCircle'} color={'red'} size={'15'}/>;
    }else if(isSubmitted){
        additionalStyles["AnswerDiv"] = "";
        additionalStyles[solutions[questionId-1].answer[0]].push("border-2 border-black");
    }else if(answers[questionId] != null){
        const style = (reviewFlag)? "border-2 border-green-500" : "border-2 border-purple-500";
        additionalStyles[answers[questionId]].push(style);
    }

    return(
        <div>
            <div className=" text-right">
                { reviewButton }
            </div>
            <div className="font-semibold">
                { questionId }. { question.question }
            </div>
            <div className="flex flex-col space-x-2 mt-2 border-2 rounded-md border-black p-2">
                <div className="flex">
                    <div className="w-[50%]  ml-1 font-semibold">
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
                        <div onClick={ () => (!isSubmitted)? answerQuestion(questionId, option[0], type, subject) : "" } className={`${ additionalStyles[option[0]] } border-2 border-grey-700 p-1 rounded-md flex`}>
                            <p>{option}</p>
                            <div id={`result-icon-${question.questionId}`} className="my-auto flex ml-auto">
                                { ( answers[questionId]==option[0] )? icon : "" }
                            </div>
                        </div>
                    ))
                }
            </div>
            <div id={`answer-explanation-${question.questionId}` } className={`${additionalStyles["AnswerDiv"]}`}>
                <div>
                    <b className={` ${additionalStyles["Answer"]} `}>Answer:</b>{" "}
                    {(isSubmitted)? solutions[questionId-1].answer : ""}
                </div>
                <div>
                    <b className={` ${additionalStyles["Answer"]} `}>Explanation:</b>{" "}
                    {(isSubmitted)? solutions[questionId-1].explanation : ""}
                </div>
            </div>
        </div>
    )
}

function QuestionChronology(data, question, answerQuestion){
    const isSubmitted = data.isSubmitted;
    const answers = data.answers;
    const solutions = data.solutions;
    const questionId = question.questionId
    const type = question.type;
    const subject = question.subject;

    var additionalStyles = {
        A: [],
        B: [],
        C: [],
        D: [],
        Answer: [],
        Explanation: [],
        AnswerDiv: [],
    };
    additionalStyles["AnswerDiv"] = "hidden";

    var reviewButton;
    if(!isSubmitted){
        var reviewStatus = <Icon name={'CheckSquare'} color={'black'} />;
        var reviewFlag = true;
        if(data.review[questionId] == true){
            reviewStatus = <Icon name={'CheckSquare'} color={'violet'} />;;
            var reviewFlag = false;
        }
        reviewButton = <button onClick={() => data.markAsReview(questionId, reviewFlag)}>{ reviewStatus }</button>;
    }
    
    var icon;
    if(isSubmitted && answers[questionId]!= null){
        additionalStyles["AnswerDiv"] = "";
        if(answers[questionId] == solutions[questionId-1].answer[0]){
            additionalStyles[answers[questionId]].push("border-2 border-green-500");
            additionalStyles["Answer"].push("text-green-500");
        }else{
            additionalStyles[answers[questionId]].push("border-2 border-red-500");
            additionalStyles["Answer"].push("text-red-500");
        }
        icon = (answers[questionId] == solutions[questionId-1].answer[0])? <Icon name={'CheckCircle2'} color={'green'} size={'15'}/> : <Icon name={'XCircle'} color={'red'} size={'15'}/>;
    }else if(isSubmitted){
        additionalStyles["AnswerDiv"] = "";
        additionalStyles[solutions[questionId-1].answer[0]].push("border-2 border-black");
    }else if(answers[questionId] != null){
        const style = (reviewFlag)? "border-2 border-green-500" : "border-2 border-purple-500";
        additionalStyles[answers[questionId]].push(style);
    }

    return(
        <div>
            <div className=" text-right">
                { reviewButton }
            </div>
            <div className="font-semibold">
                { questionId }. {question.question}
            </div>
            <div className="mt-2 mx-2 border-2 rounded-md border-black p-2">
                {question.items.map((item) => (
                    <div>
                        {item}
                    </div>
                ))}
            </div>
            <div className="m-4 space-y-2">
                {
                    question.options.map((option, index) => (
                        <div onClick={ () => (!isSubmitted)? answerQuestion(question.questionId, option[0], type, subject) : "" } className={`${ additionalStyles[option[0]] } border-2 border-grey-700 p-1 rounded-md flex`}>
                            <p>{option}</p>
                            <div id={`result-icon-${question.questionId}`} className="my-auto flex ml-auto">
                                { ( answers[questionId]==option[0] )? icon : "" }
                            </div>
                        </div>
                    ))
                }
            </div>
            <div id={`answer-explanation-${question.questionId}` } className={`${additionalStyles["AnswerDiv"]}`}>
                <div>
                    <b className={` ${additionalStyles["Answer"]} `}>Answer:</b>{" "}
                    {(isSubmitted)? solutions[questionId-1].answer : ""}
                </div>
                <div>
                    <b className={` ${additionalStyles["Answer"]} `}>Explanation:</b>{" "}
                    {(isSubmitted)? solutions[questionId-1].explanation : ""}
                </div>
            </div>
        </div>
    );
}