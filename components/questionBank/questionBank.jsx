import { useEffect, useState } from 'react';
import Question from './question';
import Buttons from './buttons';
import { Filters } from './filters';

export default function QuestionBank(){

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setpageSize] = useState(5);
    const [subject, setSubject] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [choice, setChoice] = useState('');
    const [questions, setQuestions] = useState(null);
    const [totalQuestions, setTotalQuestions] = useState(0);
    var totalPages = 0;
  
    async function getQuestionsFromBank() {
        const filter = new URLSearchParams();
        filter.append('pageNo', pageNo);
        filter.append('pageSize', pageSize);
        filter.append('subject', subject);
        filter.append('type', type);
        filter.append('status', status);
        filter.append('choice', choice);
    
        const response = await fetch('/api/questionBank/getQuestions?' + filter.toString());
        const data = await response.json();
        var newTotalQuestions = data[data.length-1].totalQuestions;
        var filteredData = data.filter(function(obj) {
            return obj.question !== undefined;
        });
        setQuestions(filteredData);
        setTotalQuestions(newTotalQuestions);
    }

    async function solveQuestion(questionId, selectedOption, answer, subject, type){
        for (let i = 0; i < questions.length; i++) {
            if(questions[i].questionId == questionId && questions[i].selectedOption != null){
                return;
            }
        }

        const isCorrect = selectedOption == answer[0];
        $("#reset-button-"+questionId).show();
        if(isCorrect){
            $('#result-icon-'+selectedOption+'-'+questionId+'-true').show();
            $('#question-'+questionId+'-option-'+selectedOption).addClass("border-2 border-green-500");
        }else{
            $('#result-icon-'+selectedOption+'-'+questionId+'-false').show();
            $('#question-'+questionId+'-option-'+selectedOption).addClass("border-2 border-red-500");
        }
        const response = await fetch('/api/questionBank/solveQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questionId: questionId,
                selectedOption: selectedOption,
                isCorrect: isCorrect,
                subject: subject,
                type: type
            })
        });

        if(!response.ok){
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();

        if(data.status){
            const newQuestions = questions.slice();
            let j = 0;
            for (let i = 0; i < newQuestions.length; i++) {
                if (newQuestions[i].questionId === questionId) {
                    newQuestions[i].selectedOption = selectedOption;
                    newQuestions[i].isCorrect = isCorrect;
                    j=i;
                    break;
                }
            }
            $("#answer-explanation-"+questionId).show();
            setQuestions(newQuestions);
        }else{
            $('#question-'+questionId+'-option-'+selectedOption).removeClass("border-red-500 border-green-500");
            $('#result-icon-'+selectedOption+'-'+questionId+'-true').hide();
            $('#result-icon-'+selectedOption+'-'+questionId+'-false').hide();
            $("#answer-explanation-"+questionId).hide();
            $("#reset-button-"+questionId).hide();
        }
    }

    async function updateQuestionStatus(questionId, operationId){
        const response = await fetch('/api/questionBank/updateQuestionStatus?questionId=' + questionId + "&operationId=" + operationId);

        if(!response.ok){
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if(data.status){
            const newQuestions = questions.slice();
            for (let i = 0; i < newQuestions.length; i++) {
                if (newQuestions[i].questionId === questionId) {
                    if(operationId == 1){
                        newQuestions[i].likedByMe = true;
                        newQuestions[i].dislikedByMe = false;
                    }else if(operationId == 2){
                        newQuestions[i].likedByMe = false;
                        newQuestions[i].dislikedByMe = true;
                    }else if(operationId == 3){
                        $('#result-icon-'+newQuestions[i].selectedOption+'-'+questionId+'-true').hide();
                        $('#result-icon-'+newQuestions[i].selectedOption+'-'+questionId+'-false').hide();
                        delete newQuestions[i].selectedOption;
                        delete newQuestions[i].isCorrect;
                        $("#answer-explanation-"+questionId).hide();
                    }else if(operationId == 4){
                        newQuestions[i].likedByMe = false;
                    }else if(operationId == 5){
                        newQuestions[i].dislikedByMe = false;
                    }
                    break;
                }
            }
            setQuestions(newQuestions);
        }
    }

    function clearFilter(filterName){
        if(filterName == "subject")
            setSubject("");
        else if(filterName == "type")
            setType("");
        else if(filterName == "status")
            setStatus("");
        else if(filterName == "choice")
            setChoice("");
    }

    function setTypeValue(value){
        setType(value);
        setPageNo(1);
    }

    const filters = {
        subject,
        type,
        status,
        choice,
        clearFilter
    }

    var pageSelectListItems = [];

    function calculateTotalPages(){
        totalPages = (totalQuestions % pageSize == 0)? Math.floor(totalQuestions/pageSize): Math.floor(totalQuestions/pageSize) + 1;
        console.log(totalPages);
    }
    calculateTotalPages();
    console.log(pageNo);
    useEffect(() => {
        getQuestionsFromBank();
    }, [subject, type, status, choice, pageSize, pageNo]);

    var currentPage = pageNo;
    const prevButton = ( pageNo == 1 )? <button className="shadow-md bg-gray-300 border cursor-default p-1 border-gray-500 rounded-md">prev</button> : <button className="border p-1 bg-white border-gray-500 rounded-md" onClick={() => setPageNo(currentPage - 1)}>prev</button>;

    const nextButton = ( pageNo == totalPages )? <button className="shadow-md bg-gray-300 border cursor-default border-gray-500 p-1 rounded-md">next</button> : <button className="border p-1 bg-white border-gray-500 rounded-md" onClick={() => setPageNo(currentPage + 1)}>next</button>;

    return(
        <div className="my-4">
            <hr className="mt-8"></hr>
            <h2 className="mt-3 text-2xl text-gray-600 font-semibold">
                Question Bank
            </h2>
            <div className="py-4 space-x-2">
                <div className="hidden">
                    <label>Page No</label>
                    <select className="border border-1 border-slate-400 w-10 rounded-md" name="pageNo" id="pageNo" value={pageNo} onChange={(e) => setPageNo(e.target.value)}>
                        {pageSelectListItems}
                    </select>
                </div>
                

                <div className="flex">
                    <div className="w-[50%] m-1">
                        <select className="p-2 w-[100%] text-gray-700 text-sm rounded-md" name="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
                            <option value="">Subject</option>
                            <option value="Political Science">Political Science</option>
                            <option value="Environment">Environment</option>
                            <option value="History">History</option>
                            <option value="Economics">Economics</option>
                            <option value="Geography">Geography</option>
                            <option value="Himachal GK">Himachal GK</option>
                            <option value="HP Economic Survey">HP Economic Survey</option>
                            <option value="Science">Science</option>
                            <option value="General Knowledge">General Knowledge</option>
                        </select>
                    </div>

                    <div className="w-[50%] m-1">
                        <select className="p-2 w-[100%] text-gray-700 text-sm rounded-md" name="type" value={type} onChange={(e) => setTypeValue(e.target.value)}>
                            <option value="">Type</option>
                            <option value="MCQ">MCQ</option>
                            <option value="statements">Statements</option>
                            <option value="list">List</option>
                            <option value="chronology">Chronology</option>
                        </select>
                    </div>
                </div>

                <div className="flex">
                    <div className="w-[50%] m-1">
                        <select className="p-2 w-[100%]  text-gray-700 text-sm rounded-md" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">Status</option>
                            <option value="Unsolved">Unsolved</option>
                            <option value="Solved">Solved</option>
                            <option value="Correct">Solved(Correct)</option>
                            <option value="Wrong">Solved(Incorrect)</option>
                        </select>
                    </div>

                    <div className="w-[50%] m-1">
                        <select className="p-2 w-[100%] text-gray-700 text-sm rounded-md" name="choice" value={choice} onChange={(e) => setChoice(e.target.value)}>
                            <option value="">Choice</option>
                            <option value="Liked">Liked</option>
                            <option value="Disliked">Disliked</option>
                        </select>
                    </div>
                </div>
            </div>
            <Filters filters={ filters }></Filters>
            <div id="result">
                {
                    questions != null && (
                        questions.map((question) => (
                            <div key={question.questionId} className="my-2 p-4 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] rounded-xl">
                                <Buttons question={question} updateQuestionStatus={updateQuestionStatus}></Buttons>
                                <Question question={question} solveQuestion={solveQuestion}></Question>
                            </div>
                        ))
                    )
                }
                <div className="mt-4 pb-4 flex">
                    <div className="space-x-2 my-auto">
                        <label className="text-sm">Page Size</label>
                        <select className="p-1 text-gray-700 border border-gray-600 text-sm rounded-md" name="pageSize" value={pageSize} onChange={(e) => setpageSize(e.target.value)}>
                            <option value="1">1</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div className="ml-auto flex space-x-1">
                        <div>
                            { prevButton }
                        </div>
                        <div>
                            { nextButton }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}