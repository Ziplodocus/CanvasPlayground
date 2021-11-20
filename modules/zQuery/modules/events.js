
export function events() {
    EventTarget.prototype.on = EventTarget.prototype.addEventListener;
    NodeList.prototype.on = function( eventType, callback, options ) {
        this.forEach( node => node.on(eventType, callback, options) );
    }
    EventTarget.prototype.off = EventTarget.prototype.removeEventListener;
    NodeList.prototype.off = function( eventType, callback, options ) {
        this.forEach( node => node.off(eventType, callback, options) );
    }
}