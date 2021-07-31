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


    particles.forEach(particle => {
        particle._x = particle.x * (newCanvasSize.width / canvasSize.width);
        particle._y = particle.y * (newCanvasSize.height / canvasSize.height);
        let sizeRatio = newCanvasSize.area() / canvasSize.area();
        particle._vicinity * sizeRatio;
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
particles.push(new Particle(100,100), new Particle(canvas.width - 100, canvas.height - 100), new Particle(100, canvas.height - 100), new Particle(canvas.width - 100, 100));

