import clientPromise from "../lib/mongodb";
import { getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import Link from 'next/link';
import { LeaderBoard } from '@/components/leaderBoard/leaderBoard';

export default function LeaderBoardPage(data) {
    if(data.alertMessage != null && data.alertMessage == ""){
        return(
            <h1>{ data.alertMessage }</h1>
        );
    }

    return(
        <>
            <Link href={'/profile'}>
                <button>Back</button>
            </Link>
            <br/>
            <br/>
            <LeaderBoard data= { data }></LeaderBoard>
        </>
    );
}

export async function getServerSideProps(context){
    try{
        const session = await getServerSession(context.req, context.res, authOptions);
        var propObj = {
            alertMessage: null,
            myRank: 0,
            leaderBoard: [],
            hideUserNameFlag: false,
            testId: 0,
            myUserName: ''
        };

        if(session){

            const testId = parseInt(context.query.testId);
            const email = session.user.email;
            const client = await clientPromise;

            const wasRegisteredCheck = await client.db("userData").collection("registrations").find({ "email": email }).toArray();
            if(wasRegisteredCheck.length > 0){

                const submittedTests = wasRegisteredCheck[0].submittedTests;
                if(submittedTests.includes(testId)){   

                    const leaderBoardResp = await client.db("userData").collection("leaderBoards").find({ testId: testId }).toArray();
                    if(leaderBoardResp.length > 0){

                        const rankingData = leaderBoardResp[0].board;
                        rankingData.sort((a, b) => b.score - a.score);
                        var leaderBoardToDisplay = [];
                        var hideUserNameFlag = false;
                        var myUserName = 'Anonymous';
                        for(let i=0;i<Math.min(10, rankingData.length); i++){

                            var displayUserName = "Anonymous"
                            if(!rankingData[i].hideUserName){

                                const getUserNameResp = await client.db("userDetails").collection("profiles").find({ "email": rankingData[i].email }).toArray();
                                if(getUserNameResp.length > 0){
                                    (getUserNameResp[0].userName == null || getUserNameResp[0].userName == '')? displayUserName = session.user.name : displayUserName = getUserNameResp[0].userName;
                                }
                            }

                            if(rankingData[i].email != email){
                                delete rankingData[i].email;
                            }else{

                                hideUserNameFlag = rankingData[i].hideUserName;
                                const getUserNameResp = await client.db("userDetails").collection("profiles").find({ "email": rankingData[i].email }).toArray();
                                if(getUserNameResp.length > 0){

                                    (getUserNameResp[0].userName == null || getUserNameResp[0].userName == '')? myUserName = session.user.name : myUserName = getUserNameResp[0].userName;
                                }
                            }

                            rankingData[i]['displayUserName'] = displayUserName;
                            leaderBoardToDisplay.push(rankingData[i]);
                        }

                        const myRank = rankingData.findIndex(obj => obj.email === email) + 1;
                        propObj.myRank = myRank;
                        propObj.leaderBoard = leaderBoardToDisplay;
                        propObj.hideUserNameFlag = hideUserNameFlag;
                        propObj.testId = testId;
                        propObj.myUserName = myUserName;

                        return {
                            props: propObj
                        }
                    }
                }
            }

            propObj.alertMessage= "Can't show this page.";
            return{
                props: propObj
            };
        }
    }catch (e){

        console.error(e);
        return{
            props: propObj
        };
    }
}