import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try{
        const session = await getServerSession(req, res, authOptions);
        const {method} = req;
        if (session) {
            if(method === 'POST'){

                var testId = parseInt(req.body.testId);
                testId = 1000 + testId;
                const client = await clientPromise;
                const subscribedResp = await client.db("userData").collection("subscribed").find({ "email": session.user.email }).toArray();
                if(subscribedResp.length == 0){
                    
                    res.send({
                        status: false,
                    });
                    return;
                }

                const testsResp = await client.db("userData").collection("registrations").find({ "email": session.user.email }).toArray();
                if(testsResp.length == 0){

                    const obj = {
                        email: session.user.email,
                        tests: [ testId ],
                        submittedTests: []
                    };

                    await client.db("userData").collection("registrations").insertOne(obj);
                    res.send({
                        status: true,
                    });
                    return;
                }else{
                    
                    const newTests = testsResp[0].tests;
                    if(!newTests.includes(testId)){

                        newTests.push(testId);
                        await client.db("userData").collection("registrations").updateOne(
                            { _id: testsResp[0]._id },
                            { $set: { tests: newTests } }
                        )

                        res.send({
                            status: true,
                        });
                        return;
                    }
                }
            }

            res.send({
                status: false
            });
            return;
        }else {

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