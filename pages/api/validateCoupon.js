import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import clientPromise from "../../lib/mongodb";


export default async (req, res) => {
    try{

        const session = await getServerSession(req, res, authOptions);
        const method = req.method;
        if (session) {
            if(method === 'POST'){
    
                const couponCode = req.body.couponCode;
                const client = await clientPromise;
                const db = client.db("userData");
                const checkCoupon = await db.collection("coupons").find({ "couponCode": couponCode }).toArray();
                if(checkCoupon.length > 0){
    
                    await db.collection("coupons").deleteOne({ "couponCode": couponCode});
                    await db.collection("subscribed").insertOne({ "email": session.user.email });
                    
                    res.send({
                        status: true
                    });
                    return;
                }
            }
        }

        res.send({
            status: false
        });
        return;
    }catch (e){

        console.error(e);
        res.status(500).json({ status: 'Error !' });
        return;
    }
}