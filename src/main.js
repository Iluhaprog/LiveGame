"use strict";

import {
	addClick,
	drawRect,
	getCanvas,
	ButtonTypes,
	Button,
	ButtonText,
} from "./helpers.js";
import {
	parentStyle,
	universeStyle,
	Colors,
	ButtonStyle,
	TextStyle,
	FromStyle,
	GenText,
} from "./styles.js";
import { FlatIndexDoesNotExistsError } from "./errors.js";
import { defaultRule } from "./rules.js";
import { buildSettingForm } from "./forms/settings.js";
import { buildLoaderForm, getUniverses } from "./forms/loader.js";
import { UNIVERSES } from "./locations.js";

class Cell {
	constructor({ x, y, sizes, isAlive = false }) {
		this.x = x;
		this.y = y;
		this.sizes = sizes;
		this.isAlive = isAlive;
	}

	draw(context) {
		drawRect(context, {
			x: this.x,
			y: this.y,
			border: { size: 1, color: Colors.BORDERS },
			bg: this.isAlive ? Colors.MAIN : Colors.UNIVERSE,
			width: this.sizes.width,
			height: this.sizes.height,
		});
	}
}

class Universe {
	constructor({
		width,
		height,
		cellsNumbers,
		context,
		rule = defaultRule,
		values,
	}) {
		this.rule = rule;
		this.generation = 0;
		this.generations = [];
		this.context = context;
		this.cellsNumbers = cellsNumbers;
		this.width = width;
		this.height = height;
		this.cells = [];

		this.indexMatrix = [];
		this.calcCellsSizes();
		this.initCells({ values });
	}

	calcCellsSizes() {
		this.cellSizes = {
			width: this.width / this.cellsNumbers.X,
			height: this.height / this.cellsNumbers.Y,
		};
	}

	initCells({ randomChance = 0, values }) {
		let i = 0;
		this.cells = [];
		for (let row = 0; row < this.cellsNumbers.Y; row += 1) {
			this.indexMatrix.push([]);
			for (let col = 0; col < this.cellsNumbers.X; col += 1) {
				this.cells.push(
					new Cell({
						x: col * this.cellSizes.width,
						y: row * this.cellSizes.height,
						sizes: this.cellSizes,
						isAlive: values
							? !!values[i]
							: randomChance
							? Math.random() > 1 - randomChance
							: false,
					})
				);
				this.indexMatrix[row].push(i);
				i += 1;
			}
		}
	}

	findCellByCoords({ x, y }) {
		return this.cells.findIndex(
			(cell) =>
				cell.x <= x &&
				cell.y <= y &&
				cell.x + cell.sizes.width >= x &&
				cell.y + cell.sizes.height >= y
		);
	}

	setAliveCell(index) {
		this.cells = this.cells.map((cell, i) => {
			if (index === i) {
				return new Cell({
					...cell,
					isAlive: !cell.isAlive,
				});
			}
			return new Cell({ ...cell });
		});
	}

	convertToMatrixPosition(flatIndex) {
		for (let row = 0; row < this.indexMatrix.length; row += 1) {
			for (let col = 0; col < this.indexMatrix[row].length; col += 1) {
				if (this.indexMatrix[row][col] === flatIndex) return { col, row };
			}
		}
		throw new FlatIndexDoesNotExistsError(flatIndex);
	}

	getIndexFromMatrix(col, row) {
		const cells = row < this.cellsNumbers.X ? this.indexMatrix[row] : null;
		if (!cells) return -1;
		const cell = col < cells.length ? this.indexMatrix[row][col] : null;
		if (!cell) return -1;
		return cell;
	}

	getCellEnv(cellIndex) {
		const { col, row } = this.convertToMatrixPosition(cellIndex);
		const m = this.getIndexFromMatrix.bind(this);
		return [
			m(col - 1, row - 1),
			m(col, row - 1),
			m(col + 1, row - 1),
			m(col - 1, row),

			m(col + 1, row),
			m(col - 1, row + 1),
			m(col, row + 1),
			m(col + 1, row + 1),
		]
			.filter((cellIndex) => {
				return cellIndex >= 0;
			})
			.map((cellIndex) => this.cells[cellIndex]);
	}

	calcNextGen() {
		this.generation += 1;
		if (this.generation < this.generations.length) {
			this.cells = this.generations[this.generation];
		} else {
			this.generations.push(this.cells.map((cell) => new Cell({ ...cell })));
			this.cells = this.cells.map((cell, i) => {
				const cellEnv = this.getCellEnv(i);
				if (this.rule(cell, cellEnv)) {
					return new Cell({ ...cell, isAlive: true });
				}
				return new Cell({ ...cell, isAlive: false });
			});
		}
	}

	calcPrevGen() {
		if (this.generation > 0 && this.generation <= this.generations.length) {
			this.generation -= 1;
			console.log("GEN:", this.generation);
			this.cells = this.generations[this.generation];
		}
	}

	clear() {
		this.cells = this.cells.map(
			(cell) => new Cell({ ...cell, isAlive: false })
		);
		this.generations = [];
		this.generation = 0;
	}

	draw() {
		this.context.clearRect(0, 0, this.width, this.height);
		this.cells.forEach((cell) => {
			cell.draw(this.context);
		});
	}
}

class Game {
	static main({
		parent,
		width,
		height,
		cellsNumbers,
		randomChance = 0.5,
		menu,
		defaultRule,
		delay = 100,
		values,
	}) {
		const { canvas, context } = getCanvas({ parent, width, height });
		universeStyle.to(canvas);

		const universe = new Universe({
			width,
			height,
			cellsNumbers,
			context,
			rule: defaultRule,
			values,
		});

		const genText = ButtonText({
			inner: `GEN: ${universe.generation}`,
			styles: GenText,
		});

		parent.appendChild(genText);

		universe.draw();

		addClick(({ x, y }) => {
			universe.setAliveCell(universe.findCellByCoords({ x, y }));
			universe.draw();
		}).to(canvas);

		let intervalID;

		menu.buttons[ButtonTypes.RUN].addEventListener("click", () => {
			intervalID = setInterval(() => {
				genText.innerText = `GEN: ${universe.generation}`;
				universe.calcNextGen();
				universe.draw();
			}, delay);
		});
		menu.buttons[ButtonTypes.STOP].addEventListener("click", () => {
			if (intervalID) clearInterval(intervalID);
		});
		menu.buttons[ButtonTypes.NEXT_GEN].addEventListener("click", () => {
			universe.calcNextGen();
			genText.innerText = `GEN: ${universe.generation}`;
			universe.draw();
		});
		menu.buttons[ButtonTypes.PREV_GEN].addEventListener("click", () => {
			universe.calcPrevGen();
			genText.innerText = `GEN: ${universe.generation}`;
			universe.draw();
		});
		menu.buttons[ButtonTypes.CLEAR].addEventListener("click", () => {
			universe.clear();
			genText.innerText = `GEN: ${universe.generation}`;
			universe.draw();
		});
		menu.buttons[ButtonTypes.RANDOM].addEventListener("click", () => {
			universe.initCells({ randomChance });
			universe.draw();
		});
		menu.buttons[ButtonTypes.SAVE].addEventListener("click", () => {
			const key = prompt("Name of universe: ");
			const values = JSON.parse(localStorage.getItem(UNIVERSES)) || {};
			values[key] = {
				settings: {
					width,
					height,
					delay,
					cellsNumbers,
					randomChance,
				},
				universe: universe.cells.map((cell) => +cell.isAlive),
			};
			localStorage.setItem(UNIVERSES, JSON.stringify(values));
		});

		return universe;
	}
}

class Menu {
	static gen(parent) {
		const buttons = {};
		Object.keys(ButtonTypes).forEach((key) => {
			buttons[ButtonTypes[key]] = Button({
				parent,
				inner: ButtonText({ inner: ButtonTypes[key], styles: TextStyle }),
				styles: ButtonStyle,
			});
		});
		return { buttons };
	}
}

const init = ({ gameSetup }) => {
	const canvasWrapper = document.createElement("div");
	const menuWrapper = document.createElement("div");

	const initGame = ({ gameSetup, values }) => {
		Game.main({
			parent: canvasWrapper,
			...gameSetup,
			menu: Menu.gen(menuWrapper),
			rule: defaultRule,
			values,
		});

		const form = buildSettingForm({
			gameSetup,
			onSubmit: (values) => {
				const gameSetup = {
					width: +values.width,
					height: +values.height,
					cellsNumbers: {
						X: +values.cellsByX,
						Y: +values.cellsByY,
					},
					randomChance: +values.chance,
					delay: +values.delay,
				};
				menuWrapper.innerHTML = "";
				canvasWrapper.innerHTML = "";
				initGame({ gameSetup });
			},
		});

		const loadUniverse = (values) => {
			menuWrapper.innerHTML = "";
			canvasWrapper.innerHTML = "";
			initGame({
				gameSetup: values.settings,
				values: values.universe,
			});
		};

		const loaderForm = buildLoaderForm({
			onLoadFromLocalStorage: loadUniverse,
		});

		document.body.appendChild(loaderForm.box);
		document.body.appendChild(form.box);

		Button({
			parent: menuWrapper,
			inner: ButtonText({ inner: "Settings", styles: TextStyle }),
			styles: ButtonStyle,
		}).addEventListener("click", () => form.changeStyle(FromStyle));

		Button({
			parent: menuWrapper,
			inner: ButtonText({ inner: "Load", styles: TextStyle }),
			styles: ButtonStyle,
		}).addEventListener("click", () => {
			loaderForm.setElementsSetup(getUniverses(loadUniverse));
			document.body.removeChild(loaderForm.box);
			document.body.appendChild(loaderForm.box);
			loaderForm.changeStyle(FromStyle);
		});
	};

	document.body.appendChild(canvasWrapper);
	document.body.appendChild(menuWrapper);

	initGame({ gameSetup });

	parentStyle.to(document.body);
};

const gameSetup = {
	width: 1000,
	height: 500,
	delay: 200,
	randomChance: 0.5,
	cellsNumbers: { X: 100, Y: 50 },
};

init({ gameSetup });
