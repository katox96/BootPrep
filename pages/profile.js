import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { useSession, signOut } from 'next-auth/react';
import LandingPage from '@/components/landingPage/landingPage';
import { setUpForTestBank } from '@/lib/basicChecks';
import Profile from '@/components/profile/profile'
import { Header } from "@/components/profile/header";

export default function ProfilePage({ subscriptionInfo }) {
    
    const { data, status } = useSession();

    if (status === 'loading'){
        return(
            <h1> loading... please wait</h1>
        );
    }

    if (status === 'authenticated') {
        const profileProps = {
            name: data.user.name,
            subscriptionStatus: subscriptionInfo.subscriptionStatus,
            subscriptionInfo: subscriptionInfo
        };
        return(
            <>
                <Header></Header>
                <div className="container">
                    <Profile profileProps={ profileProps }></Profile>
                </div>
            </>
        );
    }
    window.location.href = "/";
    return (
        <></>
    );
}

export async function getServerSideProps(context) {

    const propObj = {
        subscriptionInfo: {
            subscriptionStatus: false,
            tests: [],
            ongoingTests: [],
            submittedTests: [],
            testsCount: 0
        }
    };
    
    try {

        const session = await getServerSession(context.req, context.res, authOptions);

        if(session){

            // const totalTestsReq = await fetch('http://localhost:3000/api/getTestsCount');
            // const testCountJson = await totalTestsReq.json();
            // const testsCount = testCountJson.testsCount;
            const testsCount = 8;

            var userName = "";
            const email = session.user.email;
            const client = await clientPromise;

            const userNameOut = await client.db("userDetails").collection("profiles").find({ "email": email}).toArray();
            if(userNameOut.length > 0){

                userName = userNameOut[0].userName;

            }else{

                var fullName = session.user.name;
                var splitName = fullName.split(" ");
                let suffix = Math.floor((Math.random() * 10000) + 1);
                const newUserName = splitName[0] + suffix;

                const filter = { email: email };
                const update = { $set: { email: email, userName: newUserName, hideUserName: false } };
                const options = { upsert: true };

                await client.db("userDetails").collection("profiles").updateOne(filter, update, options);
            }

            setUpForTestBank(email);

            const dbOut = await client.db("userData").collection("subscribed").find({ "email": session.user.email}).toArray();
            // if(dbOut.length > 0){

            const testsOut = await client.db("userData").collection("registrations").find({ "email": email }).toArray();
            const testData = (testsOut.length > 0)? testsOut[0].tests : [];
            const submittedTests = (testsOut.length > 0)? testsOut[0].submittedTests : [];

            // Get submitted and continued tests

            var testsFilter = {
                email:  email
            }

            var testsResp = await client
            .db("userData")
            .collection("testHistory")
            .find(testsFilter)
            .toArray()

            if(testsResp.length > 0){
                console.log(testsResp)
                for(let i = 0; i<testsResp.length; i++){
                    const itemObj = {
                        testType: testsResp[i].testType,
                        testId: testsResp[i].testId
                    }
                    if(testsResp[i].isSubmitted){
                        propObj.subscriptionInfo.submittedTests.push(itemObj);
                    }else{
                        propObj.subscriptionInfo.ongoingTests.push(itemObj);
                    }
                }
            }

            propObj.subscriptionInfo.subscriptionStatus = true;
            propObj.subscriptionInfo.tests = testData;
            propObj.subscriptionInfo.testsCount = testsCount;

            return {
                props: propObj
            };
            // }
        }

        return {
            props: propObj
        };
    }catch (e) {

        console.error(e);
        return {
            props: propObj
        };
    }
}