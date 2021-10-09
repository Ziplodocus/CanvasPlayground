
function z(query) { return document.querySelector(query) }
function Z(query) { return document.querySelectorAll(query) }

Node.prototype.z = Node.prototype.querySelector;
Node.prototype.Z = Node.prototype.querySelectorAll;
EventTarget.prototype.on = EventTarget.prototype.addEventListener;
NodeList.prototype.on = function( eventType, callback ) {
    this.forEach( node => node.on(eventType, callback) );
}

EventTarget.prototype.off = EventTarget.prototype.removeEventListener;
NodeList.prototype.off = function( eventType, callback ) {
    this.forEach( node => node.off(eventType, callback) );
}

HTMLElement.prototype.slideToggle = function slideToggle( duration=400, timingFunction='ease' ) {
    this.style.overflow = 'hidden';
    if(this.animation) {
        this.animation.reverse();
        if(this.animation.state === 'opening') {
            this.animation.state = 'closing';
            this.animation.onfinish = () => {
                this.style.display = 'none';
                this.style.removeProperty('overflow');
                this.style.removeProperty('height');
                this.animation = false;
            }
        } else {
            this.animation.state = 'opening';
            this.animation.onfinish = () => {
                this.style.removeProperty('overflow');
                this.animation = false;
            }
        }
    } else if(this.style.display === 'none') {
        this.style.removeProperty('display');
        const endHeight = getComputedStyle(this).getPropertyValue('height');
        const endMargin = getComputedStyle(this).getPropertyValue('margin-block');
        const endPadding = getComputedStyle(this).getPropertyValue('padding-block');
        this.animation = this.animate(
            { 
                height: ['0px', endHeight], 
                paddingBlock: ['0px', endPadding], 
                marginBlock: ['0px', endMargin]
            },
            { duration: duration, easing: timingFunction }
        );
        this.animation.state = 'opening';
        this.animation.onfinish = () => {
            this.style.removeProperty('overflow');
            this.animation = false;
        }
    } else {
        const startHeight = getComputedStyle(this).getPropertyValue('height');
        const startPadding = getComputedStyle(this).getPropertyValue('padding-block');
        const startMargin = getComputedStyle(this).getPropertyValue('margin-block');

        this.animation = this.animate(
            { 
                height: [startHeight, '0px'], 
                paddingBlock: [startPadding, '0px'], 
                marginBlock: [startMargin, '0px']
            },
            { duration: duration, easing: timingFunction }
        );
        this.animation.state = 'closing';
        this.animation.onfinish = () => {
            this.style.display = 'none';
            this.style.removeProperty('overflow');
            this.style.removeProperty('height');
            this.animation = false;
        }
    };
}

export { Z, z };