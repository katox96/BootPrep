import { useState } from "react";
import Icon from '@/components/icons/icons'


export default function DemoQuiz({ demoQuestions }) {
    const totalQuestions = demoQuestions.length;
    const [solvedQuestions, setSolvedQuestions] = useState(Array(totalQuestions+1).fill(null));
    const [currentQuestion, setCurrentQuestion] = useState(1);

    function changeQuestion(questionNo, delta) {
        var newQuestion = (questionNo + delta == 0)? totalQuestions : questionNo + delta ;
        if(newQuestion > totalQuestions){
            newQuestion = (newQuestion % totalQuestions);
        }
        setCurrentQuestion(newQuestion);
    }

    function solveQuestion(questionNo, answer){
        if(solvedQuestions[questionNo] != null){
            $('#result-icon-'+solvedQuestions[questionNo].selected+'-'+questionNo+'-true').hide();
            $('#result-icon-'+solvedQuestions[questionNo].selected+'-'+questionNo+'-false').hide();
        }
        const newSolvedQuestions = solvedQuestions.slice();
        const isCorrect = (answer == demoQuestions[questionNo-1].Answer[0]);
        if(isCorrect){
            $('#result-icon-'+answer+'-'+questionNo+'-true').show();
        }else{
            $('#result-icon-'+answer+'-'+questionNo+'-false').show();
        }
        newSolvedQuestions[questionNo] = { 
            selected: answer,
            isCorrect: isCorrect
        };
        setSolvedQuestions(newSolvedQuestions);
        setCurrentQuestion(questionNo);
    }

    return(
        <>
            {
                demoQuestions.map((question, index) =>  {
                        const i = index + 1;
                        var additionalStyles = {
                            'A': [],
                            'B': [],
                            'C': [],
                            'D': [],
                            'Answer': [],
                            'Explanation': [],
                        };
                        var hideAnswer = "hidden";

                        if(solvedQuestions[i] != null){
                            hideAnswer = "block";
                            if(solvedQuestions[i].isCorrect){
                                additionalStyles[solvedQuestions[i].selected].push("border-2 border-green-500");
                                additionalStyles['Answer'].push("text-green-500");
                            }else{
                                additionalStyles[solvedQuestions[i].selected].push("border-2 border-red-500");
                                additionalStyles['Answer'].push("text-red-500");
                            }
                        }

                        return(
                            <div className=" max-w-2xl" id={`question_${ i }`} style={ ( i != currentQuestion )? { display: 'none' } : {} }>
                                <div className="bg-white p-3 border shadow rounded-md">
                                <div className="flex items-center pb-3">
                                    <div onClick={() => changeQuestion(i, -1)} className=" shadow-md border-2 rounded-lg px-[8px] py-1 text-black  bg-white cursor-pointer">
                                        <Icon name={'ChevronLeft'} color={'black'} size={'20'}></Icon>
                                    </div>
                                    <div className="hidden ml-auto text-2xl font-bold">
                                        <p>Demo Quiz</p>
                                    </div>
                                    <div onClick={() => changeQuestion(i, 1)} className=" shadow-md border-2 ml-auto rounded-lg  px-[8px] py-1 1 text-black bg-white cursor-pointer">
                                        <Icon name={'ChevronRight'} color={'black'} size={'20'}></Icon>
                                    </div>
                                </div>
                                    <div className="m-4 mb-1">{ question.Question }</div>
                                    <div className="py-2">
                                        <div onClick={() => solveQuestion(i, 'A')}  className={` ${ additionalStyles['A'] } flex cursor-pointer leading-2 text-sm border border-1 rounded-md px-3 py-1 text-md text-slate-700 m-2 bg-white`}>
                                            <p>
                                                A) { question["A)"] }
                                            </p>
                                            <div id={`result-icon-A-${i}`} className="my-auto flex ml-auto">
                                                <div id={`result-icon-A-${i}-true`} className="hidden">
                                                    <Icon name={'CheckCircle2'} color={'green'} size={'15'}/>
                                                </div>
                                                <div id={`result-icon-A-${i}-false`} className="hidden">
                                                    <Icon name={'XCircle'} color={'red'} size={'15'}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div onClick={() => solveQuestion(i, 'B')}  className={` ${ additionalStyles['B'] } flex cursor-pointer leading-2 text-sm border border-1 rounded-md px-3 py-1 text-md text-slate-700 m-2 bg-white`}>
                                            <p>
                                                B) { question["B)"] }
                                            </p>
                                            <div id={`result-icon-B-${i}`} className="my-auto flex ml-auto">
                                                <div id={`result-icon-B-${i}-true`} className="hidden">
                                                    <Icon name={'CheckCircle2'} color={'green'} size={'15'}/>
                                                </div>
                                                <div id={`result-icon-B-${i}-false`} className="hidden">
                                                    <Icon name={'XCircle'} color={'red'} size={'15'}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div onClick={() => solveQuestion(i, 'C')}  className={` ${ additionalStyles['C'] } flex cursor-pointer leading-2 text-sm border border-1 rounded-md px-3 py-1 text-md text-slate-700 m-2 bg-white`}>
                                            <p>
                                                C) { question["C)"] }
                                            </p>
                                            <div id={`result-icon-C-${i}`} className="my-auto flex ml-auto">
                                                <div id={`result-icon-C-${i}-true`} className="hidden">
                                                    <Icon name={'CheckCircle2'} color={'green'} size={'15'}/>
                                                </div>
                                                <div id={`result-icon-C-${i}-false`} className="hidden">
                                                    <Icon name={'XCircle'} color={'red'} size={'15'}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div onClick={() => solveQuestion(i, 'D')}  className={`  ${ additionalStyles['D'] } flex cursor-pointer leading-2 text-sm border border-1 rounded-md px-3 py-1 text-md text-slate-700 m-2 bg-white`}>
                                            <p>
                                                D) { question["D)"] }
                                            </p>
                                            <div id={`result-icon-D-${i}`} className="my-auto flex ml-auto">
                                                <div id={`result-icon-D-${i}-true`} className="hidden">
                                                    <Icon name={'CheckCircle2'} color={'green'} size={'15'}/>
                                                </div>
                                                <div id={`result-icon-D-${i}-false`} className="hidden">
                                                    <Icon name={'XCircle'} color={'red'} size={'15'}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={` ${ hideAnswer } `}>
                                            <div className="text-sm px-3 pt-3"><b className={` ${ additionalStyles['Answer'] }`}>Answer:</b> { question["Answer"] }</div>
                                            <div className="px-3 pt-3 text-sm"><b>Explanation:</b> { question["Explanation"] }</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                )
            }
        </>
    );
}