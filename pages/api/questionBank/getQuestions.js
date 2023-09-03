import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"
import { getQuestionsFromBank } from '@/lib/questionBankUtility';

export default async (req, res) => {
    try{

        const session = await getServerSession(req, res, authOptions);
        if(session && req.method == "GET"){

            const email = session.user.email;
            const data = await getQuestionsFromBank(email, req.query);
            res.send(data);
            return; 
        }else{

            res.send({
                data: []
            });
            return;
        }
    }catch (e){

        console.error(e);
        res.status(500).json({ status: 'Error !' });
        return;
    }
}