
export function z(query) { return document.querySelector(query) }
export function Z(query) { return document.querySelectorAll(query) }
Element.prototype.z = Element.prototype.querySelector;
Element.prototype.Z = Element.prototype.querySelectorAll;
