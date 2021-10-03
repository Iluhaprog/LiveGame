"use strict";

import { styles } from "./helpers.js";

export const Colors = {
	MAIN: "#4B6587",
	UNIVERSE: "#F7F6F2",
	BORDERS: "#C8C6C6",
	SECOND: "#F0E5CF",
};

export const parentStyle = styles({
	height: `${window.innerHeight - 20}px`,
	backgroundColor: Colors.MAIN,
	display: "grid",
	placeItems: "center",
});

export const universeStyle = styles({
	backgroundColor: Colors.UNIVERSE,
	borderRadius: "10px",
	border: `2px solid ${Colors.BORDERS}`,
});

export const defaultButton = ({ borderColor, backgroundColor }) => ({
	padding: "5px",
	width: "100px",
	backgroundColor,
	borderRadius: "5px",
	border: `2px solid ${borderColor}`,
	margin: "5px",
	cursor: "pointer",
});

export const ButtonStyle = styles(
	defaultButton({
		borderColor: Colors.BORDERS,
		backgroundColor: Colors.UNIVERSE,
	})
);

export const TextStyle = styles({
	fontFamily: "'Cabin', sans-serif",
	textTransform: "uppercase",
	padding: "5px",
	margin: "0",
});
