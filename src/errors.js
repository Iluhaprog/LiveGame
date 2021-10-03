"use strict";
export class UnsupportedElementError extends Error {
	constructor(message) {
		super(`Element ${message} is not support;`);
		this.name = "UnsupportedElementError";
	}
}

export class FlatIndexDoesNotExistsError extends Error {
	constructor(message) {
		super(`FlatIndex ${message} does not exists;`);
		this.name = "FlatIndexDoesNotExistsError";
	}
}
