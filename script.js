
function GameBoard() {

    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++)
    {
        board[i] = [];
        for(let j = 0; j < columns; j++)
        {
            board[i][j] = "";
        }
    }

    const getBoard = () => board;

    const fillCell = (player,row,column) => {

        if(board[row][column]==="")
        {
            board[row][column] = player.mark;
        }
        
    };



    return{getBoard,fillCell}

};



const player = (name, mark) => {
    return{name, mark};
}

// TODO: encapsulate these variable somewhere
let players = [];

const playAgain = document.querySelector(".new-round");



function GameFlow()
{

    const board = GameBoard();

    let gameOver = false;

    const isOver = () => gameOver;

    let activePlayer;
    
    for(let i = 0; i < players.length; i++)
    {
        if(players[i].mark === "X")
        {
            activePlayer = players[i];
        }
        
    }


    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0]? players[1]:players[0];
    }

    const getActivePlayer = () => activePlayer;
    
    const messageOutput = document.querySelector(".message-output")
    const printNewRound = () => {
        messageOutput.textContent = `${getActivePlayer().name}'s turn.`;
    }



    function checkForWinner(player)
    {

        const playerWinCondition = [player.mark,player.mark,player.mark];
        const currentboard = board.getBoard();
        const threeInRow = [];

        for(let i = 0; i < currentboard.length; i++)
        {
            threeInRow.push(currentboard[i]);
            //get column arrays
            threeInRow.push(currentboard.map((row) => row[i]));
        }

        //get diagonal arrays
        threeInRow.push(currentboard.map((row, rowIndex) => row[rowIndex]));
        threeInRow.push(currentboard.slice().reverse().map((row,rowIndex) => row[rowIndex]));

        for(let i = 0; i < threeInRow.length; i++)
        {

            if(JSON.stringify(threeInRow[i])  === JSON.stringify(playerWinCondition))
            {
                return true;
                
            }

        }
        return false;

    }

    function checkForTie()
    {
        const currentboard = board.getBoard();
        
        for(let i = 0; i < currentboard.length; i++)
        {
            for(let j = 0; j < currentboard[i].length; j++)
            {
                if(currentboard[i][j] === "")
                {
                    return false;
                }
            }
        }
        return true;
    }

    const playRound = (row,column) =>{
        board.fillCell(getActivePlayer(),row,column);
        if(checkForWinner(getActivePlayer()))
        {
            messageOutput.textContent =`${getActivePlayer().name} is the winner!`;
            playAgain.removeAttribute("disabled");
            gameOver = true;
        }
        else if(checkForTie())
        {
            messageOutput.textContent = "It's a tie!";
            playAgain.removeAttribute("disabled");
            gameOver = true;
        }
        else
        {
            switchPlayerTurn();  
            printNewRound();
        }

    }

    printNewRound();

    return{
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        isOver
    };
}


function ScreenController() {

    const game = GameFlow();
    
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();

        //const activePlayer = game.getActivePlayer();

        board.forEach((row,yAxis) => {
            row.forEach((cell,xAxis) => {
                
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                if(xAxis === 2)
                {
                    cellButton.classList.add("no-r");
                }
                if(yAxis === 2)
                {
                    cellButton.classList.add("no-b");
                }

                cellButton.dataset.row = yAxis;
                cellButton.dataset.column = xAxis;
                cellButton.textContent = cell;
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        const taken = e.target.textContent === ""? false:true;
        

        if(!selectedRow || !selectedColumn || taken || game.isOver())
        {
            return;
        }


        game.playRound(selectedRow,selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();


}


function dialogHandler()
{
    const showButton = document.querySelector(".new-game");
    const openingDialog = document.querySelector("#start-game-dialog");
    const startBtn = openingDialog.querySelector("#start-game");
    const playerOne = openingDialog.querySelector("#username-one");
    const playerTwo = openingDialog.querySelector("#username-two");

    // show dialog
    showButton.addEventListener("click", () => {
        openingDialog.showModal();
    });

    showButton.click();


    startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if(playerOne.value === "")
        {
            playerOne.value = playerOne.getAttribute("placeholder");
        }
        if(playerTwo.value === "")
        {
            playerTwo.value = playerTwo.getAttribute("placeholder");
        }
        players = [player(`${playerOne.value}`, "X"),player(`${playerTwo.value}`, "O")];
        playerOne.value = "";
        playerTwo.value = "";
        ScreenController();
        openingDialog.close();
    })

}

dialogHandler();


// TODO: encapsulate this event listener somewhere
playAgain.addEventListener("click", () =>{
    playAgain.setAttribute("disabled","disabled");
    ScreenController();
});
