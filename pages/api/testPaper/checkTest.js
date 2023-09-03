import fs from 'fs-extra';
import path from 'path';
import { authOptions } from "../auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
    try{

        const method = req.method;
        if(method === 'GET'){
            res.send({
                status: false
            });
        }

        const session = await getServerSession(req, res, authOptions);
        if(session){

            const testId = parseInt(req.body.testId);
            const testType = parseInt(req.body.testType);
            const questionId = req.body.questionId;
            const selectedOption = req.body.selectedOption;
            const questionType = req.body.questionType;
            const subject = req.body.subject;
            const email = session.user.email;

            const solutions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/previousYears/solutions/', 'solutions' + testId + '.json')));
            //const solutions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/testSeries/solutions/', 'solutions1.json')));
            const client = await clientPromise;
            const db = client.db("userData");

            const testHistoryFilter = { 
                email: email, 
                testType: testType, 
                testId: testId
            }

            const checkHistory = await db.collection("testHistory").find(testHistoryFilter).toArray();

            if(checkHistory.length == 0){

                const testHistObj = {
                    email: email,
                    testType: testType,
                    testId: testId,
                    isSubmitted: false,
                    history: [
                        {
                            questionId: questionId,
                            selectedOption: selectedOption,
                            isCorrect: (solutions[questionId-1].answer[0] == selectedOption),
                            questionType: questionType,
                            subject: subject
                        }
                    ],
                    questionsForReview: []
                };
                await db.collection("testHistory").insertOne(testHistObj);

                res.send({
                    status: true,
                });
                return;
            }else{

                const isAlreadyAnsweredFilter = { 
                    email: email,
                    testType: testType,
                    testId: testId
                };

                const isAlreadyAnsweredResponse = await db.collection("testHistory").find(isAlreadyAnsweredFilter).toArray();
                var isQuestionAnswered = false;
                if(isAlreadyAnsweredResponse.length > 0){

                    const history = isAlreadyAnsweredResponse[0].history;
                    for(let i=0;i<history.length;i++){

                        if(history[i].questionId == questionId){

                            isQuestionAnswered = true;
                            break;
                        }
                    }
                }

                if(isQuestionAnswered){

                    if(selectedOption == null){

                        const updateHistoryFilter = { 
                            email: email,
                            testType: testType,
                            testId: testId
                        };

                        await db.collection("testHistory")
                        .updateOne(
                            updateHistoryFilter,
                            { $pull: { history: { questionId: questionId } } }
                        );
                    }else{

                        const updateHistoryFilter = {
                            email: email,
                            testType: testType,
                            testId: testId,
                            history: { $elemMatch: { questionId: questionId } } 
                        };

                        await db.collection("testHistory").updateOne(
                            updateHistoryFilter,
                            { $set: { "history.$.selectedOption": selectedOption, "history.$.isCorrect": (solutions[questionId-1].answer[0] == selectedOption) }}
                        );
                    }
                }else{

                    const updateHistoryFilter = { 
                        email: email,
                        testType: testType,
                        testId: testId
                    };
                    
                    const testHistoryArrayItem = {
                        questionId: questionId,
                        selectedOption: selectedOption,
                        isCorrect: (solutions[questionId-1].answer[0] == selectedOption),
                        questionType: questionType,
                        subject: subject
                    };
                    
                    await db.collection("testHistory").updateOne(
                        updateHistoryFilter,
                        { $push: { history: testHistoryArrayItem } }
                    );
                }

                res.send({
                    status: true,
                });
                return;
            }
        }

        res.send({
            status: false,
        })
        return;
    }catch (e) {

        console.error(e);
        res.send({
            status: false,
        })
        return;
    }
}