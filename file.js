let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset_btn");
let newGameBtn = document.querySelector("#new_game_btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
const turnIndicator = document.querySelector("#current-player");

let turnO = true; // true for O, false for X

const winPatterns = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8], 
    [1, 4, 7], [2, 5, 8], [3, 4, 5],
    [6, 7, 8], [2, 4, 6]
];

const resetGame = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");
    turnIndicator.innerText = "O";
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            box.innerText = "O";
            box.style.color = "#ffffff"; 
            turnIndicator.innerText = "X";
            turnO = false;
        } else {
            box.innerText = "X";
            box.style.color = "#5a189a"; 
            turnIndicator.innerText = "O";
            turnO = true;
        }
        box.disabled = true;
        checkWinner();
    });
});

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

const showWinner = (winner) => {
    msg.innerText = `Winner is ${winner}!`;
    msgContainer.classList.remove("hide");
    disableBoxes();

    // Trigger Confetti
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5a189a', '#c77dff', '#ffffff']
    });
};

const checkWinner = () => {
    let isWin = false;
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val !== "" && pos1Val === pos2Val && pos2Val === pos3Val) {
            showWinner(pos1Val);
            isWin = true;
            return;
        }
    }

    // Check for Draw
    let fillCount = 0;
    boxes.forEach(box => {
        if (box.innerText !== "") fillCount++;
    });

    if (fillCount === 9 && !isWin) {
        msg.innerText = "It's a Draw! 🤝";
        msgContainer.classList.remove("hide");
        disableBoxes();
    }
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
