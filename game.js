const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const nextButton = document.getElementById("nextButton");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];


// **** API ****
// fetch(
//     "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple"

// )
// .then(res => {
//     return res.json();
// })
// .then(loadedQuestions => {
//     console.log(loadedQuestions.results);
//     questions = loadedQuestions.results.map ( loadedQuestion => {
//         const formattedQuestion = {
//             question: loadedQuestion.question
//         };

//     const answerChoices = [...loadedQuestion.incorrect_answers]; 
//     formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
//     answerChoices.splice(formattedQuestion.answer -1, 0,
//     loadedQuestion.correct_answer);

//     answerChoices.forEach((choice, index) => {
//         formattedQuestion["choice" + (index+1)] = choice;
//     })

//     return formattedQuestion;
//     });
//     
//     

    
//     startGame();
// })
// .catch(err => {
//     console.error(err);
// });

// **** NO API ****

fetch("questions.json")
.then(res => {
    return res.json();
})
.then(loadedQuestions => {
    console.log(loadedQuestions); 
    questions = loadedQuestions;
    startGame();
})
.catch(err => {
    console.error(err);
});


//CONSTATS
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 20;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
    nextButton.classList.add("hidden");
};

// getNewQuestion = () => {

//     if(availableQuestions.length == 0 || questionCounter > MAX_QUESTIONS) {
//         localStorage.setItem("mostRecentScore", score);
//         //go to the end page
//         return window.location.assign("/end.html");
//     }
//     questionCounter++;
//     progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
//     //Update the progress bar
//     progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

//     const questionIndex = Math.floor(Math.random() * availableQuestions.length);
//     currentQuestion = availableQuestions[questionIndex];
//     question.innerText = currentQuestion.question;

//     choices.forEach(choice => {
//         const number = choice.dataset["number"];
//         choice.innerText = currentQuestion["choice" + number];
//     });

//     availableQuestions.splice(questionIndex, 1);

//     acceptingAnswers = true;
// };

document.getElementById('backButton').addEventListener('click', () => {
    window.location.assign("/");
});

getNewQuestion = () => {
    if (questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("/end.html");
    }

    questionCounter++;
    progressText.innerText = `Fråga ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
        choice.parentElement.classList.remove("correct", "incorrect"); 
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

// getNewQuestion = () => {
//     if (availableQuestions.length == 0 || questionCounter > MAX_QUESTIONS) {
//         localStorage.setItem("mostRecentScore", score);

//         return window.location.assign("/end.html");
//     }
//     questionCounter++;
//     progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

//     progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

//     const questionIndex = Math.floor(Math.random() * availableQuestions.length);
//     currentQuestion = availableQuestions[questionIndex];
//     question.innerText = currentQuestion.question;

//     choices.forEach(choice => {
//         const number = choice.dataset["number"];
//         choice.innerText = currentQuestion["choice" + number];
//         choice.parentElement.classList.remove("correct", "incorrect"); 
//     });

//     availableQuestions.splice(questionIndex, 1);

//     acceptingAnswers = true;
// };

// choices.forEach(choice => {
//     choice.addEventListener("click", e => {
//         if(!acceptingAnswers) return;

//         acceptingAnswers = false;
//         const selectedChoice = e.target;
//         const selectedAnswer = selectedChoice.dataset["number"];

//         const classToApply = 
//             selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

//         if (classToApply == "correct") {
//             incrementScore(CORRECT_BONUS);
//         }    
        
//         selectedChoice.parentElement.classList.add(classToApply);

//         setTimeout( () => {
//             selectedChoice.parentElement.classList.remove(classToApply);
//             getNewQuestion();
//         }, 1000);
//     });
// });
choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = 
            selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply == "correct") {
            incrementScore(CORRECT_BONUS);
        } else {
            // Visa det korrekta svaret
            const correctChoice = choices.find(choice => 
                choice.dataset["number"] == currentQuestion.answer
            );
            correctChoice.classList.add("correct");
        }

        selectedChoice.parentElement.classList.add(classToApply);
        nextButton.classList.remove("hidden"); 

        choices.forEach(choice => {
            choice.style.pointerEvents = 'none'; 
        });
    });
});

nextButton.addEventListener("click", () => {
    nextButton.classList.add("hidden");
    choices.forEach(choice => {
        choice.classList.remove("correct", "incorrect"); 
        choice.style.pointerEvents = 'auto';
    });
    getNewQuestion();
});

incrementScore = num =>{
    score += num;
    scoreText.innerText = score;
}
