
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

function changeOptions(event) {
    const inputElement = event.currentTarget;
    const valName = inputElement.name;
    const value = inputElement.type == 'checkbox' ? !inputElement.checked : parseFloat(inputElement.value);
    options[valName] = value;
}

const opacitySlide = document.querySelector('input[type="range"]');
opacitySlide.addEventListener('input', changeOptions);
const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
for (let check of checkBoxes) {
    check.addEventListener('input', changeOptions);
}

canvas.addEventListener( 'click', generateParticle );
window.addEventListener( 'touchmove', mouse.move );
window.addEventListener( 'touchend', mouse.reset );
window.addEventListener( 'mousemove', mouse.move );
nextFrame();