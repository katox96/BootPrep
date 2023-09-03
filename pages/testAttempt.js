import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useRef } from "react";
import { useState } from "react";
import clientPromise from "../lib/mongodb";
import { getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { QuestionPaper } from '@/components/questionPaper/questionPaper';
import { isRegestered } from '@/lib/basicChecks';
import { Header } from "@/components/profile/header";
import Image from 'next/image';


export default function TestAttempt({ data }){

    if(data.alertMessage != ""){
        return(
            <h1>{ data.alertMessage }</h1>
        );
    }

    const overlay = useRef();
    const overlayParent = useRef();
    const [answers, setAnswers] = useState(data.solvedPaper);
    const [review, setReview] = useState(data.questionsForReview);
    const [isSubmitted, setIsSubmitted] = useState(data.isSubmitted);
    const testType = parseInt(data.testType);
    const testId = parseInt(data.testId);
    const withTimer = parseInt(data.withTimer);
    const startTime = data.startTime;

    const questionPaperProp =   {
        testId: testId,
        testType: testType,
        testPaper: data.testPaper,
        answers: answers,
        solutions: data.solutions,
        isSubmitted: isSubmitted,
        review: review,
        startTime: startTime,
        currentTime: data.currentTime,
        markAsReview: markAsReview
    };

    function openOverlay()  {
        overlay.current.style.display = 'block';
        overlayParent.current.style.display = 'block';
        $('html, body').css({
            overflow: 'hidden',
            height: '100%'
        });
    }

    function closeOverlay()  {
        overlay.current.style.display = 'none';
        overlayParent.current.style.display = 'none';
        $('html, body').css({
            overflow: 'auto',
            height: 'auto'
        });
    }

    async function submitTest(){

        for(let i = 1 ; i < answers.length ; i++){
            if(answers[i] == null){
                const choice = confirm("All the questions are not solved! Are you sure, you want to submit ?");
                if(!choice) return;
                break;
            }
        }

        const payload = {  
            testId: testId,
            testType: testType
        };

        const response = await fetch('/api/submitTest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if(!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();

        if(data.status == true){
            alert("Test submitted");
            window.location.href = "/profile";
        }else{
            alert("Error occured! Please try again.");
        }
    }

    async function answerQuestion(questionId, selectedOption, questionType, subject){
        if(answers[questionId] == selectedOption){
            selectedOption = null;
        }

        const payload = { 
            testId: testId,
            testType: testType,
            questionId: questionId, 
            selectedOption: selectedOption, 
            questionType: questionType, 
            subject: subject
        };

        const newAnswers = answers.slice();
        newAnswers[questionId] = selectedOption;
        setAnswers(newAnswers);
        await markAsReview(questionId, false);
        const response = await fetch('/api/testPaper/checkTest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if(!response.ok){
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();

        if(!data.status){
            const newAnswers = answers.slice();
            newAnswers[questionId] = null;
            setAnswers(newAnswers);
        }
    }

    async function markAsReview(questionId, reviewFlag){
        const payload = { 
            testId: testId, 
            testType: testType,
            questionId: questionId, 
            reviewFlag: reviewFlag 
        };

        const response = await fetch('/api/markForReview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if(!response.ok) throw new Error(`Error: ${response.status}`);
        
        const data = await response.json();

        if(data.status == true){
            const newReview = review.slice();
            newReview[questionId] = reviewFlag;
            setReview(newReview);
        }
    }

    var mapTable = [];
    for(let i=0;i<=11;i++){
        var row = [];
        for(let j=(9*i)+1;j<=Math.min((9*i)+9, 100);j++){
            var color = "pending";
            if(review[j] == true){
                color = "marked";
            }else if(answers[j] != null){
                color = "answered";
            }
            
            row.push(
                <td>
                    <Link href={`testAttempt?testType=${testType}&testId=${testId}&withTimer=${withTimer}#questionId${j}`} className={color}>
                        <div className="m-2">
                            <p className="text-lg">
                                {j}
                            </p>
                        </div>
                    </Link>
                </td>
            );
        }
        mapTable.push(
            <tr>
                {row}
            </tr>
        );
    }

    return (
        <>
            <Header></Header>
            <div id="main-div" className="container">
                <div id={"overlay-parent"} ref={overlayParent} onClick={closeOverlay}>
                    <div id={"overlay"} ref={overlay} className="shadow-md p-3 border-2 border-black rounded-md overflow-scroll">
                        <table>
                            <tbody>
                                { mapTable }
                            </tbody>
                        </table>
                    </div>
                </div>
                <Image id="mapButton" onClick={ () => openOverlay()}  width={40} height={40}  className={ 'sticky-map-button' } src="/icons/map1.png"></Image>
                <QuestionPaper data={questionPaperProp} answerQuestion={ answerQuestion }></QuestionPaper>
                <div className="my-3 content-center">
                    <p id="submit-button" className="mx-auto w-[30%] cursor-pointer text-xl p-3 bg-blue-500 rounded-md text-white text-center" onClick={() => submitTest()}>
                        Submit
                    </p>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {

    // Question Paper
    // idx 0,  id 1
    // Solved Paper
    // idx 1, id 1
    // Answers
    // idx 1, id 1
    // Solutions Paper
    // idx 0, id 1

    var propObj = {
        data: {
            testId: 0,
            testType: 0,
            startTime: Math.floor(Date.now() / 1000) + 5,
            currentTime: 0,
            testPaper: [],
            solvedPaper: [],
            registered: false,
            isSubmitted: false,
            solutions: [],
            questionsForReview: [],
            testType: 0,
            alertMessage: ""
        }
    };

    try{
        const session = await getServerSession(context.req, context.res, authOptions);
    
        if(session){
            const testType = parseInt(context.query.testType);
            var testId = parseInt(context.query.testId);
            const email = session.user.email;
            const client = await clientPromise;
            const withTimer = parseInt(context.query.withTimer);
            var startTime = 0;

            if(testId == null || testId == ""){
                return { 
                    props: {
                        alertMessage: "Invalid Test!" 
                    }
                };
            }

            var testPath = "";
            if(testType == 1){
                // Test Series Test.
                const registered = await isRegestered(email, testId);
                if(registered){
                    testPath = "data/testSeries/tests/";
                }

                if(testPath == ""){

                    return {
                        props: {
                            data : {
                                alertMessage: "You have not registered for this test!"
                            }
                        }
                    }
                }
            }else if(testType == 2){
                testPath = "data/previousYears/tests/";
            } if(testType == 3){
                testPath = "data/practiceTests/tests/";
            }

            const testPaper = fs.readFileSync(path.join(process.cwd(), testPath, 'test' + testId + '.json'));
            //const testPaper = fs.readFileSync(path.join(process.cwd(), testPath, 'test1.json'));

            const testHistoryFilter = { 
                email: email,
                testId: testId,
                testType: testType
            }

            const testHistoryFromDB = await client
            .db("userData")
            .collection("testHistory")
            .find(testHistoryFilter)
            .toArray();

            if(testHistoryFromDB.length == 0){

                var epochTimestampInSeconds = 0;
                if(withTimer == 1){
                    epochTimestampInSeconds = Math.floor(Date.now() / 1000) + 5;
                }
                startTime = epochTimestampInSeconds;

                const testHistObj = {
                    email: email,
                    startTime: epochTimestampInSeconds,
                    testType: testType,
                    testId: testId,
                    isSubmitted: false,
                    history: [],
                    questionsForReview: []
                };

                await client
                .db("userData")
                .collection("testHistory")
                .insertOne(testHistObj);
            }
            
            var solvedPaperArray = [], solvedPaper = new Array(101).fill(null);
            var questionsForReview = new Array(101).fill(false);
            var solutions = [];
            var isSubmitted = false;

            if(testHistoryFromDB.length > 0){
                startTime = testHistoryFromDB[0]?.startTime;
                solvedPaperArray = testHistoryFromDB[0]?.history;
                const questionsForReviewFormDB = testHistoryFromDB[0]?.questionsForReview;

                for(let i=0; i<solvedPaperArray?.length;i++){

                    solvedPaper[solvedPaperArray[i].questionId] = solvedPaperArray[i].selectedOption;
                }
                for(let i=0; i<questionsForReviewFormDB.length;i++){

                    if(testId == questionsForReviewFormDB[i].testId){

                        questionsForReview[questionsForReviewFormDB[i].questionNo] = true;
                    }
                }

                isSubmitted = testHistoryFromDB[0].isSubmitted;
                if(isSubmitted){
    
                    solutions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/previousYears/solutions/', 'solutions' + testId + '.json')));
                    //solutions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/testSeries/solutions/', 'solutions1.json')));
                }
            }

            propObj.data.testId = testId;
            propObj.data.testType = testType;
            propObj.data.testPaper = JSON.parse(testPaper);
            propObj.data.solvedPaper = solvedPaper;
            propObj.data.registered = true;
            propObj.data.isSubmitted = isSubmitted;
            propObj.data.solutions = solutions;
            propObj.data.questionsForReview = questionsForReview;
            propObj.data.testType = testType;
            propObj.data.withTimer = withTimer;
            propObj.data.startTime = startTime;
            propObj.data.currentTime = Math.floor(Date.now() / 1000);

            return { 
                props: propObj
            };
        }
        return { props: { 
            data : {
                alertMessage : "Please Sign-In!!"
            }
        }};
    }
    catch (e){

        console.error(e);
        return { props: { 
            data : {
                alertMessage : "Something went wrong!"
            }
        }};
    }
}