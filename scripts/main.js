import { z, Z } from './z-query.js';
import { particles,  Particle, options, canvas, mouse, ctx,  } from './definitions.js';

function nextFrame() {
    requestAnimationFrame(nextFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach( particle => {
        particle.move();
        particle.collide();
        particle.render();
        particle.renderEdges();
    }) 
}

function generateParticle(event) {
    const newParticle = new Particle(mouse.cx, mouse.cy, options.speed(), options.direction());
    particles.push(newParticle);
    newParticle.render();
}

function changeOptions(event) {
    const inputElement = event.currentTarget;
    const valName = inputElement.name;
    const value = inputElement.type == 'checkbox' ? !inputElement.checked : parseFloat(inputElement.value);
    options[valName] = value;
}

z('input[type="range"]').on('input', changeOptions);
Z('input[type="checkbox"]').on('input', changeOptions)
canvas.on( 'click', generateParticle );
window.on( 'touchmove', mouse.move );
window.on( 'touchend', mouse.reset );
window.on( 'mousemove', mouse.move );
nextFrame();