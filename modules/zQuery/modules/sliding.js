
import { style } from "./style.js";
style();

export function sliding() {
    HTMLElement.prototype.slideToggle = slideToggle;
}

function slideToggle( duration = 400, timingFunction = 'ease' ) {
    if ( !this.slideState ) this.slideState = 'open';
    if ( this.slideState === 'opening' || this.state === 'closing' ) {
        this.animation.reverse();
        this.slideState === 'opening' ? this.slideState = 'closing' : this.slideState = 'opening';
        return
    }
    this.style.overflow = 'hidden';
    this.style.removeProperty('display');
    const animStyles = { 
        height: [this.computedStyle('height'), '0px'], 
        paddingBlock: [this.computedStyle('padding-block'), '0px'], 
        borderBlockWidth: [this.computedStyle('border-block-width'), '0px'],
        marginBlock: [this.computedStyle('margin-block'), '0px'],
        outlineWidth: [this.computedStyle('outline-width'), '0px'],
        boxShadow: [this.computedStyle('box-shadow'), '0 0 0 0 transparent']
    }
    
    if ( this.slideState === 'closed' ) { 
        for (let style in animStyles) {
            animStyles[style].reverse();
        }
    }
    
    this.animation = this.animate(
        animStyles,
        { duration: duration, easing: timingFunction }
    );
        
    this.slideState = this.slideState === 'closed' ? 'opening' : 'closing';
    this.animation.onfinish = () => {
        if ( this.slideState === 'opening' ) {
            this.slideState = 'open';
            this.style.removeProperty('overflow')
        } else {    
            this.slideState = 'closed';
            this.style.display = 'none';
            this.style.removeProperty('overflow');
        }
    }
}
