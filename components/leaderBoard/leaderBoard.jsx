import React from 'react';
import { useRef, useState } from "react";


export const LeaderBoard = ({ data }) => {

    const leaderBoard = data.leaderBoard;
    const myRank = data.myRank;
    const testId = data.testId;
    const myUserName = data.myUserName;
    const [hideUserNameBool, setHideUserNameBool] = useState(data.hideUserNameFlag);

    async function setHideUserNameVla(val){

        const response = await fetch('/api/hideInLeaderBoard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hideFlag: val, testId: testId })
        });

        if(!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        if(data.status == true){
            setHideUserNameBool(val);
            if(val){
                document.getElementById('myUserName').innerHTML = 'Anonymous';
            }else{
                document.getElementById('myUserName').innerHTML = myUserName;
            }
        }else{
            alert('Something went wrong!');
        }
    }

    const rows = [];
    leaderBoard.map((row, i) =>
        rows.push(
            <tr>
                <td>
                    { ++i }
                </td>
                <td id={ (i == myRank)? 'myUserName' : 'row'+i } >
                    { (row.displayUserName == null )? 'Anon' : row.displayUserName }
                </td>
                <td>
                    { row.score }
                </td>
            </tr>
        )
    );

    return(
        <>
            <p> Your rank is { myRank }</p>
            <lablel>Hide username in leaderboard ?</lablel>
            <br/>
            <input type='radio' name='hideUsernameFlag' onClick={ () => setHideUserNameVla(true) } checked={ (hideUserNameBool)? 'selected': '' }/>
            <lable>Yes</lable>
            <input type='radio' name='hideUsernameFlag' onClick={ () => setHideUserNameVla(false) } checked={ (!hideUserNameBool)? 'selected': '' }/>
            <lable>No</lable>
            <br/>
            <br/>
            <table>
                <thead>
                    <tr>
                        <th>
                            Rank
                        </th>
                        <th>
                            Username
                        </th>
                        <th>
                            Score
                        </th>
                    </tr>
                </thead>
                <tbody>
                    { rows }
                </tbody>
            </table>
        </>
    )
}