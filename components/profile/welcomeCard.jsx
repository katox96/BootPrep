import React from 'react';
import { signOut } from 'next-auth/react';


export const WelcomeCard = ({ name }) => {
    const names = name.split(" ");
    const firstName = names[0].charAt(0).toUpperCase() + names[0].slice(1);
    const lastName = names[1].charAt(0).toUpperCase() + names[1].slice(1);
    return(
        <div className="p-2 border-2 border-grey-500 rounded-md flex">
            <h1> Hi { firstName } { lastName }!</h1>
            <div className="ml-auto">
                <button onClick={ signOut }>sign out</button>
            </div>
        </div>
    )
}