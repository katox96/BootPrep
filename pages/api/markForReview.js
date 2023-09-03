import { isSubscribed } from "../../lib/basicChecks";
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import clientPromise from "../../lib/mongodb";



export default async (req, res) => {
    try{

        const session = await getServerSession(req, res, authOptions);
        const email = session.user.email;
        if(req.method == 'POST' && session && isSubscribed(email)){
            
            const testId = parseInt(req.body.testId);
            const questionId = parseInt(req.body.questionId);
            const testType = parseInt(req.body.testType);
            const reviewFlag = req.body.reviewFlag;

            const client = await clientPromise;
            const db = client.db("userData");

            const testHistoryFilter = {
                email: email,
                testId: testId,
                testType: testType,
            }

            if(reviewFlag){

                await db.collection("testHistory").updateOne(
                    testHistoryFilter,
                    { $addToSet: { questionsForReview: questionId } }
                );
            }else{

                await db.collection("testHistory").updateOne(
                    testHistoryFilter,
                    { $pull: { questionsForReview: questionId } }
                );
            }

            res.send({
                status: true
            })
            return;
        }

        res.send({
            status: false
        });
        return;
    }catch (e){

        console.error('ERROR!', e);
        res.send({
            status: false
        });
    }
}