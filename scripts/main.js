
function nextFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach( particle => {
        particle.move();
        particle.collide();
        particle.render();
        particle.renderEdges();
    })
}

function moveCursor(event) {
    boundary = canvas.getBoundingClientRect();
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.cx = (event.clientX - boundary.left) * resolutionModifier;
    mouse.cy = (event.clientY - boundary.top) * resolutionModifier;
}

function generateParticle(event) {
    const newParticle = new Particle(mouse.cx, mouse.cy, options.speed(), options.direction());
    particles.push(newParticle);
    newParticle.render();
}

canvas.addEventListener('click', generateParticle);
window.addEventListener('mousemove', moveCursor);
setInterval(nextFrame, 16.66);