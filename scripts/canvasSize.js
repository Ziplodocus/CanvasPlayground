let resizeId;

function resizeCanvas() {
    let newCanvasSize = {
        width: getComputedStyle(canvas).width.replace('px',''),
        height: getComputedStyle(canvas).height.replace('px',''),
        area() {
            return this.width * this.height
        }
    }

    let sizeRatio = newCanvasSize.area() / canvasSize.area();
    options.vicinity *= sizeRatio;


    particles.forEach(particle => {
        particle._x = particle.x * (newCanvasSize.width / canvasSize.width);
        particle._y = particle.y * (newCanvasSize.height / canvasSize.height);
        particle._radius * sizeRatio;
    })
    canvas.height = Math.floor(resolutionModifier * newCanvasSize.height);
    canvas.width = Math.floor(resolutionModifier * newCanvasSize.width);
    canvasSize = newCanvasSize;
}

function resize() {
    clearTimeout(resizeId);
    resizeId = setTimeout(resizeCanvas, 300);
}

resizeCanvas();
window.addEventListener('resize', resize);

// for (let i = options.initialParticles; i > 0; i--) {
//     let randX = Math.random() * (canvasSize.width - 2*options.maxSize) * resolutionModifier + options.maxSize;
//     let randY = Math.random() * (canvasSize.height - 2*options.maxSize) * resolutionModifier + options.maxSize;
//     particles.push(new Particle(randX, randY));
// }
