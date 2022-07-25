const baseURL = 'https://opentdb.com/api.php?amount=1&category=18&type=multiple';
const containerEl = document.querySelector(".container");
const form = document.querySelector("#quiz_form");
const qusEl = document.querySelector(".qus");
const optionEl = document.querySelector(".all_options");
const buttonEl = document.querySelector(".buttons");
const scoreEl = document.querySelector(".scoreBoard .score-num");
const answeredEl = document.querySelector(".scoreBoard .answered-num");
const section = document.getElementsByTagName('section')[0];
let startBtn = document.getElementById('bttn');
const sel = document.getElementById('sel');
const nm = document.getElementById('nm');
let prevScore = document.getElementById('saved');
startBtn.addEventListener('click', startQuiz);

function startQuiz() {
    section.classList.remove('hide');
    startBtn.classList.add('hide');
    sel.classList.add('hide');
    nm.innerHTML = "Khaled Ahmed";
    startTime();
}

let question, answer;
let options = [];
let score = 0;
let answeredQus = 0;

window.addEventListener('DOMContentLoaded', quizApp);

async function quizApp(savedScore, savedQ) {
    addPlaceHolder();
    updateScoreBoard();
    const data = await fetchQuiz();
    question = data[0].question;
    options = [];
    answer = data[0].correct_answer;
    data[0].incorrect_answers.map(option => options.push(option));
    options.splice(Math.floor(Math.random() * options.length + 1), 0, answer);
    // console.log(options, answer);
    console.log(answer);

    generateTemplate(question, options);

    prevScore.innerHTML = `Last Grade : ${savedScore} | ${savedQ}`;
};



form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (e.target.quiz.value) {
        // console.log('you submitted this quiz');
        checkQuiz(e.target.quiz.value);
        e.target.querySelector('button').style.display = 'none';
        generateButtons();
    } else {
        return
    }
})




async function fetchQuiz() {
    const response = await fetch(baseURL);
    const data = await response.json();
    // console.log(data);
    // console.log(data.results);
    return data.results;
};





function generateTemplate(question, options) {
    removePlaceHolder();
    optionEl.innerHTML = '';
    qusEl.innerText = question;

    options.map((option, index) => {
        const item = document.createElement('div');
        item.classList.add('option');
        item.innerHTML = `
        <input type="radio" id="option${index + 1}" value="${option}" name="quiz">
        <label for="option${index + 1}">${option}</label>`;
        optionEl.appendChild(item);
    })
};





function checkQuiz(selected) {
    answeredQus++;
    if (selected === answer) {
        score++;
    }

    updateScoreBoard();
    form.quiz.forEach(input => {
        if (input.value === answer) {
            input.parentElement.classList.add('correct');
        }
    });
}





function updateScoreBoard() {
    scoreEl.innerText = score;
    answeredEl.innerText = answeredQus;
};






function generateButtons() {
    const prevBtn = document.createElement('button');
    prevBtn.innerText = 'Previous';
    prevBtn.setAttribute('type', 'button');
    prevBtn.classList.add('prev-btn');
    buttonEl.appendChild(prevBtn);


    const finishBtn = document.createElement('button');
    finishBtn.innerText = 'Finish';
    finishBtn.setAttribute('type', 'button');
    finishBtn.classList.add('finish-btn');
    buttonEl.appendChild(finishBtn);


    const nextBtn = document.createElement('button');
    nextBtn.innerText = 'NexT';
    nextBtn.setAttribute('type', 'button');
    nextBtn.classList.add('next-btn');
    buttonEl.appendChild(nextBtn);


    finishBtn.addEventListener('click', finishQuiz);
    nextBtn.addEventListener('click', getNextQuiz);
    prevBtn.addEventListener('click', getPrevQuiz);
}

function getNextQuiz() {
    const nextBtn = document.querySelector('.next-btn');
    const finishBtn = document.querySelector('.finish-btn');
    const prevBtn = document.querySelector('.prev-btn');

    buttonEl.removeChild(nextBtn);
    buttonEl.removeChild(finishBtn);
    buttonEl.removeChild(prevBtn);


    buttonEl.querySelector('button[type="submit"]').style.display = 'block';


    quizApp();
}


function getPrevQuiz() {
    // console.log('prev');
    const nextBtn = document.querySelector('.next-btn');
    const finishBtn = document.querySelector('.finish-btn');
    const prevBtn = document.querySelector('.prev-btn');

    buttonEl.removeChild(nextBtn);
    buttonEl.removeChild(finishBtn);
    buttonEl.removeChild(prevBtn);


    buttonEl.querySelector('button[type="submit"]').style.display = 'block';


    quizApp();
}






function finishQuiz() {
    const nextBtn = document.querySelector('.next-btn');
    const finishBtn = document.querySelector('.finish-btn');
    const prevBtn = document.querySelector('.prev-btn');

    buttonEl.removeChild(nextBtn);
    buttonEl.removeChild(finishBtn);
    buttonEl.removeChild(prevBtn);




    buttonEl.querySelector('button[type="submit"]').style.display = 'block';

    const overlay = document.createElement('div');
    overlay.classList.add('result-overlay');
    if (score > (answeredQus / 2))
        overlay.classList.add('success');
    else {
        overlay.classList.add('fail');
    }

    overlay.innerHTML = `
    <h3>Khaled Ahmed</h3>
    <div class="final-result">${score} | ${answeredQus}</div>
    <button>Quiz Again</button>
    `


    containerEl.appendChild(overlay);

    overlay.querySelector('button').addEventListener('click', () => {
        containerEl.removeChild(overlay);
        playAgain();
    });
};



function playAgain() {
    let savedScore, savedQ;
    savedScore = score;
    score = 0;

    savedQ = answeredQus;
    answeredQus = 0;

    quizApp(savedScore, savedQ);
    startTime();
};


function addPlaceHolder() {
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');
    containerEl.appendChild(placeholder);
};



function removePlaceHolder() {
    const placeholder = document.querySelector('.placeholder');
    containerEl.removeChild(placeholder);
}




let timedis = document.getElementById('timer');
timedis.innerText = '00:00';

let aud = new Audio('beep.mp3');
let secs = 0;
let mins = 0;
let timer = 2;
let timerid;

function startTime() {
    timerid = setInterval(function () {
        timedis.innerText = "0" + mins + " : " + "0" + secs;
        secs++;

        if (secs > 9) {
            timedis.innerText = "0" + mins + " : " + secs;
            if (secs > 59) {
                secs = 0;
                mins++;
                timedis.innerText = "0" + mins + " : " + "0" + secs;
            }
        }

        if (mins == timer) {
            aud.play();
            clearInterval(timerid);




            // const nextBtn = document.querySelector('.next-btn');
            // const finishBtn = document.querySelector('.finish-btn');
            // const prevBtn = document.querySelector('.prev-btn');

            // buttonEl.removeChild(nextBtn);
            // buttonEl.removeChild(finishBtn);
            // buttonEl.removeChild(prevBtn);




            buttonEl.querySelector('button[type="submit"]').style.display = 'block';

            const overlay = document.createElement('div');
            overlay.classList.add('result-overlay');
            if (score > (answeredQus / 2))
                overlay.classList.add('success');
            else {
                overlay.classList.add('fail');
            }

            overlay.innerHTML = `
            <h3>Khaled Ahmed</h3>
            <div class="final-result">${score} | ${answeredQus}</div>
            <button>Quiz Again</button>
            `

            containerEl.appendChild(overlay);

            overlay.querySelector('button').addEventListener('click', () => {
                containerEl.removeChild(overlay);
                score = 0;
                answeredQus = 0;
                quizApp();


            });


        }
    }, 1000)
}





