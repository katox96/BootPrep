import { authOptions } from "../auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
    try{
        const method = req.method;
        const session = await getServerSession(req, res, authOptions);

        if(method === 'GET' || !session){
            res.send({
                status: false
            });
            return;
        }
        const email = session.user.email;
        const { questionId, selectedOption, isCorrect, subject, type } = req.body;

        if(await checkIfAlreadySolved(email, questionId)){
            console.log(questionId);
            
            res.send({
                status: false
            });
            return;
        }

        const client = await clientPromise;

        if(isCorrect){
            await client.db('questions')
            .collection('questions')
            .updateOne({ questionId: questionId }, { $inc: { attempts: 1, correctAttempts: 1 } });
        }else{
            await client.db('questions')
            .collection('questions')
            .updateOne({ questionId: questionId }, { $inc: { attempts: 1, wrongAttempts: 1 } });
        }

        const questionBankHistoryUpdateObj = {
            questionId: questionId,
            selectedOption: selectedOption,
            isCorrect: isCorrect,
            subject: subject,
            type: type
        }

        await client.db('userData')
        .collection("questionBankHistory")
        .updateOne(
            { email: email },
            { $push: { attempted: questionBankHistoryUpdateObj } }
        );

        if(isCorrect){
            await client.db('userData')
            .collection('questionBankHistory')
            .updateOne(
                { email: email },
                { $inc: { attemptedRightCount: 1 } }
            );
        }else{
            await client.db('userData')
            .collection('questionBankHistory')
            .updateOne(
                { email: email },
                { $inc: { attemptedWrongCount: 1 } }
            );
        }

        res.send({
            status: true
        });
        return;

    }catch (e) {

        console.error(e);
        res.send({
            status: false,
        })
        return;
    }
}

async function checkIfAlreadySolved(email, questionId){
    try{

        const client = await clientPromise;
        const questionBankHistoryResp = await client.db('userData')
        .collection('questionBankHistory')
        .findOne(
            { email: email },
        );

        const questionBankHistory = questionBankHistoryResp;
        return questionBankHistory.attempted.some(question => question.questionId === questionId);
    }catch (e){

        console.error(e);
        return null;
    }
}