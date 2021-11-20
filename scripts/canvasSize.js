import { particles, canvas, options, canvasSize } from './definitions.js';

function resizeCanvas() {
    const oldCanvasSize = { ...canvasSize };
    canvasSize.refresh();

    const sizeRatio = canvasSize.width / oldCanvasSize.width;
    options.vicinity *= sizeRatio**0.5;

    particles.forEach( particle => {
        particle.x = particle.x * (canvasSize.width / oldCanvasSize.width);
        particle.y = particle.y * (canvasSize.height / oldCanvasSize.height);
    })
    canvas.height = Math.floor(options.resolutionModifier * canvasSize.height);
    canvas.width = Math.floor(options.resolutionModifier * canvasSize.width);
}

let resizeId;
function handleResize() {
    clearTimeout(resizeId);
    resizeId = setTimeout(resizeCanvas, 300);
}

export { handleResize, resizeCanvas };
