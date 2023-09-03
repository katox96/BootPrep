import React from 'react';
import { useRef, useState } from "react";
import Link from 'next/link';
import Icon from '@/components/icons/icons'

export const TestSeriesTable = ({ data }) => {

    const submittedTests = data.submittedTests;
    const [testData, setTestData] = useState(data.tests);
    const testsCount = data.testsCount;

    async function registerTest(testId){
        try{
            if(testId != null || testId != ""){
                const response = await fetch('/api/registerForTest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ testId })
                });
    
                if(!response.ok) throw new Error(`Error: ${response.status}`);
                const data = await response.json();
    
                if(data.status == true){
                    const newTestData = [...testData.slice(0, testData.length + 1), testId];
                    setTestData(newTestData);
                }else{
                    alert("Failed! Please try again!");
                }
            }
        } catch (e) {
            console.error('ERROR', e);
        }
    }

    function generateTable(){
        var registeredTestsTable = [];
        for(let i = 1; i <= testsCount; i++){
            if(testData.includes(i)){
    
                var leaderBoardLink = null;
                if(submittedTests.includes(i)){
                    leaderBoardLink = <Link key={`result-link-${i}`} href={`/leaderBoard?testId=${i}`}> Result </Link>;
                }
                
                registeredTestsTable.push(
                    <div key={i} className="shadow-xl bg-cover bg-[url('/icons/testImage.png')] border-gray-900 rounded-md p-2 h-32 min-w-[128px]">
                        <div className="bg-white">Test {i}</div>
                        <div>
                            <button disabled>Registered</button>
                        </div>
                        <div>
                            <Link key={`link-${i}`} href={`/testAttempt?testType=1&testId=${i}`}>
                                Open Test
                            </Link>
                        </div>
                        <div>
                            { leaderBoardLink }
                        </div>
                    </div>
                );
            }else{
                registeredTestsTable.push(
                    <div key={i} className="shadow-md border-gray-900 rounded-md h-40 min-w-[150px]">
                        <div className="h-32 bg-center bg-cover bg-[url('/icons/testSeries.png')] rounded-t-md">
                        </div>
                        <div className="text-sm bg-white rounded-b-md p-1 pb-2 text-center flex">
                            <div className='ml-auto text-gray-500'>
                                Test {i}
                            </div>
                            <div className='ml-auto py-1'>
                                <Icon className="ml-auto" size={'15'} color={'gray'} name={'Lock'}/>
                            </div>
                        </div>
                    </div>
                );
            }
        }
        return registeredTestsTable;
    }

    const registeredTestsTable = generateTable();

    return(
        <>
            <div className="text-2xl">
                <div>
                    <p className="text-sm my-auto text-green-400">
                        Upcoming
                    </p>
                </div>
                <div className="text-gray-600 font-semibold">
                    Test Series
                </div>
            </div>
            <div className="flex overflow-scroll scrollbar-none space-x-3 h-44 pt-2">
                { registeredTestsTable }
            </div>
        </>
    )
}