import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "@/lib/mongodb";

export default async (req, res) => {
    try{

        const session = await getServerSession(req, res, authOptions);
        if(session && req.method == "GET"){

            const testId = parseInt(req.query.testId);
            const email = session.user.email;
            const client = await clientPromise;

            const filter = { 
                email: email,
                testId: testId
            };
            await client.db('userData')
            .collection('testHistory')
            .deleteOne(
                filter,
            );

            res.send({
                status: true
            });
            return; 
        }else{

            res.send({
                status: false
            });
            return;
        }
    }catch (e){

        console.error(e);
        res.status(500).json({ status: 'Error !' });
        return;
    }
}