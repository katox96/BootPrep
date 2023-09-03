import React from 'react';
import Icon from '@/components/icons/icons'



export const PracticeTestTable = ({ data }) => {
    const practiceTestsCount = 10;

    function generateTable(){
        var practiceTestCards = [];
        for(let i = 1; i <= practiceTestsCount; i++){
            practiceTestCards.push(
                <div key={i} className="shadow-md bg-white border-gray-900 rounded-md h-40 min-w-[150px]">
                    <div className=" text-white font-bold text-[17px] pt-2 pl-2 h-32 bg-center bg-[length:160px_130px] bg-[url('/icons/practiceTest.png')] rounded-t-md">
                        Test { i }
                    </div>
                    <div className="text-sm flex pt-1 ">
                        <div className="text-center w-[50%] flex">
                            {/* <Link href={`/testAttempt?testType=2&testId=${i}&withTimer=0`}> */}
                            {/* </Link> */}
                            <div className="mx-auto">
                                <Icon size={'20'} color={'gray'} name={'AlarmClockOff'}/>
                            </div>
                        </div>
                        <div className="text-center w-[50%] flex">
                            {/* <Link href={`/testAttempt?testType=2&testId=${i}&withTimer=1`}> */}
                            <div className="mx-auto">
                                <Icon size={'20'} color={'gray'} name={'AlarmClock'}/>
                            </div>
                            {/* </Link> */}
                        </div>
                    </div>
                </div>
            );
        }
        return practiceTestCards;
    }

    const PreviousYearTable = generateTable();

    return(
        <div className="mt-5 text-2xl">
            <div className="text-gray-600 font-semibold pb-2">
                Practice Tests
            </div>
            <div className="flex overflow-scroll scrollbar-none space-x-3 h-44">
                { PreviousYearTable }
            </div>
        </div>
    )
}