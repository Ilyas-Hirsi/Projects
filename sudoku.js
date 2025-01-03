const board_size = 9;
let board;
let current_input = 1;
let start_board;
let currecnt_cell = null;
let difficulty  = "medium"
let cheated = false
function update_cell(event) {
  const cell = event.target;
  const row = Number(cell.id.charAt(4))-1
  const col = Number(cell.id.charAt(6))-1
  if (!cell) return;
  if(cell.classList.contains("dynamic")){
    board[row][col] = ""
    if(!isValid(row,col,current_input)){
      cell.style.backgroundColor = "lightcoral"
    }
    else{
      cell.style.backgroundColor = "#ebebeb"
    }
  cell.textContent = current_input;
    board[row][col] = current_input;
}
}

function reset_board(){
  
  board = structuredClone(start_board)
  let cell;
  for (let i = 0; i < 9; i++){
    for (let j = 0; j < 9; j++){
      cell = document.getElementById(`cell${i + 1}-${j + 1}`)
      if (cell.style.backgroundColor == "lightcoral") {
        cell.style.backgroundColor = "#ebebeb"
        
      }
      cell.textContent = board[i][j]
    }
  }
}

function initialize_board() {
  let r, k;
  for (let i = 0; i < 1; i++) {
    for (let j = i * 3; j < (i + 1) * 3; j++) {
      k = i * 3;
      while (k < (i + 1) * 3) {
        r = Math.floor(Math.random() * 9) + 1;
        if (isValid(j, k, r.toString())) {
          board[j][k] = r.toString();
          k += 1;
          
        }
      }
    }
  }
  
}

function remove_n_cells(n){
  let rand,row,col
  row = 0
  col = 0
  while(n > 0){
     
    rand = Math.floor(Math.random()*3)
    if (rand == 0 && board[row][col] != ""){
      board[row][col] = ""
      
      n -=1
    }
    
    if (row == 8 && col == 8) {
      row = 0
      col = 0
    }
    else if (col == 8) {
      col = 0
      row +=1
    }
    else{
      col +=1
    }

  }
}

function solve() {
  cheated = true
  board = structuredClone(start_board)
  let cell
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cell = document.getElementById(`cell${i + 1}-${j + 1}`)
      if (cell.style.backgroundColor == "lightcoral"){
        board[i][j] = ""
        cell.style.backgroundColor = "#ebebeb"
      }
    }
  }
 
  if (fill_board()) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        cell = document.getElementById(`cell${i + 1}-${j + 1}`)
        cell.textContent = board[i][j];
        if (cell.classList.contains("dynamic")) cell.style.backgroundColor = "#ebebeb"

        
      }
    }
  } else {
    alert("No solution exists!");
  }
}

function fill_board(row = 0, col = 0) {
  if (row == 9) return true;
   if (col == 9) return fill_board(row + 1, 0);
   if (board[row][col] !== "") return fill_board(row, col + 1);
   
    for (let num = 1; num < 10; num++) {
      if (isValid(row,col,num.toString())) {
        board[row][col] = num.toString();
        if (fill_board(row, col + 1)) return true;
        board[row][col] = "";
      }
    }
    return false;
  
}

function isValid(row,col,val){
  if ( board[row].includes(val)) return false;
  for (let i = 0; i < 9; i++) {
    if (board[i][col] == val) return false;
  }

   let [top, left] = [Math.floor(row / 3) * 3, Math.floor(col / 3) * 3];
    for (let i = top; i < top + 3; i++) {
        for (let j = left; j < left + 3; j++) {
            if (board[i][j] === val) return false;
        }
    }
  return true
}
function section_has_value(sec_x, sec_y, cell_value) {
  for (let i = sec_x * 3; i < (sec_x + 1) * 3; i++) {
    for (let j = sec_y * 3; j < (sec_y + 1) * 3; j++) {
      if (board[i][j] == cell_value) return true;
    }
  }
  return false;
}
function select_input(event){
  document.getElementById(current_input.toString()).style.backgroundColor = "white"
  const button = event.target
  current_input = button.id
  document.getElementById(current_input.toString()).style.backgroundColor = "lightblue"
}
function verify_board(){
  let unfilled = 0, incorrect = 0,cell
  for (let i =0; i< 9; i++){
    for (let j =0; j< 9; j++){
      cell = document.getElementById(`cell${i + 1}-${j + 1}`)
      if (cell.style.backgroundColor == "lightcoral"){
        incorrect +=1
      }
      if (cell.textContent == "") unfilled +=1
    }
  }
  if (unfilled != 0 && incorrect != 0){
    alert(`This puzzle is not yet solved. \n${unfilled} unfilled tile(s) remain(s), and ${incorrect} incorrect tile(s) remain(s)`)
  }
  else if (unfilled != 0){
    alert(`This puzzle is not yet solved. \n${unfilled} unfilled tile(s) remain(s)`)
  }
  else if (incorrect != 0) alert(`This puzzle is not yet solved. \n${incorrect} incorrect tile(s) remain(s)`)
  else if (cheated == true) alert("The puzzle has been completed with the 'Solve Puzzle' button. Now try to solve a new board without the button.")
    else alert("Congratulations, you have completed the Sudoku puzzle. Press 'Create New Game' to start a new puzzle")
}
function createBoard() {
  cheated = false
  document.getElementById("buttons").style.visibility = "visible"
  const b = document.getElementById("Board");
  b.innerHTML = "";
   board = Array.from({ length: 9 }, () => Array(9).fill(""));
    initialize_board();
    fill_board();
    remove_n_cells(60);
    start_board = structuredClone(board)
    
   
  for (let i = 0; i < board_size; i++) {
    const row = document.createElement("tr");

    for (let j = 0; j < board_size; j++) {
      const cell = document.createElement("td");
      cell.id = `cell${i + 1}-${j + 1}`;
      cell.textContent = board[i][j];
      if(cell.textContent == ""){
        cell.textContent = ""
      cell.classList.add("dynamic")
      cell.style.backgroundColor = "#ebebeb"
      cell.addEventListener("click", update_cell);
      }
      row.appendChild(cell);

      
    }
    b.appendChild(row);
    const button = document.getElementById(`${i+1}`)
    
    button.addEventListener("click", select_input)
  }
  
  
}

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("createGame").addEventListener("click", createBoard);
  document.getElementById("solve").addEventListener("click", solve);
  document.getElementById("verify").addEventListener("click", verify_board);
  document.getElementById("reset").addEventListener("click",reset_board);
});