
export function style() {
    Element.prototype.computedStyle = function(style) {
        return getComputedStyle(this).getPropertyValue(style);
    }
}