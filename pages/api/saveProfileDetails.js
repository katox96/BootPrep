import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import clientPromise from "../../lib/mongodb";


export default async (req, res) => {
    try{

        const session = await getServerSession(req, res, authOptions);
        const method = req.method;
        const email = session.user.email;
        const userName = req.body.userName;
        const userNameRegex = new RegExp('^(?=[a-zA-Z0-9._]{6,14}$)(?!.*[_.]{2})[^_.].*[^_.]$');
        // ^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$
        // └─────┬────┘└───┬──┘└─────┬─────┘└─────┬─────┘ └───┬───┘
        //     │         │         │            │           no _ or . at the end
        //     │         │         │            │
        //     │         │         │            allowed characters
        //     │         │         │
        //     │         │         no __ or _. or ._ or .. inside
        //     │         │
        //     │         no _ or . at the beginning
        //     │
        //     username is 8-20 characters long
        if (session && method === 'POST' &&  6 <= userName.length && userName.length <= 14 && userNameRegex.test(userName)) {

            const hideUserName = req.body.hideUserName;
            const client = await clientPromise;
            const db = client.db("userDetails");
            const checkUsername = await db.collection("profiles").find({ "userName": userName }).toArray();
            if(checkUsername.length > 0 && checkUsername[0].email != email){

                res.send({
                    status: false
                });
                return;
            }else{

                const filter = { email: email };
                const update = { $set: { email: email, userName: userName, hideUserName: hideUserName } };
                const options = { upsert: true };
                await db.collection("profiles").updateOne(filter, update, options);
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
        
        console.error('ERROR!', e);
        res.status(500).json({ status: 'Error !' });
        return;
    }
}