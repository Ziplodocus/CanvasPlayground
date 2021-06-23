
function setctx() {
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.strokeStyle = 'hsla(0, 0, 100%, 0.5)';
    ctx.save();
}

function moveCursor(event) {
    mouse.x = (event.clientX - boundary.left) * resolutionModifier;
    mouse.y = (event.clientY - boundary.top) * resolutionModifier;
}

function generateParticle(event) {
    const newParticle = new Particle(mouse.x, mouse.y);
    particles.push(newParticle);
    newParticle.render();
}

function checkCollisionsAndDrawEdges() {
    particles.forEach( particle => {
        particle.collide();
        particle.renderEdge();
    })
}

function nextFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setctx();
    mouse.render();

    particles.forEach( particle => {

        let withinVertical = (particle.x + particle.radius < canvas.width) && (particle.x - particle.radius > 0);
        let withinHorizontal = (particle.y + particle.radius < canvas.height) && (particle.y - particle.radius > 0);
        if(!withinVertical) {
            particle.bounce('vertical')
        }
        if(!withinHorizontal) {
            particle.bounce('horizontal')
        }
        particle.move();
        particle.render(ctx);  
    })
    checkCollisionsAndDrawEdges();
    
}

setInterval(nextFrame, 15);

canvas.addEventListener('click', generateParticle);
canvas.addEventListener('mousemove', moveCursor);