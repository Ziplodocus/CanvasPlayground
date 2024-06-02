import { z, Z, zQuery } from '../modules/zQuery/z-query';
import 'particle-web-component';

zQuery.init(['events']);

const canvas = z('particle-canvas');

function inputChangeHandler(event) {
	const input = event.currentTarget;
	update(input);
}

Z('form').on('reset', (e) => {
	for (let el of e.currentTarget.elements) {
		requestAnimationFrame(() => update(el));
	}
});
Z('[type="range"], [type="checkbox"], [type="number"], [type="color"]').forEach(input => {
	update(input);
	input.on('input', inputChangeHandler);
});

function update(input: HTMLInputElement) {
	const property = input.name;

	if (input.type === 'reset') return;

	const value = parseValue(input);

	canvas.setAttribute(property.toString(), value);
};

function parseValue(input) {
	let value;
	switch (input.type) {
		case 'checkbox':
			value = !!input.checked;
			break;
		default:
			value = input.value;
	}
	return value;
};