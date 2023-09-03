import Link from 'next/link';
import Icon from '@/components/icons/icons'

const PreviousYearTable = ({ data }) => {
    const previousYearCount = 7;
    const submittedTests = data.submittedTests.filter(obj => obj.testType === 2);
    const ongogingTests = data.ongoingTests.filter(obj => obj.testType === 2);

    function openTest(testId, withTimer = 0){
        window.location.href = "/testAttempt?testType=2&testId=" + testId + "&withTimer=" + withTimer;
    }

    function generateTable(){
        var PreviousYearTable = [];
        var buttonsDiv
        for(let i = 1; i <= previousYearCount; i++){

            if(submittedTests.some(obj => obj.testId === i)){
                buttonsDiv = <div className="text-sm flex pt-1">
                                <button onClick={ () => openTest(`${i}`)} className="w-[100%] flex">
                                    <div className="mx-auto">
                                        <Icon size={'20'} name={'ClipboardList'} color={'green'}/>
                                    </div>
                                </button>
                            </div>
            }else if(ongogingTests.some(obj => obj.testId === i)){
                buttonsDiv = <div className="text-sm flex pt-1">
                                <button onClick={ () => openTest(`${i}`)} className="w-[100%] flex">
                                    <div className="mx-auto">
                                        <Icon size={'20'} name={'PlayCircle'} color={'green'}/>
                                    </div>
                                </button>
                            </div>
            }else{
                buttonsDiv = <div className="text-sm flex pt-1">
                                <button onClick={ () => openTest(`${i}`, 0)} className="w-[100%] flex">
                                    <div className="mx-auto">
                                        <Icon size={'20'} name={'AlarmClockOff'} color={'black'}/>
                                    </div>
                                </button>
                                <button onClick={ () => openTest(`${i}`, 1)} className="w-[100%] flex">
                                    <div className="mx-auto">
                                        <Icon size={'20'} name={'AlarmClock'} color={'red'}/>
                                    </div>
                                </button>
                            </div>
            }

            PreviousYearTable.push(
                <div key={i} className="shadow-md bg-white border-gray-900 rounded-md h-40 min-w-[150px]">
                    <div onClick={ () => openTest(`${i}`, 0)} className=" text-white font-bold pt-2 pl-2 h-32 bg-center bg-[length:150px_130px] bg-[url('/icons/previousYear.png')] rounded-t-md">
                        { 2023-i }
                    </div>
                    { buttonsDiv }
                </div>
            );
        }
        return PreviousYearTable;
    }

    const PreviousYearTable = generateTable();

    return(
        <>
            <div className='pb-2'>
                <div className="mt-5 text-2xl text-gray-600 font-semibold pb-2">
                    Previous Year
                </div>
                <div className="flex overflow-auto scrollbar-none space-x-3 h-44">
                    { PreviousYearTable }
                </div>
            </div>
        </>
    )
}

export default PreviousYearTable;