import fs from 'fs-extra';
import path from 'path';
import { useSession } from 'next-auth/react';
import LandingPage from "@/components/landingPage/landingPage";

export default function Index({ demoQuestions }){
        return(
            <LandingPage demoQuestions={ demoQuestions }></LandingPage>
        );
}

export async function getServerSideProps() {
    try{
        const demoQuestionsReq = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/demoQuestions/', 'demoQuestions.json')));
        const propObj = {
            demoQuestions: demoQuestionsReq
            //haider
        }
        return {
            props: propObj
        };
    }catch (e) {

        console.error(e);
        return {
            props: {
                demoQuestions : []
            }
        };
    }
}