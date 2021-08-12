
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

canvas.addEventListener( 'click', generateParticle );
window.addEventListener( 'touchmove', mouse.move );
window.addEventListener( 'touchend', mouse.reset );
window.addEventListener( 'mousemove', mouse.move );
nextFrame();