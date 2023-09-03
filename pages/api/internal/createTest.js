import fs from 'fs-extra';
import path from 'path';
import { authOptions } from "../auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

export default async (req, res) => {
    try {

        const session = await getServerSession(req, res, authOptions);
        if (session != null && session.user.email == "mock2dude@gmail.com" || session.user.email == "abhisdx.katoch5@gmail.com") {

            const qc = req.query.qc;
            const testId = req.query.testId;
            const questionPaper = [], solutions = [];
            const questionFileStr = 'data/testSeries/tests/test' + testId + '.json';
            const answerFileStr = 'data/testSeries/solutions/solutions' + testId + '.json';
            const answerFile = path.join(process.cwd(), answerFileStr);
            const questionFile = path.join(process.cwd(), questionFileStr);
            for(let i=0;i<qc;i++){

                //const questionResp = await fetch("http://13.232.125.149/getQuestion?subject=poly&questionType=MCQ");
                const questionResp = await fetch("http://localhost:3000/api/internal/getQuestion");
                const question = await questionResp.json();
                question.questionId = i + 1;
                const solution = {
                    questionId: i + 1,
                    questionType: question.type,
                    answer: question.answer,
                    explanation: question.explanation
                }

                delete question.answer;
                delete question.explanation;
                questionPaper.push(question);
                solutions.push(solution);
            }
            fs.writeFileSync(questionFile, JSON.stringify(questionPaper));
            fs.writeFileSync(answerFile, JSON.stringify(solutions));
            res.status(200).json({
                    status : questionFileStr 
                }
            );
            return;
        }

        res.send({
            status: "false",
        })
        return;
    } catch (e) {
        
        console.error(e);
        res.status(500).json({ status: 'Error !' });
        return;
    }
}