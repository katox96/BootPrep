import React from 'react';

export default function TestStats({ data }){

    if(!data.isSubmitted){
        return (
            <></>
        );
    }

    const testId = data.testId;
    const answers = data.answers;
    const solutions = data.solutions;
    const testPaper = data.testPaper;

    const subjectsDict = {
        "Political Science": "Political Science",
    };
    const subjectTotalQuest = {
        "Political Science": 0
    }
    const subjectTotalCorrectQuest = {
        "Political Science": 0
    }
    const subjectTotalIncorrectQuest = {
        "Political Science": 0
    }
    

    var correct = 0, inCorrect = 0, attempted = 0, marks = 0;
    for(let i=0;i<=99;i++){
        subjectTotalQuest[testPaper[i].subject]++;
        if(answers[i+1] == null){
            continue;
        }else if(answers[i+1] == solutions[i].answer[0]){
            correct++;
            subjectTotalCorrectQuest[testPaper[i].subject]++;
        }else{
            inCorrect++;
            subjectTotalIncorrectQuest[testPaper[i].subject]++;
        }
    }

    attempted = (correct + inCorrect);
    marks = (2 * correct) - (0.66 * inCorrect);
    marks = marks.toFixed(2)
     const subjectStats = []
    for (const shortName in subjectsDict) {
        subjectStats.push(
            <table>
                <thead>
                    <tr><th colSpan={2}>{subjectsDict[shortName]}</th></tr>
                </thead>
                <tbody>
                    <tr><td>Total Questions:</td><td>{subjectTotalQuest[shortName]}</td></tr>
                    <tr><td>Attempted:</td><td>{subjectTotalCorrectQuest[shortName] + subjectTotalIncorrectQuest[shortName]}</td></tr>
                    <tr><td>Correct:</td><td>{subjectTotalCorrectQuest[shortName]}</td></tr>
                    <tr><td>Incorrect:</td><td>{subjectTotalIncorrectQuest[shortName]}</td></tr>
                </tbody>
            </table>
        )
    }

    async function  resetTest(){
        const choice = confirm("Are you sure you want to reset the test? All the progress made will be ereased!");
        if(choice){
            const response = await fetch('/api/testPaper/resetTest?testId=' + testId);
            const data = await response.json();
            if(data.status){
                window.location.href = "/profile";
            }else{
                alert("Failed reseting the test. Please try again!");
            }
        }
    }

    return (
        <div className="mt-6 border border-1 border-grey-500 p-4 rounded-lg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]">
            <p className=" font-bold">Test Stats:</p>
            <div className="ml-2">
                <p>Attempted : {attempted}</p>
                <p>Correct : {correct}</p>
                <p>Incorrect : {inCorrect}</p>
                <p>Marks : {marks}</p>
            </div>
            <button id="reset-test-button" onClick={() => resetTest()} className='mt-4 border border-black bg-red-500 rounded-md px-2 py-1 hover:shadow-xl'>Re-Solve</button>
        </div>
    );
}