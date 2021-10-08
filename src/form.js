"use strict";

import { SubmitStyle } from "./styles.js";

export const InputTypes = {
	TEXT: "text",
	BUTTON: "button",
	SUBMIT: "submit",
};

export const Input = ({
	defaultValue = "",
	label = "",
	style,
	wrapperStyle,
	labelStyle,
	name = "",
	type = InputTypes.TEXT,
	onChange = () => {},
	onClick = () => {},
}) => {
	const element = document.createElement("input");
	element.value = defaultValue;
	element.name = name;
	element.type = type;
	element.onchange = onChange;
	element.onclick = onClick;

	if (style) style.to(element);

	if (!label) {
		return element;
	}

	const withLabel = document.createElement("div");
	const labelEl = document.createElement("label");

	if (wrapperStyle) wrapperStyle.to(withLabel);
	if (labelStyle) labelStyle.to(labelEl);

	labelEl.innerText = label;
	labelEl.setAttribute("for", name);
	withLabel.appendChild(labelEl);
	withLabel.appendChild(element);
	return withLabel;
};

export class Form {
	constructor({ elementsSetup = [], onSubmit = () => {}, style, onClose }) {
		this.style = style;
		this.box = document.createElement("form");
		this.onClose = onClose;
		this.inputsWrapper = document.createElement("div");
		this.box.appendChild(this.inputsWrapper);

		if (style) style.to(this.box);
		this.box.onsubmit = (event) => {
			event.preventDefault();
			onSubmit(this.getValues());
		};

		this.setElementsSetup(elementsSetup);
	}

	setElementsSetup(setup) {
		this.elementsSetup = setup;
		this.inputsWrapper.innerHTML = "";
		this.elementsSetup.forEach((elementSetup) => {
			this.inputsWrapper.appendChild(Input(elementSetup));
		});
		this.inputsWrapper.appendChild(
			Input({
				defaultValue: "Close",
				type: InputTypes.BUTTON,
				style: SubmitStyle,
				onClick: () => this.onClose(this),
			})
		);
	}

	getValues() {
		const inputs = this.box.elements;
		const values = {};

		for (let i = 0; i < inputs.length; i += 1) {
			if (inputs[i].name) {
				values[inputs[i].name] = inputs[i].value;
			}
		}

		return values;
	}

	changeStyle(style) {
		this.style.removeFrom(this.box);
		this.style = style;
		this.style.to(this.box);
	}
}
