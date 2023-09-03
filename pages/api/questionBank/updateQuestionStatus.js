import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"
import clientPromise from "../../../lib/mongodb";


export default async (req, res) => {
    try{
        
        const session = await getServerSession(req, res, authOptions);
        if(session && req.method == "GET"){

            const email = session.user.email;
            const questionId = parseInt(req.query.questionId);
            const operationId = parseInt(req.query.operationId);
            const client = await clientPromise;
            const questionBankHistory = await client.db('userData')
            .collection('questionBankHistory')
            .findOne(
                { email: email }
            );

            const questionsLikedByUser = questionBankHistory.likedQuestions;
            const questionsDislikedByUser = questionBankHistory.dislikedQuestions;
            const questionsAttemptedByUser = questionBankHistory.attempted;


            // 1 for like.
            // 2 for dislike.
            // 3 for reset.
            // 4 for unlike.
            // 5 for undislike.
            if(operationId == 1){

                if(!questionsLikedByUser.includes(questionId)){

                    if(questionsDislikedByUser.includes(questionId)){
                        
                        await client.db('questions')
                        .collection('questions')
                        .updateOne(
                            { questionId: questionId },
                            { $inc: { disliked: -1 } }
                        )

                        await client.db('userData')
                        .collection('questionBankHistory')
                        .updateOne(
                            { email: email },
                            { $pull: { dislikedQuestions: questionId } }
                        );
                    }

                    await client.db('questions')
                    .collection('questions')
                    .updateOne(
                        { questionId: questionId },
                        { $inc: { liked: 1 } }
                    );

                    await client.db('userData')
                    .collection('questionBankHistory')
                    .updateOne(
                        { email: email },
                        { $push: { likedQuestions: questionId } }
                    );
                    
                }

                res.send({
                    status: true
                });
                return;
            }else if(operationId == 2){
                
                if(!questionsDislikedByUser.includes(questionId)){

                    if(questionsLikedByUser.includes(questionId)){

                        await client.db('questions')
                        .collection('questions')
                        .updateOne(
                            { questionId: questionId },
                            { $inc: { liked: -1 } }
                        )

                        await client.db('userData')
                        .collection('questionBankHistory')
                        .updateOne(
                            { email: email },
                            { $pull: { likedQuestions: questionId } }
                        );
                    }

                    await client.db('questions')
                    .collection('questions')
                    .updateOne(
                        { questionId: questionId },
                        { $inc: { disliked: 1} }
                    );

                    await client.db('userData')
                    .collection('questionBankHistory')
                    .updateOne(
                        { email: email },
                        { $push: { dislikedQuestions: questionId } }
                    );
                }

                res.send({
                    status: true
                });
                return;
            }else if(operationId == 3){

                const isQuestionAttempted = questionsAttemptedByUser.some(function(obj) {
                    return obj.questionId === questionId;
                });

                if(isQuestionAttempted){
                    await client.db('userData')
                    .collection('questionBankHistory')
                    .updateOne(
                        { email: email },
                        { $pull: { attempted: { questionId: questionId } } }
                    );
                }

                res.send({
                    status: true
                });
                return;
            }else if(operationId == 4){
                if(questionsLikedByUser.includes(questionId)){

                    await client.db('questions')
                    .collection('questions')
                    .updateOne(
                        { questionId: questionId },
                        { $inc: { liked: -1 } }
                    )

                    await client.db('userData')
                    .collection('questionBankHistory')
                    .updateOne(
                        { email: email },
                        { $pull: { likedQuestions: questionId } }
                    );
                }

                res.send({
                    status: true
                });
                return;
            }else if(operationId == 5){
                if(questionsDislikedByUser.includes(questionId)){
                        
                    await client.db('questions')
                    .collection('questions')
                    .updateOne(
                        { questionId: questionId },
                        { $inc: { disliked: -1 } }
                    )

                    await client.db('userData')
                    .collection('questionBankHistory')
                    .updateOne(
                        { email: email },
                        { $pull: { dislikedQuestions: questionId } }
                    );
                }
                res.send({
                    status: true
                });
                return;
            }
        }

        res.send({
            status: false
        });
        return;
    }catch (e){

        console.error(e);
        res.send({
            status: false
        });
        return;
    }
}