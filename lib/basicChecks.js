import clientPromise from "./mongodb";

export async function isSubscribed(email){

    const client = await clientPromise;
    const dbResp = await client
    .db("userData")
    .collection("subscribed")
    .findOne({ email: email});
    return dbResp != null;
}

export async function isRegestered(email, testId){
    const subscribed = await isSubscribed(email);

    if(subscribed){
        const client = await clientPromise;
        const testsOut = await client
        .db("userData")
        .collection("registrations")
        .find({ "email": email })
        .toArray();

        const testData = (testsOut.length > 0)? testsOut[0].tests : [];
        return testData.includes(testId);
    }
    return false;
}

export async function setUpForTestBank(email){
    try{
        const client = await clientPromise;
    
        const doesExist = await client.db("userData")
        .collection("questionBankHistory")
        .findOne({email: email});
    
        if(!doesExist){
            const testBankHistoryObj =   {
                email: email,
                likedQuestions: [],
                dislikedQuestions: [],
                attempted: [],
                attemptedWrongCount: 0,
                attemptedRightCount: 0
            }
    
            await client.db("userData")
            .collection("questionBankHistory")
            .insertOne(testBankHistoryObj);
        }
    
        return true;
    }catch (e){

        console.error(e)
        return false;
    }
}