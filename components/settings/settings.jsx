import React from 'react';
import Link from 'next/link';
import { useRef, useState } from "react";

export const Settings = ({ data }) => {

    const isSessionValid = data.isSessionValid;
    const userName = data.userName;
    const userNameField = useRef();
    const saveUserNameBtn = useRef();
    const [hideUserNameBool, setHideUserNameBool] = useState(data.hideUserName);
    const [profileDataStatus, setProfileDataStatus] = useState('');

    async function checkUserNameAvailibility(){
        const userNameParam = userNameField.current.value;
        const userNameRegex = new RegExp('^(?=[a-zA-Z0-9._]{6,14}$)(?!.*[_.]{2})[^_.].*[^_.]$');
                                            //        ^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$
                                            // └─────┬────┘└───┬──┘└─────┬─────┘└─────┬─────┘ └───┬───┘
                                            //     │         │         │            │           no _ or . at the end
                                            //     │         │         │            │
                                            //     │         │         │            allowed characters
                                            //     │         │         │
                                            //     │         │         no __ or _. or ._ or .. inside
                                            //     │         │
                                            //     │         no _ or . at the beginning
                                            //     │
                                            //     username is 8-20 characters long
        if(userNameParam == ""){
            setProfileDataStatus('');
            return;
        }

        if(userNameParam == null || userNameParam.length < 6 || userNameParam.length > 14 || !userNameRegex.test(userNameParam)){
            setProfileDataStatus('Invalid UserName!');
            return;
        }

        const response = await fetch('/api/existsUserName?userName=' + userNameParam, {
            method: 'GET'
        });

        if(!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        if(data.status == true){
            if(userNameParam == userName){
                setProfileDataStatus('Username already in use!');
                return;
            }
            setProfileDataStatus('Username exists!');
        }else{
            setProfileDataStatus("Username available!");
        }
    }

    async function saveProfileDetails(){

        var userNameParam = userNameField.current.value;

        const userNameRegex = new RegExp('^(?=[a-zA-Z0-9._]{6,14}$)(?!.*[_.]{2})[^_.].*[^_.]$');

        if(userNameParam == userName){
            return;
        }

        if(userNameParam == null || userNameParam == ""){
            userNameParam = userName;
        }

        if(userNameParam.length < 6 || userNameParam.length > 14 || !userNameRegex.test(userNameParam)){
            setProfileDataStatus('Invalid UserName!');
            return;
        }

        const response = await fetch('/api/saveProfileDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({  userName: userNameParam, hideUserName: hideUserNameBool })
        });

        if(!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        if(data.status == true){
            userNameField.current.placeholder = userNameParam;
            userNameField.current.value = '';
            setProfileDataStatus('Details Updated!');
        }else{
            alert('Something went wrong!');
        }
    }

    async function setHideUserNameVla(val){
        setHideUserNameBool(val);
    }

    return(
        <>
            <br/>
            <br/>
            <br/>
            <label>New Username: </label>
            <br/>
            <input type='text' ref={ userNameField } onKeyUp={ checkUserNameAvailibility } placeholder={ userName }/>
            <br/>
            <br/>
            <lablel>Hide username form leaderboard ?</lablel>
            <br/>
            <input type='radio' name='hideUsernameFlag' onClick={ () => setHideUserNameVla(true) } checked={ (hideUserNameBool)? 'selected': '' }/>
            <lable>Yes</lable>
            <input type='radio' name='hideUsernameFlag' onClick={ () => setHideUserNameVla(false) } checked={ (!hideUserNameBool)? 'selected': '' }/>
            <lable>No</lable>
            <br/>
            <br/>
            <button ref={ saveUserNameBtn } onClick={ () => saveProfileDetails() } >Save</button>
            <br/>
            <br/>
            <p>{ profileDataStatus }</p>
        </>
    )
}