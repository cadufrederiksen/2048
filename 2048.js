let score = 0;

let isGameOver = false;

window.onload = function() {
	setGame();
}

window.addEventListener("DOMContentLoaded", () =>
	{
		const restartBtn = document.getElementById("restart-btn");
		if (restartBtn) restartBtn.addEventListener("click", () => restartGame());

		document.addEventListener("keyup", handleKeyUp);
	}
)


function handleKeyUp(event) {
	if (isGameOver) return;

	let moved = false;
	switch (event.key) {
		case "ArrowLeft":
			moved = moveLeft();
			break;
		case "ArrowUp":
			moved = moveUp();
			break;
		case "ArrowRight":
			moved = moveRight();
			break;
		case "ArrowDown":
			moved = moveDown();
			break;
		default:
			return;
	}

	if (moved) {
		createNewTile();
		// Defer game-over check to next paint so the newly spawned tile is visible before alert
		if (typeof requestAnimationFrame === "function") {
			requestAnimationFrame(() => {
				if (checkGameOver()) {
					isGameOver = true;
					alert("Game Over! Press Restart to play again.");
				}
			});
		} else {
			setTimeout(() => {
				if (checkGameOver()) {
					isGameOver = true;
					alert("Game Over! Press Restart to play again.");
				}
			}, 0);
		}
	}
}


function moveUp() {
	// Slide and merge all columns upwards
	let moved = false;
	let gained = 0;
	for (let x = 0; x < 4; x++) {
		const col = getCol(x);
		const { result, moved: m, scoreGain } = slideMergeLeft(col);
		setCol(x, result);
		if (m) moved = true;
		gained += scoreGain;
	}
	if (gained > 0) {
		score += gained;
		updateScoreUI();
	}
	return moved;
}

function moveDown() {
	// Slide and merge all columns downwards
	let moved = false;
	let gained = 0;
	for (let x = 0; x < 4; x++) {
		const col = getCol(x);
		const reversed = col.slice().reverse();
		const { result, moved: m, scoreGain } = slideMergeLeft(reversed);
		const final = result.reverse();
		setCol(x, final);
		if (m) moved = true;
		gained += scoreGain;
	}
	if (gained > 0) {
		score += gained;
		updateScoreUI();
	}
	return moved;
}

function moveLeft() {
	// Slide and merge all rows to the left
	let moved = false;
	let gained = 0;
	for (let i = 0; i < 4; i++) {
		const row = getRow(i);
		const { result, moved: m, scoreGain } = slideMergeLeft(row);
		setRow(i, result);
		if (m) moved = true;
		gained += scoreGain;
	}
	if (gained > 0) {
		score += gained;
		updateScoreUI();
	}
	return moved;
}

function moveRight() {
	// Slide and merge all rows to the right
	let moved = false;
	let gained = 0;
	for (let i = 0; i < 4; i++) {
		const row = getRow(i);
		const reversed = row.slice().reverse();
		const { result, moved: m, scoreGain } = slideMergeLeft(reversed);
		const final = result.reverse();
		setRow(i, final);
		if (m) moved = true;
		gained += scoreGain;
	}
	if (gained > 0) {
		score += gained;
		updateScoreUI();
	}
	return moved;
}

function setGame() {
	let grid = document.querySelector(".grid-container")

	for (let i = 0; i < 4; i++)
	{
		for (let x = 0; x < 4; x++)
		{
			let tile = document.createElement("div");
			tile.id = i.toString() + "-" + x.toString();//cria cada quadrado do board
			tile.classList.add("tile");
			grid.appendChild(tile);
		}
	}
	startGame();
}

function startGame() {
	isGameOver = false;
	updateScoreUI();
	createNewTile();	
	createNewTile();		
}

function restartGame() 
{
	for (let i = 0; i < 4; i++) {
		for (let x = 0; x < 4; x++) {
			const tile = document.getElementById(i.toString() + "-" + x.toString());
			updateTileAppearance(tile, 0);
		}
	}
	isGameOver = false;
	score = 0;
	updateScoreUI();
	startGame();
}

function createNewTile()
{
	const empties = [];
	for (let i = 0; i < 4; i++)
	{
		for (let x = 0; x < 4; x++)
		{
			const tile = document.getElementById(i.toString() + '-' + x.toString());
			if (!tile.innerText)
				empties.push(tile)
		}
	}

	if (empties.length === 0)
		return false

	const tile = empties[Math.floor(Math.random() * empties.length)];
	const v = parseInt(ramdonValue(), 10);
	updateTileAppearance(tile, v);
	return true;
}

function ramdonValue () {
	    return Math.random() < 0.9 ? "2" : "4";
}

// --- Helpers for game-over detection ---
function getVal(i, x) {
	const tile = document.getElementById(i.toString() + '-' + x.toString());
	if (!tile || !tile.innerText) return 0;
	const v = parseInt(tile.innerText, 10);
	return v;
}

function hasEmptyTile() {
	for (let i = 0; i < 4; i++) {
		for (let x = 0; x < 4; x++) {
			if (getVal(i, x) === 0) return true;
		}
	}
	return false;
}

function canMerge() {
	for (let i = 0; i < 4; i++) {
		for (let x = 0; x < 4; x++) {
			const v = getVal(i, x);
			if (v === 0) continue;
			if (x + 1 < 4 && getVal(i, x + 1) === v) return true; // right neighbor
			if (i + 1 < 4 && getVal(i + 1, x) === v) return true; // down neighbor
		}
	}
	return false;
}
4
function checkGameOver() {
	if (hasEmptyTile()) return false;
	if (canMerge()) return false;
	return true;
}

// --- Board helpers for reading/writing rows and columns ---
function getRow(i) {
	const row = [];
	for (let x = 0; x < 4; x++) row.push(getVal(i, x));
	return row;
}

function setRow(i, arr) {
	for (let x = 0; x < 4; x++) {
		const tile = document.getElementById(i.toString() + '-' + x.toString());
		updateTileAppearance(tile, arr[x] || 0);
	}
}

function getCol(x) {
	const col = [];
	for (let i = 0; i < 4; i++) col.push(getVal(i, x));
	return col;
}

function setCol(x, arr) {
	for (let i = 0; i < 4; i++) {
		const tile = document.getElementById(i.toString() + '-' + x.toString());
		updateTileAppearance(tile, arr[i] || 0);
	}
}

// Slide + merge a 1D line to the left according to 2048 rules
function slideMergeLeft(line) {
	const original = line.slice();
	const filtered = line.filter(v => v !== 0);
	const result = [];
	let scoreGain = 0;
	for (let i = 0; i < filtered.length; i++) {
		if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
			const merged = filtered[i] * 2;
			result.push(merged);
			scoreGain += merged;
			i++; // skip next (merged)
		} else {
			result.push(filtered[i]);
		}
	}
	while (result.length < 4) result.push(0);
	const moved = !arraysEqual(original, result);
	return { result, moved, scoreGain };
}

function arraysEqual(a, b) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}

function updateScoreUI() {
	const scoreEl = document.getElementById("score");
	if (scoreEl) scoreEl.innerText = score.toString();
}

// --- Visual update helper ---
function updateTileAppearance(tile, val) {
	// Reset to base class
	tile.className = "tile";
	if (val && val > 0) {
		tile.classList.add(`tile-${val}`);
		tile.innerText = val.toString();
	} else {
		tile.innerText = "";
	}
}