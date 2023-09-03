import React, { useEffect, useState } from 'react';
import Icon from '@/components/icons/icons'
import Image from 'next/image';

export const Instructions = () => {
    return(
        <div className="mt-6 border border-1 border-grey-500 p-4 rounded-lg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]">
            <p className=" font-bold">Instructions:</p>
            <div className="ml-2">
                <ul>
                    <li>1. Submit the test to see the solutions. Submit button is at the bottom.</li>
                    <li className="flex">
                        <p>2. Use</p>
                        <p className="mx-2"><Icon name={'CheckSquare'} color={'black'} size={'20'}/></p>
                        <p>to mark the question for review.</p>
                    </li>
                    <li className="flex">3. Use <Image className="mx-2" id="mapButton"width={20} height={20}  src="/icons/map1.png"></Image> to navigate throughout the page.</li>
                </ul>
            </div>
        </div>
    )
}