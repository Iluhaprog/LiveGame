"use strict";

import { UnsupportedElementError } from "./errors.js";

export const getCanvas = ({ parent, width, height }) => {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext("2d");
	parent.appendChild(canvas);
	return { canvas, context };
};

/**
 *
 * @param {string|HTMLElement} el
 * @param {ElementCSSInlineStyle} styles
 */
export const styles = (styles) => {
	return {
		to(el) {
			let element;
			if (typeof el === "string") {
				element = document.getElementById(el);
			} else if (el instanceof HTMLElement) {
				element = el;
			} else {
				throw new UnsupportedElementError(el);
			}

			Object.keys(styles).forEach((styleName) => {
				element.style[styleName] = styles[styleName];
			});
		},
	};
};

export const addClick = (cl) => ({
	to(canvas) {
		canvas.addEventListener("click", (event) => {
			cl({ x: event.offsetX, y: event.offsetY });
		});
	},
});

export const drawRect = (
	context,
	{ x, y, width, height, bg, border: { size, color } }
) => {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
	context.fillStyle = bg;
	context.fillRect(x + size, y + size, width - 2 * size, height - 2 * size);
};

export const ButtonTypes = {
	RUN: "Run",
	STOP: "Stop",
	NEXT_GEN: "Next",
	PREV_GEN: "Prev",
	CLEAR: "Clear",
};

export const Button = ({ parent, inner, styles }) => {
	const button = document.createElement("button");
	inner && button.appendChild(inner);
	styles && styles.to(button);
	parent.appendChild(button);
	return button;
};

export const ButtonText = ({ inner = "", styles }) => {
	const text = document.createElement("p");
	text.innerText = inner;
	styles && styles.to(text);
	return text;
};
