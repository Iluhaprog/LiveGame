"use strict";

import {
	FormInputStyles,
	WrapperStyle,
	LabelStyle,
	SubmitStyle,
	VisibleNone,
} from "../styles.js";
import { Form, InputTypes } from "../form.js";

export const buildSettingForm = ({ onSubmit, gameSetup }) => {
	return new Form({
		style: VisibleNone,
		elementsSetup: [
			{
				label: "Width: ",
				name: "width",
				style: FormInputStyles,
				wrapperStyle: WrapperStyle,
				labelStyle: LabelStyle,
				defaultValue: gameSetup.width,
			},
			{
				label: "Height: ",
				name: "height",
				style: FormInputStyles,
				wrapperStyle: WrapperStyle,
				labelStyle: LabelStyle,
				defaultValue: gameSetup.height,
			},
			{
				label: "Cells by X: ",
				name: "cellsByX",
				style: FormInputStyles,
				wrapperStyle: WrapperStyle,
				labelStyle: LabelStyle,
				defaultValue: gameSetup.cellsNumbers.X,
			},
			{
				label: "Cells by Y: ",
				name: "cellsByY",
				style: FormInputStyles,
				wrapperStyle: WrapperStyle,
				labelStyle: LabelStyle,
				defaultValue: gameSetup.cellsNumbers.Y,
			},
			{
				label: "Delay: ",
				name: "delay",
				style: FormInputStyles,
				wrapperStyle: WrapperStyle,
				labelStyle: LabelStyle,
				defaultValue: gameSetup.delay,
			},
			{
				label: "Random chance: ",
				name: "chance",
				style: FormInputStyles,
				wrapperStyle: WrapperStyle,
				labelStyle: LabelStyle,
				defaultValue: gameSetup.randomChance,
			},
			{
				type: InputTypes.SUBMIT,
				style: SubmitStyle,
				defaultValue: "Save",
			},
		],
		onSubmit,
		onClose: (form) => {
			form.changeStyle(VisibleNone);
		},
	});
};
