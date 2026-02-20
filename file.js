let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset_btn");
let newGameBtn = document.querySelector("#new_game_btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
const turnIndicator = document.querySelector("#current-player");

let turnO = true; 
let isBotMode = false; // Default is friend mode
let gameActive = true;

const winPatterns = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8], 
    [1, 4, 7], [2, 5, 8], [3, 4, 5],
    [6, 7, 8], [2, 4, 6]
];

// Mode Selection Logic
document.getElementById("bot_mode").addEventListener("click", (e) => {
    isBotMode = true;
    e.target.classList.add("active");
    document.getElementById("friend_mode").classList.remove("active");
    resetGame();
});

document.getElementById("friend_mode").addEventListener("click", (e) => {
    isBotMode = false;
    e.target.classList.add("active");
    document.getElementById("bot_mode").classList.remove("active");
    resetGame();
});

const resetGame = () => {
    turnO = true;
    gameActive = true;
    enableBoxes();
    msgContainer.classList.add("hide");
    turnIndicator.innerText = "O";
};

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (!gameActive || box.innerText !== "") return;

        // Player Move
        handleMove(box, turnO ? "O" : "X");

        // Bot Move Logic
        if (isBotMode && gameActive && !turnO) {
            // Briefly disable board so player can't click during bot "thinking"
            disableBoxes(); 
            setTimeout(() => {
                const botBox = getBestMove();
                if (botBox) handleMove(botBox, "X");
                if (gameActive) enableEmptyBoxes();
            }, 500); 
        }
    });
});

const handleMove = (box, symbol) => {
    box.innerText = symbol;
    box.style.color = symbol === "O" ? "#ffffff" : "#5a189a";
    box.disabled = true;
    
    let win = checkWinner();
    
    if (!win) {
        turnO = !turnO;
        turnIndicator.innerText = turnO ? "O" : "X";
    }
};

const getBestMove = () => {
    // 1. Try to win or block player
    const move = findStrategyMove("X") || findStrategyMove("O");
    if (move) return move;

    // 2. Otherwise, pick a random available box
    const emptyBoxes = Array.from(boxes).filter(b => b.innerText === "");
    return emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
};

const findStrategyMove = (symbol) => {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const vals = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
        
        // If two spots are taken by the same symbol and the third is empty
        if (vals.filter(v => v === symbol).length === 2 && vals.includes("")) {
            return boxes[pattern[vals.indexOf("")]];
        }
    }
    return null;
};

const enableEmptyBoxes = () => {
    boxes.forEach(box => {
        if (box.innerText === "") box.disabled = false;
    });
};

const disableBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};

const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
};

const showWinner = (winner) => {
    msg.innerText = `Winner is ${winner}!`;
    msgContainer.classList.remove("hide");
    gameActive = false;
    disableBoxes();

    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5a189a', '#c77dff', '#ffffff']
    });
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let p1 = boxes[pattern[0]].innerText;
        let p2 = boxes[pattern[1]].innerText;
        let p3 = boxes[pattern[2]].innerText;

        if (p1 !== "" && p1 === p2 && p2 === p3) {
            showWinner(p1);
            return true;
        }
    }

    let fillCount = Array.from(boxes).filter(b => b.innerText !== "").length;
    if (fillCount === 9) {
        msg.innerText = "It's a Draw! 🤝";
        msgContainer.classList.remove("hide");
        gameActive = false;
        return true;
    }
    return false;
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
