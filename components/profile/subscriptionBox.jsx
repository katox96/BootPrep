import { useRef, useState } from "react";

const SubscriptionBox = () => {
    const couponInput = useRef();
    const [placeHolderMessage, setplaceHolderMessage] = useState('Enter Coupon Code!');

    async function validateCupon(){
        try{
            const couponValue = couponInput.current.value;
            
            if(couponValue.length > 0){
                const response = await fetch('/api/validateCoupon', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({  couponCode: couponValue })
                });
    
                if(!response.ok) throw new Error(`Error: ${response.status}`);
                const data = await response.json();
                couponInput.current.value = '';
    
                if(data.status == true){
                    window.location.href = "/profile";
                }else{
                    setplaceHolderMessage("Invalid coupon code!");
                }
            }
        } catch (e) {
            console.error('ERROR', e);
        }
    }

    return(
        <div className="mt-2 p-2 border-2 border-grey-500 rounded-md">
            <div className="flex">
                <div className="w-[100%]">
                    <input className="w-[95%]" type="text" ref={ couponInput } placeholder={ placeHolderMessage }/>
                </div>
                <div className="cursor-pointer" onClick={() => validateCupon()}>
                    <button>Subscribe</button>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionBox;