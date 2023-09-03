import React from "react";

export default function Buttons({ question, updateQuestionStatus }){

    const questionId = question.questionId;
    var resetButton = null;
    var likeButton = <button className="border border-1 border-slate-300 px-2 py-1 rounded-lg" onClick={ () => updateQuestionStatus(questionId, 1) }>Like</button>;
    var dislikeButton = <button className="border border-1 border-slate-300 px-2 py-1 rounded-lg" onClick={ () => updateQuestionStatus(questionId, 2) }>Dislike</button>;

    if(question.selectedOption != null){
        resetButton = <button id={`reset-button-${question.questionId}`} className="border border-1 border-slate-500 px-2 py-1 rounded-lg bg-red-500 text-white" onClick={ () => updateQuestionStatus(questionId, 3) }>Reset</button>;
    }

    if(question.likedByMe != null && question.likedByMe == true){
        likeButton = <button className="border border-1 border-slate-500 px-2 py-1 rounded-lg bg-green-500 text-white" onClick={ () => updateQuestionStatus(questionId, 4) }>Liked</button>;
    }

    if(question.dislikedByMe != null && question.dislikedByMe == true){
        dislikeButton = <button className="border border-1 border-slate-500 px-2 py-1 rounded-lg bg-red-400 text-white" onClick={ () => updateQuestionStatus(questionId, 5) }>Disliked</button>;
    }

    return(
        <div className=" mb-3 text-right pr-4 space-x-2">
            { resetButton }
            { likeButton }
            { dislikeButton }
        </div>
    );
}