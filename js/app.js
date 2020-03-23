import Question from "./Question.js";
import Quiz from "./Quiz.js";

// const q1 = new Question(
//     "What's 2 + 2?",
//     [2,3,4,5],
//     2
// );
// const q2 = new Question(
//     "First president of US?",
//     ["AL", "George", "Barrack", "Johnny"],
//     1
// );


// const qArray = [q1, q2];

// const myQuiz = new Quiz(qArray);

// console.log(myQuiz.getCurrentQuestion());
// //button next
// // myQuiz.nextIndex();
// console.log(myQuiz.getCurrentQuestion());

// const App = (function() {
//     let counter = 0;

//     const doubleCounter = () =>{
//         counter*=2;
//     }

//     const incrementCounter = () => {
//         counter++;
//     }

//     const getCounter = () =>{
//         return counter;
//     }

//     const setCounter = (newNum) => {
//         counter = newNum;
//     }

//     //public methods
//     return {
//         get: getCounter,
//         set: setCounter
//     }
// })();

// console.log(App.get()); //0
// App.set(2);
// console.log(App.get()); //2


const App = (() => {
    //cache the DOM
    const quizEl = document.querySelector(".jabquiz");
    const quizQuestionsEl = document.querySelector(".jabquiz__question");
    const trackerEl = document.querySelector(".jabquiz__tracker");
    const taglineEl = document.querySelector(".jabquiz__tagline");
    const choicesEl = document.querySelector(".jabquiz__choices");
    const progressInnerEl = document.querySelector(".progress__inner");
    const nextButtonEl = document.querySelector(".next");
    const restartButtonEl = document.querySelector(".restart");

    const q1 = new Question(
        "First President of the US?",
        ["Barrack", "Osama", "George", "Monkey"],
        2
    )
   const q2 = new Question(
        "When was Javascript created?",
        ["June 1995", "May 1995", "July 1885", "Sep 1996"],
        1
    )
   const q3 = new Question(
        "What does CSS stand for?",
        ["County Sheriff Service", "Cascading sexy sheets", "Cascading Style Sheets", "Collecting Sleek Stealth"],
        2
    )
   const q4 = new Question(
        "The full form of HTML is...",
        ["Hyper Text Markup Language", "Hold the Mic Lingo", "ERROR", "Hyper Tension Mixture Liquid"],
        0
    )
   const q5 = new Question(
        "console.log(typeof []) would return what?",
        ["Array", "Object", "Null", "number"],
        1
    )

    const quiz = new Quiz([q1, q2, q3, q4, q5]);

    const listeners = _ => {
        nextButtonEl.addEventListener("click", function(){
            const selectedRadioElem = document.querySelector('input[name="choice"]:checked');
            if (selectedRadioElem){
                const key = Number(selectedRadioElem.getAttribute("data-order"));
                quiz.guess(key);
                renderAll();
            }
        })
        restartButtonEl.addEventListener("click", function (){
           //1.reset the quiz
           quiz.reset();
           //2. renderAll
           renderAll();
           //3.reset the tagline
           setValue(taglineEl, `Pick an option below!`);
           //4. restore the next button
           nextButtonEl.style.opacity = 1;
        })
    }

    const setValue= (elem, value) => { // render question value
        elem.innerHTML = value;
    }

    const renderQuestion = _ =>{
        const question = quiz.getCurrentQuestion().question;
        setValue(quizQuestionsEl, question);
        quizQuestionsEl.innerHTML = question;
    }

    const renderChoicesElements = _ => {
        let markup = "";
        const currentChoices = quiz.getCurrentQuestion().choices;
        currentChoices.forEach((elem, index) => {
            markup += `
                <li class="jabquiz__choice">
                   <input type="radio" name="choice" class="jabquiz__input" data-order= "${index}" id="choice${index}">
                   <label for="choice${index}" class="jabquiz__label">
                   <i></i>
                   <span>${elem}</span>
                   </label>
                </li>
            `
        });
        setValue(choicesEl, markup);
    }
    
    const renderTracker = _ => {
        const index = quiz.currentIndex;
        setValue(trackerEl, `${index+1} of ${quiz.questions.length}`)
    }

    const getPercentage = (num1, num2) => {
        return Math.round((num1/num2)*100);
    }

    const launch = (width, maxPercent) => {
        let loadingBar = setInterval(function() {
            if (width > maxPercent){
                clearInterval(loadingBar);
            } else{
                width++;
                progressInnerEl.style.width = width + "%";
            }
        }, 3)
    }



    const renderProgress = _ =>{
        //1. width
        const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length);
        //2. launch(0,width)
        launch(0,currentWidth);
    }

    const renderEndScreen = _ =>{
        setValue(quizQuestionsEl, `Great Job!`);
        setValue(taglineEl, `Complete!`);
        setValue(trackerEl, `Your score: ${getPercentage(quiz.score, quiz.questions.length)}%`);
        nextButtonEl.style.opacity = 0;
        renderProgress();
    }

    const renderAll = _ =>{
        if (quiz.hasEnded()){
            //renderEndScreen
            renderEndScreen();
        } else {
            //1. render the question
            renderQuestion();
            //2. Render the choices elements
            renderChoicesElements();
            //3. Render the tracker
            renderTracker();
            //4. Render the progress
            renderProgress();
        }
    }
    return {
        renderAll: renderAll,
        listeners: listeners
    }
})();

App.renderAll();
App.listeners();