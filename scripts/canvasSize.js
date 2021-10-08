
import { z, Z } from './z-query.js';
import { particles,  canvas, options, Particle } from './definitions.js';

let resizeId;
let canvasSize = {
    width: getComputedStyle(canvas).width.replace('px',''),
    height: getComputedStyle(canvas).height.replace('px',''),
    area() {
        return this.width * this.height
    }
}

function resizeCanvas() {
    let newCanvasSize = {
        width: getComputedStyle(canvas).width.replace('px',''),
        height: getComputedStyle(canvas).height.replace('px',''),
        area() {
            return this.width * this.height
        }
    }

    let sizeRatio = newCanvasSize.width / canvasSize.width;
    options.vicinity *= sizeRatio**0.5;

    particles.forEach(particle => {
        particle.setX = particle.x * (newCanvasSize.width / canvasSize.width);
        particle.setY = particle.y * (newCanvasSize.height / canvasSize.height);
    })
    canvas.height = Math.floor(options.resolutionModifier * newCanvasSize.height);
    canvas.width = Math.floor(options.resolutionModifier * newCanvasSize.width);
    canvasSize = newCanvasSize;
}

function resize() {
    clearTimeout(resizeId);
    resizeId = setTimeout(resizeCanvas, 300);
}

resizeCanvas();
window.on('resize', resize);
Particle.initialize();
