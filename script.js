const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const startButton = document.getElementById('start-button');

let score = 0;
let time = 30;
let lastHole;
let timerId;
let gameIsOver = false;

// Emojis para os monstrinhos
const badMoleEmoji = '😈';
const goodMoleEmoji = '😇';

function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    
    if (hole === lastHole) {
        return randomHole();
    }
    lastHole = hole;
    return hole;
}

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function showMole() {
    if (gameIsOver) return;
    
    const hole = randomHole();
    const mole = hole.querySelector('.mole');
    const isGoodMole = Math.random() < 0.2; // 20% de chance de ser um monstrinho bom

    if (isGoodMole) {
        mole.innerHTML = goodMoleEmoji;
        mole.classList.add('good-mole');
    } else {
        mole.innerHTML = badMoleEmoji;
        mole.classList.remove('good-mole');
    }

    const timeToAppear = randomTime(500, 1000);
    
    mole.classList.add('up');
    
    setTimeout(() => {
        mole.classList.remove('up');
        // Só chama a próxima se o jogo não tiver acabado
        if (!gameIsOver) {
            showMole();
        }
    }, timeToAppear);
}

function startGame() {
    // Reseta o jogo
    score = 0;
    time = 30;
    gameIsOver = false;
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = time;
    startButton.disabled = true;

    // Inicia o cronômetro
    timerId = setInterval(() => {
        time--;
        timeLeftDisplay.textContent = time;
        if (time === 0) {
            clearInterval(timerId);
            gameIsOver = true;
            alert(`Fim de Jogo! Sua pontuação foi: ${score}`);
            startButton.disabled = false;
        }
    }, 1000);

    showMole();
}

function hitMole(e) {
    if (gameIsOver) return;

    const clickedMole = e.target;

    // Se o clique foi em um monstrinho bom
    if (clickedMole.classList.contains('good-mole')) {
        gameIsOver = true;
        clearInterval(timerId);
        alert(`Você acertou o monstrinho do bem! Fim de Jogo. Sua pontuação foi: ${score}`);
        startButton.disabled = false;
        // Faz o monstrinho "bom" desaparecer para evitar cliques duplicados
        clickedMole.classList.remove('up');
        return;
    }
    
    // Se foi um monstrinho mau
    if (clickedMole.classList.contains('mole')) {
        score++;
        scoreDisplay.textContent = score;
        clickedMole.classList.remove('up');
    }
}

holes.forEach(hole => hole.addEventListener('click', hitMole));
startButton.addEventListener('click', startGame);