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
	fontFamily: "'Cabin', sans-serif",
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

export const FormInputStyles = styles({
	padding: "10px",
	fontSize: "16px",
	fontFamily: "'Cabin', sans-serif",
	borderRadius: "5px",
	border: `2px solid ${Colors.BORDERS}`,
	margin: "10px 0",
});

export const WrapperStyle = styles({
	display: "flex",
	flexDirection: "column",
});

export const LabelStyle = styles({
	color: Colors.SECOND,
	fontFamily: "'Cabin', sans-serif",
	fontSize: "16px",
	marginTop: "10px",
});

export const SubmitStyle = styles({
	...defaultButton({
		borderColor: Colors.BORDERS,
		backgroundColor: Colors.UNIVERSE,
	}),
	maxWidth: "200px",
	width: "100%",
	margin: "0",
	marginTop: "10px",
});

export const FromStyle = styles({
	position: "absolute",
	display: "grid",
	placeItems: "center",
	backgroundColor: Colors.MAIN,
	top: 0,
	left: 0,
	bottom: 0,
	right: 0,
	padding: "60px",
});

export const VisibleNone = styles({
	visibility: "hidden",
	height: "0",
	overflow: "hidden",
});
