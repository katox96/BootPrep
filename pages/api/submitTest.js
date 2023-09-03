import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try{

        const session = await getServerSession(req, res, authOptions);
        if (session) {
    
            const method = req.method;
            if(method === 'POST'){
    
                const testId = parseInt(req.body.testId);
                const testType = parseInt(req.body.testType);
                const email = session.user.email;
                const client = await clientPromise;

                const checkSubmittedFilter = {
                    email: email,
                    testType: testType,
                    testId: testId
                }
                
                const checkSubmittedResponse = await client.db("userData")
                .collection("testHistory")
                .find(checkSubmittedFilter)
                .toArray();
                if(checkSubmittedResponse.length > 0){

                    const isSubmitted = checkSubmittedResponse[0].isSubmitted;
                    if(!isSubmitted){

                        var totalMarks = 0;
                        const dataForLeaderBoard = checkSubmittedResponse[0];
                        if(dataForLeaderBoard.length > 0){

                            const questions = dataForLeaderBoard.history;
                            if(questions != null){

                                for(let i=0;i<questions.length;i++){

                                    if(questions[i].testId == testId){

                                        if(questions[i].isCorrect){

                                            totalMarks += 2;
                                        }else{

                                            totalMarks -= 0.66;
                                        }
                                    }
                                }
                            }
                        }

                        var hideUserName = false;
                        const checkHideUserNameFilter = { 
                            email: email
                        };
                        const profileDataResp = await client.db("userDetails")
                        .collection("profiles")
                        .find(checkHideUserNameFilter)
                        .toArray();
                        if(profileDataResp.length != 0){

                            hideUserName = profileDataResp[0].hideUserName;
                        }

                        const filter = { 
                            testId: testId,
                            testType: testType
                        };
                        const checkLeaderBoard = await client.db("userData")
                        .collection("leaderBoards")
                        .find(filter)
                        .toArray();
                        if(checkLeaderBoard.length == 0){

                            const leaderBoardObj = {
                                testId: testId,
                                testType: testType,
                                board: [
                                    {
                                        email: email,
                                        score: totalMarks,
                                        hideUserName: hideUserName
                                    }
                                ]
                            };

                            await client.db("userData")
                            .collection("leaderBoards")
                            .insertOne(leaderBoardObj);
                        }else{

                            const leaderBoardLineObj = {
                                email: email,
                                score: totalMarks,
                                hideUserName: hideUserName
                            };

                            await client.db("userData")
                            .collection("leaderBoards")
                            .updateOne(
                                filter,
                                { $push: { board: leaderBoardLineObj } }
                            );
                        }

                        filter["email"] = email;
                        
                        await client.db("userData")
                        .collection("testHistory")
                        .updateOne(
                            filter,
                            { $set: { isSubmitted: true } }
                        );

                        client.db("userData")
                        .collection("testHistory")
                        .updateOne(
                            filter,
                            { $set: { questionsForReview: [] } }
                        );
                        
                        res.send({
                            status: true
                        });
                        return;
                    }
                }
            }
        }

        res.send({
            status: false
        })
        return;
    }catch (e){

        console.error(e);
        res.status(500).json({ status: 'Error !' });
        return;
    }
}