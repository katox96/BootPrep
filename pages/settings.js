import Link from 'next/link';
import { useRef, useState } from "react";
import clientPromise from "../lib/mongodb";
import { getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { Settings } from '@/components/settings/settings';

export default function SettingsPage(data) {
    if(data.isSessionValid){
        return(
            <>
                <Link href={'/profile'}>
                    <button>Back</button>
                </Link>
                <Settings data={ data }></Settings>
            </>
        );
    }
    return(
        <>
            <h1>Please Login to view this page!</h1>
        </>
    );
}

export async function getServerSideProps(context){
    try{

        const session = await getServerSession(context.req, context.res, authOptions);
        var propObj = {
            isSessionValid: false,
            userName: "",
            hideUserName: false
        };

        if(session){

            var userName = "";
            const client = await clientPromise;
            const userNameOut = await client.db("userDetails").collection("profiles").find({ "email": session.user.email}).toArray();

            var hideUserName = false;
            if(userNameOut.length > 0){
                userName = userNameOut[0].userName;
                hideUserName = userNameOut[0].hideUserName;
            }

            propObj.isSessionValid = true;
            propObj.userName = userName;
            propObj.hideUserName = hideUserName;

            return{
                props: {
                    isSessionValid: true,
                    userName: userName,
                    hideUserName: hideUserName
                }
            };
        }
        return{
            props: propObj
        };
    }catch (e){
        console.error(e);
        return{
            props: propObj
        };
    }
}