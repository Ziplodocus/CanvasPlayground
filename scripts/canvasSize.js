
function resizeCanvas() {
    canvas
    let canvasStyle = getComputedStyle(canvas);
    let canvasHeight = canvasStyle.height;
    let canvasWidth = canvasStyle.width;
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
