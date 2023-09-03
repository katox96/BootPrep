import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import clientPromise from "../../lib/mongodb";


export default async (req, res) => {
    try{

        const session = await getServerSession(req, res, authOptions);
        const method = req.method;
        if(session && method == 'POST'){

            const hideFlag = req.body.hideFlag;
            const testId = req.body.testId;
            const email = session.user.email;
            const client = await clientPromise;
            await client.db("userData").collection("leaderBoards").updateOne(
                {
                    testId: testId,
                    board: { $elemMatch: { email: email } } 
                },
                { $set: { "board.$.hideUserName": hideFlag }}
            );

            res.send({
                status: true
            });
            return;
        }

        res.send({
            status: false
        });
        return;
    }catch (e){
        
        console.error('ERROR!', e);
        res.status(500).json({ status: 'Error !' });
        return;
    }
}