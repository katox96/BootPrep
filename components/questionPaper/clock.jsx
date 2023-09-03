import React, { useEffect, useState } from 'react';

export const Clock = ({ data }) => {

    const testId = parseInt(data.testId);
    const testType = parseInt(data.testType);

    // Add two hours to the start time.
    var endTime = parseInt(data.startTime) + 7200;
    var currentTime = parseInt(data.currentTime);
    var secondsLeft = parseInt(endTime) - parseInt(currentTime);

    var secondsLeft2 = secondsLeft;
    let hours = Math.floor(secondsLeft2 / 3600);
    secondsLeft2 = secondsLeft2 % 3600;
    let minutes = Math.floor(secondsLeft2 / 60);
    secondsLeft2 = secondsLeft2 % 60;
    let seconds = secondsLeft2;
    var intervalId;

    const [timeString, setTimeString] = useState( `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`);

    async function submitTest(){

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
            window.location.href = "/profile";
        }else{
            alert("Error occured! Please try again.");
        }
    }

    function updateTimer() {
        secondsLeft--;
        if(secondsLeft <= 0){
            $("#timer").hide();
            clearInterval(intervalId);
            alert("Times Up! Submitting the test.");
            submitTest();
            return;
        }
        seconds--;
        if (seconds <= 0) {
            seconds = 59;
            minutes--;
            if (minutes <= 0) {
                minutes = 59;
                hours--;
            }
        }

        setTimeString(`${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`);
    }

    function padZero(num) {
      return (num < 10 ? "0" : "") + num;
    }

    useEffect(() => {
        intervalId = setInterval(updateTimer, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return(
        <div id="timer" className="sticky-clock p-1 rounded-xl bg-black text-white">{ timeString }</div>
    )
}