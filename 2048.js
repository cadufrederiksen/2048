let score = 0;

window.onload = function() {
	setGame();
}

window.addEventListener("DOMContentLoaded", () =>
	{
		document.getElementById("restart-btn").addEventListener("click", () => restartGame())
		document.getElementById("restart-btn").addEventListener("keyup", (event) => {
			if (event.key === "LeftArrow")
			{

			}
			else if (event.key === "UpArrow")
			{

			}
			else if (event.key === "DownArrow")
			{

			}
			else if (event.key === "RightArrow")
			{

			}
		})
	}
)



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
	createNewTile();	
	createNewTile();		
}

function restartGame() 
{
	for (let i = 0; i < 4; i++)
	{
		for (let x = 0; x < 4; x++)
		{
			let tile = document.getElementById(i.toString() + "-" + x.toString());
			tile.innerText = "";
		}
	}
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
	tile.innerText = ramdonValue().toString();	
}

function ramdonValue () {
	    return Math.random() < 0.9 ? "2" : "4";
}