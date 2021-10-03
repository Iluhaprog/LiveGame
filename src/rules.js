"use strict";

const getAliveCells = (env) => {
	return env.reduce((prevVal, currVal) => {
		if (currVal?.isAlive) return (prevVal += 1);
		return prevVal;
	}, 0);
};

const needNewLive = (env) => {
	return getAliveCells(env) === 3;
};

const stayLive = (env) => {
	const liveCount = getAliveCells(env);
	return liveCount === 3 || liveCount === 2;
};

export const defaultRule = (cell, cellEnv) => {
	if (!cell.isAlive && needNewLive(cellEnv)) {
		return true;
	}
	if (cell.isAlive && stayLive(cellEnv)) {
		return true;
	}
	return false;
};
