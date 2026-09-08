import type React from "react";

// Official Flexoki Color Palette
const flexoki = {
	black: "#100F0F",
	base950: "#1C1B1A",
	base900: "#282726",
	base850: "#343331",
	base800: "#403E3C",
	base700: "#575653",
	base600: "#6F6E69",
	base500: "#878580",
	base300: "#B7B5AC",
	base200: "#CECDC3",
	base100: "#E6E4D9",
	base50: "#F2F0E5",
	paper: "#FFFCF0",

	// Accents (Dark)
	redDark: "#D14D41",
	orangeDark: "#DA702C",
	yellowDark: "#D0A215",
	greenDark: "#879A39",
	cyanDark: "#3AA99F",
	blueDark: "#4385BE",
	purpleDark: "#8B7EC8",
	magentaDark: "#CE5D97",

	// Accents (Light)
	redLight: "#AF3029",
	orangeLight: "#BC5215",
	yellowLight: "#AD8301",
	greenLight: "#66800B",
	cyanLight: "#24837B",
	blueLight: "#205EA6",
	purpleLight: "#5E409D",
	magentaLight: "#A02F6F",
};

export const flexokiDark: { [key: string]: React.CSSProperties } = {
	'code[class*="language-"]': {
		color: flexoki.base200,
		fontFamily: "var(--font-code), monospace",
		fontSize: "0.875rem",
		lineHeight: "1.6",
		direction: "ltr",
		textAlign: "left",
		whiteSpace: "pre",
		wordSpacing: "normal",
		wordBreak: "normal",
		tabSize: 2,
		hyphens: "none",
	},
	'pre[class*="language-"]': {
		color: flexoki.base200,
		fontFamily: "var(--font-code), monospace",
		fontSize: "0.875rem",
		direction: "ltr",
		textAlign: "left",
		whiteSpace: "pre",
		wordSpacing: "normal",
		wordBreak: "normal",
		tabSize: 2,
		hyphens: "none",
		margin: 0,
		background: flexoki.black,
	},
	keyword: {
		color: flexoki.purpleDark,
	},
	tag: {
		color: flexoki.orangeDark,
	},
	"class-name": {
		color: flexoki.yellowDark,
	},
	string: {
		color: flexoki.cyanDark,
	},
	"attr-value": {
		color: flexoki.cyanDark,
	},
	"attr-name": {
		color: flexoki.base300,
	},
	property: {
		color: flexoki.base200,
	},
	// Punctuation, operators, brackets
	punctuation: {
		color: flexoki.base600,
	},
	operator: {
		color: flexoki.base600,
	},
	// Numbers, Booleans, Constants
	number: {
		color: flexoki.magentaDark,
	},
	boolean: {
		color: flexoki.magentaDark,
	},
	constant: {
		color: flexoki.magentaDark,
	},
	function: {
		color: flexoki.greenDark,
	},
	comment: {
		color: flexoki.base600,
		fontStyle: "italic",
	},
	regex: {
		color: flexoki.yellowDark,
	},
};

export const flexokiLight: { [key: string]: React.CSSProperties } = {
	'code[class*="language-"]': {
		color: flexoki.base800,
		fontFamily: "var(--font-code), monospace",
		fontSize: "0.875rem",
		lineHeight: "1.6",
		direction: "ltr",
		textAlign: "left",
		whiteSpace: "pre",
		wordSpacing: "normal",
		wordBreak: "normal",
		tabSize: 2,
		hyphens: "none",
	},
	'pre[class*="language-"]': {
		color: flexoki.base800,
		fontFamily: "var(--font-code), monospace",
		fontSize: "0.875rem",
		direction: "ltr",
		textAlign: "left",
		whiteSpace: "pre",
		wordSpacing: "normal",
		wordBreak: "normal",
		tabSize: 2,
		hyphens: "none",
		margin: 0,
		background: flexoki.paper,
	},
	keyword: {
		color: flexoki.purpleLight,
	},
	tag: {
		color: flexoki.orangeLight,
	},
	"class-name": {
		color: flexoki.yellowLight,
	},
	string: {
		color: flexoki.cyanLight,
	},
	"attr-value": {
		color: flexoki.cyanLight,
	},
	"attr-name": {
		color: flexoki.base700,
	},
	property: {
		color: flexoki.base800,
	},
	punctuation: {
		color: flexoki.base500,
	},
	operator: {
		color: flexoki.base500,
	},
	number: {
		color: flexoki.magentaLight,
	},
	boolean: {
		color: flexoki.magentaLight,
	},
	constant: {
		color: flexoki.magentaLight,
	},
	function: {
		color: flexoki.greenLight,
	},
	comment: {
		color: flexoki.base500,
		fontStyle: "italic",
	},
	regex: {
		color: flexoki.yellowLight,
	},
};
