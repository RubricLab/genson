import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type JsonObject = { [key: string]: any };

export function addIdToJson(json: Record<string, any>) {
	let maxId = 0;

	function traverseAndProcess(obj: Record<string, any>) {
		if (typeof obj !== "object" || obj === null) return;

		if (obj.id?.startsWith("id_")) {
			const idNumber = Number.parseInt(obj.id.replace("id_", ""));
			if (!Number.isNaN(idNumber) && idNumber > maxId) {
				maxId = idNumber;
			}
		}

		if (!obj.id) {
			obj.id = `id_${++maxId}`;
		}

		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				const value = obj[key];
				if (Array.isArray(value)) {
					for (const item of value) {
						if (typeof item === "object") {
							traverseAndProcess(item);
						}
					}
				} else {
					traverseAndProcess(value);
				}
			}
		}
	}

	traverseAndProcess(json);
	return json;
}

export function updateJsonById(
	json: JsonObject,
	id: string,
	newSchema: JsonObject,
	type: "update" | "overwrite",
) {
	function recursiveUpdate(node: JsonObject): JsonObject {
		if (node.id === id) {
			for (const key in newSchema) {
				if (
					typeof newSchema[key] === "object" &&
					newSchema[key] !== null &&
					!Array.isArray(newSchema[key])
				) {
					if (!node[key] || type === "overwrite") {
						node[key] = {};
					}
					node[key] = mergeObjects(node[key], newSchema[key]);
				} else {
					node[key] = newSchema[key];
				}
			}
			return node;
		}
		for (const key in node) {
			if (typeof node[key] === "object" && node[key] !== null) {
				node[key] = recursiveUpdate(node[key]);
			}
		}
		return node;
	}

	function mergeObjects(target: JsonObject, source: JsonObject) {
		for (const key in source) {
			if (
				typeof source[key] === "object" &&
				source[key] !== null &&
				!Array.isArray(source[key])
			) {
				if (!target[key]) {
					target[key] = {};
				}
				target[key] = mergeObjects(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		}
		return target;
	}

	return recursiveUpdate(json);
}
