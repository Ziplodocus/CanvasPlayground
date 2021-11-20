import { z, Z, zQuery } from '../modules/zQuery/z-query.js';
import { particles,  Particle, options, canvas, mouse, ctx,  } from './definitions.js';
import { handleResize, resizeCanvas } from './canvasSize.js';
zQuery.init(['events']);

function nextFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach( particle => {
        particle.move();
        particle.collide();
        particle.render();
        particle.renderEdges();
    }) 
    requestAnimationFrame(nextFrame);
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
document.on( 'touchmove', mouse.move );
document.on( 'touchend', mouse.reset );
document.on( 'mousemove', mouse.move, {'passive': true} );
nextFrame();

resizeCanvas();
window.on('resize', handleResize, {'passive': true});
window.on('scroll', handleResize, {'passive': true});
Particle.initialize();