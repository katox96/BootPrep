import clientPromise from "./mongodb";

export async function getQuestionsFromBank(email, filters){
    try{
        const pageNo = parseInt(filters.pageNo);
        const pageSize = parseInt(filters.pageSize);
        const subject = filters.subject;
        const type = filters.type;
        const status = filters.status;
        const choice = filters.choice
        const sort = filters.sort;
        const client = await clientPromise;
    
        var questionFilter = {};
    
        if(subject != null & subject != ""){
            questionFilter.subject = subject;
        }
    
        if(type != null && type != ""){
            questionFilter.type = type;
        }

        const questionBankHistory = await client.db("userData")
        .collection("questionBankHistory")
        .find({ email: email })
        .toArray();

        const likedQuestionsIds = questionBankHistory[0].likedQuestions; 
        const disLikedQuestionsIds = questionBankHistory[0].dislikedQuestions;

        if(status != null && status != ""){
            if(status == "Solved"){
    
                var solvedQuestionsSolutions = questionBankHistory[0].attempted;
                var solvedQuestionsIds = solvedQuestionsSolutions.map(function(obj) {
                    return obj.questionId;
                });
    
                if(choice == "Liked"){
    
                    var solvedLikedQuestionsIds = solvedQuestionsIds.filter(function(value) {
                        return likedQuestionsIds.includes(value);
                    });
                    questionFilter.questionId = { $in: solvedLikedQuestionsIds };
                    totalCount = solvedLikedQuestionsIds.length;
                }else if(choice == "Disliked"){
    
                    var solvedDislikedQuestionsIds = solvedQuestionsIds.filter(function(value) {
                        return disLikedQuestionsIds.includes(value);
                    });
                    questionFilter.questionId = { $in: solvedDislikedQuestionsIds };
                    totalCount = solvedDislikedQuestionsIds.length;
                }else{
                    questionFilter.questionId = { $in: solvedQuestionsIds };
                    totalCount = solvedQuestionsIds.length;
                }
    
    
                var filteredQuestions = await client.db("questions")
                .collection("questions")
                .find(questionFilter)
                .sort({ rating: -1 })
                .skip((pageNo-1)*pageSize)
                .limit(pageSize)
                .toArray();
    
                solvedQuestionsSolutions.forEach(function(solution) {
                    var matchingQuestion = filteredQuestions.find(function(question) {
                      return question.questionId === solution.questionId;
                    });
                  
                    if (matchingQuestion) {
                        matchingQuestion.selectedOption = solution.selectedOption;
                        matchingQuestion.isCorrect = solution.isCorrect;
                    }
                });
    
                var data = filteredQuestions;
                data.push({ totalQuestions: totalCount});
                markLikeDislike(data, likedQuestionsIds, disLikedQuestionsIds);
                return data;
            }else if(status == "Unsolved"){
    
                var solvedQuestionsSolutions = questionBankHistory[0].attempted;
                var solvedQuestionIds = solvedQuestionsSolutions.map(function(obj) {
                    return obj.questionId;
                });
    
                var totalCount = 0;
                if(choice == "Liked"){
                    const unSolvedLikedQuestionIds = likedQuestionsIds.filter(id => !solvedQuestionIds.includes(id));
                    questionFilter.questionId = { $in: unSolvedLikedQuestionIds };
                    totalCount = unSolvedLikedQuestionIds.length;
                }else if(choice == "Disliked"){
                    const unSolvedDislikedQuestionIds = disLikedQuestionsIds.filter(id => !solvedQuestionIds.includes(id));
                    questionFilter.questionId = { $in: unSolvedDislikedQuestionIds };
                    totalCount = unSolvedDislikedQuestionIds.length;
                }else{
                    totalCount = await getQuestionsCount(questionFilter);
                    questionFilter.questionId = { $nin: solvedQuestionIds };
                    totalCount -= solvedQuestionIds.length;
                }
    
    
                var filteredQuestions = await client.db("questions")
                .collection("questions")
                .find(questionFilter)
                .skip((pageNo-1)*pageSize)
                .limit(pageSize)
                .toArray();
    
                var data = filteredQuestions;
                data.push({ totalQuestions: totalCount});
                markLikeDislike(data, likedQuestionsIds, disLikedQuestionsIds);
                return data;
            }else if(status == "Correct"){
    
                var solvedQuestionsSolutions = questionBankHistory[0].attempted;
                var correctlySolvedQuestionIds = solvedQuestionsSolutions.filter(function(solution) {
                        return solution.isCorrect === true;
                }).map(function(solution) {
                    return solution.questionId;
                });
    
                if(choice == "Liked"){
                    const correctlySolvedLikedQuestionIds = correctlySolvedQuestionIds.filter(function(value) {
                        return likedQuestionsIds.includes(value);
                    });
                    questionFilter.questionId = { $in: correctlySolvedLikedQuestionIds };
                    totalCount = correctlySolvedLikedQuestionIds.length;
                }else if(choice == "Disliked"){
                    const correctlySolvedDislikedQuestionIds = correctlySolvedQuestionIds.filter(function(value) {
                        return disLikedQuestionsIds.includes(value);
                    });
                    questionFilter.questionId = { $in: correctlySolvedDislikedQuestionIds };
                    totalCount = correctlySolvedDislikedQuestionIds.length;
                }else{
                    questionFilter.questionId = { $in: correctlySolvedQuestionIds };
                    totalCount = correctlySolvedQuestionIds.length;
                }
    
                var filteredQuestions = await client.db("questions")
                .collection("questions")
                .find(questionFilter)
                .skip((pageNo-1)*pageSize)
                .limit(pageSize)
                .toArray();
    
                solvedQuestionsSolutions.forEach(function(solution) {
                    var matchingQuestion = filteredQuestions.find(function(question) {
                      return question.questionId === solution.questionId;
                    });
                  
                    if (matchingQuestion) {
                        matchingQuestion.selectedOption = solution.selectedOption;
                        matchingQuestion.isCorrect = solution.isCorrect;
                    }
                });
    
                var data = filteredQuestions;
                data.push({ totalQuestions: totalCount});
                markLikeDislike(data, likedQuestionsIds, disLikedQuestionsIds); 
                return data;
            }else if(status == "Wrong"){
    
                var solvedQuestionsSolutions = questionBankHistory[0].attempted;
                var wronglySolvedQuestionIds = solvedQuestionsSolutions.filter(function(solution) {
                        return solution.isCorrect === false;
                }).map(function(solution) {
                    return solution.questionId;
                });
    
                if(choice == "Liked"){
                    var wronglySolvedLikedQuestionIds = wronglySolvedQuestionIds.filter(function(value) {
                        return likedQuestionsIds.includes(value);
                    });
                    questionFilter.questionId = { $in: wronglySolvedLikedQuestionIds };
                    totalCount = wronglySolvedLikedQuestionIds.length;
                }else if(choice == "Disliked"){
    
                    var wronglyDislikedSolvedQuestionIds = wronglySolvedQuestionIds.filter(function(value) {
                        return disLikedQuestionsIds.includes(value);
                    });
                    questionFilter.questionId = { $in: wronglyDislikedSolvedQuestionIds };
                    totalCount = wronglyDislikedSolvedQuestionIds.length;
                }else{
                    questionFilter.questionId = { $in: wronglySolvedQuestionIds };
                    totalCount = wronglySolvedQuestionIds.length;
                }
    
                var filteredQuestions = await client.db("questions")
                .collection("questions")
                .find(questionFilter)
                .skip((pageNo-1)*pageSize)
                .limit(pageSize)
                .toArray();
    
                solvedQuestionsSolutions.forEach(function(solution) {
                    var matchingQuestion = filteredQuestions.find(function(question) {
                      return question.questionId === solution.questionId;
                    });
                  
                    if (matchingQuestion) {
                        matchingQuestion.selectedOption = solution.selectedOption;
                        matchingQuestion.isCorrect = solution.isCorrect;
                    }
                });
    
                var data = filteredQuestions;
                data.push({ totalQuestions: totalCount});
                markLikeDislike(data, likedQuestionsIds, disLikedQuestionsIds);
                return data;
            }
        }else if(choice != null && choice != ""){
    
            var totalCount = 0;
            if(choice == "Liked"){
                questionFilter.questionId = { $in: likedQuestionsIds };
                totalCount = likedQuestionsIds.length;
            }else if(choice == "Disliked"){
                questionFilter.questionId = { $in: disLikedQuestionsIds };
                totalCount = disLikedQuestionsIds.length;
            }
    
            var filteredQuestions = await client.db("questions")
            .collection("questions")
            .find(questionFilter)
            .sort({ rating: -1 })
            .skip((pageNo-1)*pageSize)
            .limit(pageSize)
            .toArray();
    
            var data = filteredQuestions;
            data.push({ totalQuestions: totalCount});
            markLikeDislike(data, likedQuestionsIds, disLikedQuestionsIds);
            return data;
        }
    
        var solvedQuestionsSolutions = questionBankHistory[0].attempted;
        var totalCount = 0;
        var solvedQuestionIds = solvedQuestionsSolutions.map(function(obj) {
            return obj.questionId;
        });
        questionFilter.questionId = { $nin: solvedQuestionIds };

        totalCount = await getQuestionsCount(questionFilter);

        var data = await client.db("questions")
        .collection("questions")
        .find(questionFilter)
        .skip((pageNo-1)*pageSize)
        .limit(pageSize)
        .toArray();
        data.push({ totalQuestions: totalCount});
        markLikeDislike(data, likedQuestionsIds, disLikedQuestionsIds);
        return data;
    }catch (e) {
        console.error(e);
        return [];
    }
}

export async function getQuestionsCount(questionFilter){
    try{
        const client = await clientPromise;
        const totalCount = await client.db("questions")
            .collection("questions")
            .countDocuments(questionFilter);
        return totalCount;
    }catch (e){
        console.error(e);
        return 0;
    }
}

function markLikeDislike(data, likedQuestionsIds, disLikedQuestionsIds){
    for(let i = 0; i < data.length; i++){
        if(likedQuestionsIds.includes(data[i].questionId)){
            data[i].likedByMe = true;
        }else if(disLikedQuestionsIds.includes(data[i].questionId)){
            data[i].dislikedByMe = true;
        }
    }
}