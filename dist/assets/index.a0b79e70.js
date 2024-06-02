const U=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))e(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&e(a)}).observe(document,{childList:!0,subtree:!0});function i(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerpolicy&&(o.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?o.credentials="include":s.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function e(s){if(s.ep)return;s.ep=!0;const o=i(s);fetch(s.href,o)}};U();function V(n){return document.querySelector(n)}function k(n){return document.querySelectorAll(n)}Element.prototype.z=Element.prototype.querySelector;Element.prototype.Z=Element.prototype.querySelectorAll;function M(){Element.prototype.computedStyle=function(n){return getComputedStyle(this).getPropertyValue(n)}}M();function W(){HTMLElement.prototype.slideToggle=F}function F(n=400,t="ease"){if(this.slideState||(this.slideState="open"),this.slideState==="opening"||this.state==="closing"){this.animation.reverse(),this.slideState==="opening"?this.slideState="closing":this.slideState="opening";return}this.style.overflow="hidden",this.style.removeProperty("display");const i={height:[this.computedStyle("height"),"0px"],paddingBlock:[this.computedStyle("padding-block"),"0px"],borderBlockWidth:[this.computedStyle("border-block-width"),"0px"],marginBlock:[this.computedStyle("margin-block"),"0px"],outlineWidth:[this.computedStyle("outline-width"),"0px"],boxShadow:[this.computedStyle("box-shadow"),"0 0 0 0 transparent"]};if(this.slideState==="closed")for(let e in i)i[e].reverse();this.animation=this.animate(i,{duration:n,easing:t}),this.slideState=this.slideState==="closed"?"opening":"closing",this.animation.onfinish=()=>{this.slideState==="opening"?(this.slideState="open",this.style.removeProperty("overflow")):(this.slideState="closed",this.style.display="none",this.style.removeProperty("overflow"))}}function G(){EventTarget.prototype.on=EventTarget.prototype.addEventListener,NodeList.prototype.on=function(n,t,i){this.forEach(e=>e.on(n,t,i))},EventTarget.prototype.trigger=async function(n,t){this.dispatchEvent(new CustomEvent(n,t))},NodeList.prototype.trigger=async function(n,t){this.forEach(i=>i.trigger(n,t))},EventTarget.prototype.off=EventTarget.prototype.removeEventListener,NodeList.prototype.off=function(n,t,i){this.forEach(e=>e.off(n,t,i))}}const N={sliding:W,events:G,style:M,init(n){n.forEach(t=>N[t]())}};class h{get r(){return this.data[0]}get g(){return this.data[1]}get b(){return this.data[2]}get a(){return this.data[3]}set r(t){this.data[0]=t}set g(t){this.data[1]=t}set b(t){this.data[2]=t}set a(t){this.data[3]=t}constructor(t=h.randHex(),i=h.randHex(),e=h.randHex(),s=1){this.data=[t,i,e,s]}get rgba(){return`rgba(${this.data.join(", ")})`}static avgColors(t){const i=[0,0,0];t.forEach(e=>{for(let s in i)i[s]+=e.data[s]**2});for(let e in i)i[e]=(i[e]/t.length)**.5;return new h(i[0],i[1],i[2])}static randHex(){return Math.round(Math.random()*255)}}class r{constructor(t){this.vec=t}get x(){return this.vec[0]}get y(){return this.vec[1]}set x(t){this.vec[0]=t}set y(t){this.vec[1]=t}get norm(){return(this.x**2+this.y**2)**.5}copy(){return new r([this.vec[0],this.vec[1]])}set(t,i){this.x=t,this.y=i}scale(t){this.x*=t,this.y*=t}adjust(t){this.x+=t.x,this.y+=t.y}perp(){return new r([-this.y,this.x])}mult(t){return new r([this.x*t,this.y*t])}dot(t){return this.x*t.x+this.y*t.y}add(t){return new r([this.x+t.x,this.y+t.y])}minus(t){return this.add(t.mult(-1))}getUnit(){return this.mult(1/this.norm)}}const f=Math.PI,X=()=>2*f*Math.random(),Y=()=>{const n=X();return new r([Math.cos(n),Math.sin(n)])};class z{constructor(){this.events={}}on(t,i){const e=this.events[t];e?e.push(i):this.events[t]=[i]}trigger(t,i){const e=this.events[t];e&&e.forEach(s=>s(i))}off(t,i){const e=this.events[t].indexOf(i);e!==-1&&this.events[t].splice(e,1)}}class Z extends z{constructor(t,i,e,s){super(),this.move=()=>{this.position.adjust(this.velocity)},this.handleBoundCollision=o=>{o.direction==="horizontal"?(this.vx*=-1,this.x+=o.adj):o.direction==="vertical"&&(this.vy*=-1,this.y+=o.adj)},this.handleCollision=o=>{this.velocity=o.v},this.id=s,this.position=t,this.velocity=Y().mult(i),this.radius=e,this.mass=4/3*f*this.radius**3,this.color=new h,this.on("boundsCollide",this.handleBoundCollision),this.on("collision",this.handleCollision)}get x(){return this.position.x}get y(){return this.position.y}get vx(){return this.velocity.x}get vy(){return this.velocity.y}get speed(){return this.velocity.norm}get direction(){return Math.acos(this.vx/this.speed)}set x(t){this.position.x=t}set y(t){this.position.y=t}set vx(t){this.velocity.x=t}set vy(t){this.velocity.y=t}}const $={minSpeed:.3,maxSpeed:.5,minRadius:2,maxRadius:8,initialNumber:15,vicinity:50};class K extends z{constructor(t,i){super(),this.particles=new Set,this.options={...$,...t},this.setCellSize(),this.setBounds(i),this.checked=new Set,this.initialiseParticles(),this.on("incrementTime",this.incrementTime.bind(this))}incrementTime(){this.particles.forEach(t=>{t.move(),this.updateParticleCell(t),this.checkForBoundsCollision(t),this.checkParticleVicinity(t)}),this.checked.clear()}initialiseParticles(){this.particles.clear();for(let t=this.options.initialNumber;t>0;t--)this.add()}clearParticles(){this.particles.clear(),this.grid.forEach(t=>t.forEach(i=>i.clear()))}checkForBoundsCollision(t){const i=t.x-t.radius<=0,e=t.x+t.radius>=this.bounds.x,s=t.y-t.radius<=0,o=t.y+t.radius>=this.bounds.y;(i||e)&&t.trigger("boundsCollide",{direction:"horizontal",adj:i?t.radius-t.x:this.bounds.x-t.x-t.radius}),(o||s)&&t.trigger("boundsCollide",{direction:"vertical",adj:s?t.radius-t.y:this.bounds.y-t.y-t.radius})}checkParticleVicinity(t){const i=this.getParticleCoords(t);for(let e=i.x-1;e<=i.x+1;e++)for(let s=i.y-1;s<=i.y+1;s++){const o=this.getCell(new r([e,s]));!o||o.forEach(a=>this.handleNearbyParticle(t,a))}this.checked.add(t.id)}handleNearbyParticle(t,i){if(this.checked.has(i.id)||t===i)return;const e=t.position.minus(i.position),s=e.norm,o=t.radius+i.radius;if(s<=this.options.vicinity)this.trigger("inVicinity",{p:t,q:i});else if(this.options.vicinity>o)return;const d=s<=o;if(!d)return;const l=d&&e.getUnit(),c=d&&e.perp().getUnit();B();const u=t.velocity.dot(l),m=i.velocity.dot(l),x=t.velocity.dot(c),b=i.velocity.dot(c),C=t.mass+i.mass,S=(i.mass*(m-u)+t.mass*u+i.mass*m)/C,w=(t.mass*(u-m)+t.mass*u+i.mass*m)/C,p=new r([1,0]),g=new r([0,1]),O=l.mult(S).dot(p)+c.mult(x).dot(p),R=l.mult(S).dot(g)+c.mult(x).dot(g),A=l.mult(w).dot(p)+c.mult(b).dot(p),T=l.mult(w).dot(g)+c.mult(b).dot(g),H=new r([O,R]),j=new r([A,T]);t.trigger("collision",{v:H}),i.trigger("collision",{v:j});function B(){const P=o-s,E=t.radius/o,D=l.mult((1-E)*P);t.position.adjust(D);const I=l.mult(E*-P);i.position.adjust(I)}}randomPosition(){const t=Math.random()*(this.bounds.x-2*this.options.maxRadius)+this.options.maxRadius,i=Math.random()*(this.bounds.y-2*this.options.maxRadius)+this.options.maxRadius;return new r([t,i])}randomSpeed(){return Math.random()*(this.options.maxSpeed-this.options.minSpeed)+this.options.minSpeed}add(t=this.randomPosition()){const i=this.randomSpeed(),e=this.options.minRadius+(this.options.maxRadius-this.options.minRadius)*((i-this.options.minSpeed)/(this.options.maxSpeed-this.options.minSpeed+1e-6)),s=new Z(t,i,e,this.particles.size);this.particles.add(s),this.updateParticleCell(s)}updateParticleCell(t){const i=this.getParticleCoords(t),e=(t==null?void 0:t.cellCoords)!==void 0;if(!(!e||i.x!==t.cellCoords.x||i.y!==t.cellCoords.y))return;e&&this.getCell(t.cellCoords).delete(t),t.cellCoords=i,this.getCell(i).add(t)}getParticleCoords(t){const i=[Math.min(Math.max(0,Math.floor(t.x/this.cellSize)),this.grid.length-1),Math.min(Math.max(0,Math.floor(t.y/this.cellSize)),this.grid[0].length-1)];return new r(i)}getCell(t){if(t.x>=this.grid.length||t.y>=this.grid[0].length||t.x<0||t.y<0)return;let i=this.grid[t.x][t.y];return i===void 0&&(i=new Set,this.grid[t.x][t.y]=i),i}setCellSize(){this.cellSize=Math.ceil(Math.max(2*this.options.minRadius,this.options.vicinity,40))}setGrid(){this.grid=new Array(Math.ceil(this.bounds.x/this.cellSize)).fill(void 0),this.grid=this.grid.map(t=>new Array(Math.ceil(this.bounds.y/this.cellSize))),this.particles.forEach(t=>{t.cellCoords=void 0,this.updateParticleCell(t)})}setBounds(t){this.bounds=t,this.setGrid()}}const Q={fill:!0,"fill-color":"","fill-opacity":.75,outline:!1,edges:!0,"edge-opacity":.8,"mouse-edges":!0,"pixel-density":1,"min-speed":.1,"max-speed":.8,"min-radius":1,"max-radius":5,"initial-number":30,vicinity:75};class L extends HTMLElement{connectedCallback(){this.refresh(),this.ctx=this.canvas.getContext("2d"),this.manager=new K(this.managerOptions,new r([this.canvas.width,this.canvas.height])),this.mousePosition=new r([0,0]),new ResizeObserver(()=>requestAnimationFrame(this.resize.bind(this))).observe(this),this.canvas.addEventListener("mouseenter",this.mouseEnterHandler),this.canvas.addEventListener("mousemove",this.hoverHandler,{passive:!0}),this.canvas.addEventListener("mouseleave",this.mouseLeaveHandler),this.canvas.addEventListener("click",this.mouseClickHandler),this.manager.on("inVicinity",this.inVicinityHandler),this.renderLoop()}disconnectedCallback(){}constructor(){super(),this.renderLoop=()=>{this.render();const i=this.renderLoop;requestAnimationFrame(i)},this.hoverHandler=i=>{requestAnimationFrame(()=>{this.mousePosition.set(i.layerX*this.options.pixelDensity,i.layerY*this.options.pixelDensity)})},this.mouseClickHandler=i=>{this.manager.add(this.mousePosition.copy())},this.mouseEnterHandler=i=>{this.mousePosition.set(i.layerX*this.options.pixelDensity,i.layerY*this.options.pixelDensity),this.mousePosition.active=!0},this.mouseLeaveHandler=()=>{this.mousePosition.set(0,0),this.mousePosition.active=!1},this.inVicinityHandler=i=>{this.options.edges&&this.renderEdge(i.p,i.q)},this.options={fill:this.setting("fill")==="true",fillColor:this.setting("fill-color"),fillOpacity:Number(this.setting("fill-opacity")),outline:this.setting("outline")==="true",edges:this.setting("edges")==="true",edgeOpacity:Number(this.setting("edge-opacity")),mouseEdges:this.setting("mouse-edges")==="true",pixelDensity:Number(this.setting("pixel-density"))},this.managerOptions={minSpeed:Number(this.setting("min-speed")),maxSpeed:Number(this.setting("max-speed")),minRadius:parseInt(this.setting("min-radius")),maxRadius:parseInt(this.setting("max-radius")),initialNumber:parseInt(this.setting("initial-number")),vicinity:parseInt(this.setting("vicinity"))};const t=this.attachShadow({mode:"closed"});this.canvas=document.createElement("canvas"),this.canvas.style.setProperty("display","block"),this.canvas.style.setProperty("width","100%"),this.canvas.style.setProperty("height","100%"),t.appendChild(this.canvas)}attributeChangedCallback(t,i,e){if(e===null||!(this!=null&&this.manager))return;let s;switch(t){case"fill":this.options.fill=e==="true";break;case"fill-color":this.options.fillColor=e;break;case"fill-opacity":this.options.fillOpacity=Number(e);break;case"outline":this.options.outline=e==="true";break;case"edges":this.options.edges=e==="true";break;case"edge-opacity":this.options.edgeOpacity=Number(e);break;case"mouse-edges":this.options.mouseEdges=e==="true";break;case"pixel-density":this.options.pixelDensity=Number(e),this.resize();break;case"min-speed":s=Number(e),this.manager.options.minSpeed=isNaN(s)?0:Math.max(s,0);break;case"max-speed":s=Number(e),this.manager.options.maxSpeed=isNaN(s)?0:Math.max(s,0);break;case"min-radius":this.manager.options.minRadius=y(e);break;case"max-radius":this.manager.options.minRadius=y(e);break;case"initial-number":this.manager.options.initialNumber=y(e),this.manager.clearParticles(),this.manager.initialiseParticles();break;case"vicinity":this.manager.options.vicinity=y(e),this.manager.setCellSize(),this.resize();break}}setting(t){const i=this.getAttribute(t);return i!==null?i:Q[t].toString()}get area(){return this.canvas.width*this.canvas.height}render(){this.setUpParticleRendering(),this.manager.trigger("incrementTime"),this.manager.particles.forEach(t=>{this.renderParticle(t)}),this.mousePosition.active&&this.options.mouseEdges&&this.renderMouseEdges()}refresh(){this.canvas.width=this.canvas.scrollWidth*this.options.pixelDensity,this.canvas.height=this.canvas.scrollHeight*this.options.pixelDensity}resize(){const t=[this.canvas.width,this.canvas.height,this.area];if(this.refresh(),!(this!=null&&this.manager))return;const i=this.area/t[2];this.manager.options.vicinity*=i**.5,this.manager.particles.forEach(e=>{e.position.set(e.x*(this.canvas.width/t[0]),e.y*(this.canvas.height/t[1]))}),this.manager.setBounds(new r([this.canvas.width,this.canvas.height])),this.manager.setGrid()}setUpParticleRendering(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.lineCap="round",this.options.fillColor&&(this.ctx.strokeStyle=this.options.fillColor)}renderParticle(t){const i=this.ctx;i.globalAlpha=this.options.fillOpacity,(this.options.fill||this.options.outline)&&(i.beginPath(),i.arc(t.x,t.y,t.radius,0,2*f)),this.options.fill&&(i.fillStyle=this.options.fillColor||t.color.rgba,i.fill()),this.options.outline&&(i.strokeStyle=this.options.fillColor||t.color.rgba,i.lineWidth=t.radius/3,i.stroke()),i.globalAlpha=1}renderEdge(t,i){const e=this.ctx,o=t.position.minus(i.position).norm,a=t.radius+i.radius,d=this.options.edgeOpacity-(o-a)/((this.manager.options.vicinity-a)/this.options.edgeOpacity);this.options.fillColor||(e.strokeStyle=h.avgColors([t.color,i.color]).rgba),e.globalAlpha=d,e.lineWidth=a/5,e.beginPath(),e.moveTo(t.x,t.y),e.lineTo(i.x+i.vx,i.y+i.vy),e.stroke(),e.globalAlpha=1}renderMouseEdges(){this.manager.particles.forEach(t=>{const i=t.position.minus(this.mousePosition).norm,e=this.options.edgeOpacity;if(i>this.manager.options.vicinity*1.5)return;const s=e-i/(this.manager.options.vicinity*1.5/e),o=this.ctx;o.beginPath(),o.strokeStyle=this.options.fillColor||t.color.rgba,o.globalAlpha=s,o.lineWidth=t.radius*.8,o.moveTo(t.x,t.y),o.lineTo(this.mousePosition.x,this.mousePosition.y),o.stroke(),o.globalAlpha=1})}}L.observedAttributes=["fill-opacity","edge-opacity","mouse-edges","fill","fill-color","outline","edges","pixel-density","min-speed","max-speed","min-radius","max-radius","initial-number","vicinity"];function y(n){let t=parseInt(n);return isNaN(t)?0:Math.max(t,0)}window.customElements.define("particle-canvas",L);N.init(["events"]);const J=V("particle-canvas");function q(n){const t=n.currentTarget;v(t)}k("form").on("reset",n=>{for(let t of n.currentTarget.elements)requestAnimationFrame(()=>v(t))});k('[type="range"], [type="checkbox"], [type="number"], [type="color"]').forEach(n=>{v(n),n.on("input",q)});function v(n){const t=n.name;if(n.type==="reset")return;const i=_(n);J.setAttribute(t.toString(),i)}function _(n){let t;switch(n.type){case"checkbox":t=!!n.checked;break;default:t=n.value}return t}
//# sourceMappingURL=index.a0b79e70.js.map
