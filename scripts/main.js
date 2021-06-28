
function setctx() {
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.strokeStyle = 'hsla(0, 0, 100%, 0.5)';
    ctx.save();
}

function nextFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setctx();

    particles.forEach( particle => {
        particle.move();
        particle.render();  
    })

    particles.forEach( particle => {
        particle.collide();
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
    const newParticle = new Particle(mouse.cx, mouse.cy);
    particles.push(newParticle);
    newParticle.render();
}

canvas.addEventListener('click', generateParticle);
window.addEventListener('mousemove', moveCursor);

setInterval(nextFrame, 20);