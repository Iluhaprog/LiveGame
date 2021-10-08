"use strict";

import { SubmitStyle, VisibleNone } from "../styles.js";
import { Form, InputTypes } from "../form.js";
import { UNIVERSES } from "../locations.js";

export const getUniverses = (onLoadFromLocalStorage) => {
	const fields = JSON.parse(localStorage.getItem(UNIVERSES)) || {};
	return Object.keys(fields).map((key) => {
		return {
			type: InputTypes.BUTTON,
			onClick: () => {
				onLoadFromLocalStorage(fields[key]);
			},
			style: SubmitStyle,
			defaultValue: key,
		};
	});
};

export const buildLoaderForm = ({ onLoadFromLocalStorage }) => {
	return new Form({
		style: VisibleNone,
		elementsSetup: getUniverses(onLoadFromLocalStorage),
		onSubmit: () => {},
		onClose: (form) => {
			form.changeStyle(VisibleNone);
		},
	});
};
