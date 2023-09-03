import fs from 'fs-extra';
import path from 'path';

export default async (req, res) => {
    try {

        const questions = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/internal/', 'questionHAS.json')));
        const randomQuestion = Math.floor(Math.random() * 200) + 1;
        var question = questions[randomQuestion-1];
        delete question.rating;
        delete question.liked;
        delete question.disliked;
        delete question.attempts;
        delete question.correctAttempts;
        delete question.wrongAttempts;
        delete question.questionId;
        delete question._id;
        res.send(question);
    }catch (e){

        console.error('Error!', e);
        res.send({})
        return;
    }
}