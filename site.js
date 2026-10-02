const SCENES = {
    halloween: ["Pumpkins, a big moon and little bats", "The Halloween night scene with pumpkins, a big moon and little bats"],
    autumn: ["Orange leaves tumbling down", "The Autumn hills scene with orange trees and falling leaves"],
    snow: ["Soft snow falling on a warm cabin", "The Snowy cabin scene with pine trees and a lit window"],
    fireflies: ["Fireflies glowing under the stars", "The Firefly night scene with stars, a moon and glowing fireflies"],
    lights: ["Twinkly lights, cocoa and snow", "The Fairy lights scene with strings of lights, a mug and a present"],
};

const scene = document.getElementById("scene");
const caption = document.getElementById("scene-caption");

Object.keys(SCENES).forEach((key) => {
    const preload = new Image();
    preload.src = `images/desk-${key}.jpg`;
});

document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((other) => {
            other.classList.toggle("on", other === tab);
            other.setAttribute("aria-selected", other === tab);
        });
        const key = tab.dataset.scene;
        scene.style.opacity = 0;
        setTimeout(() => {
            scene.src = `images/desk-${key}.jpg`;
            scene.alt = SCENES[key][1];
            caption.textContent = SCENES[key][0];
            scene.style.opacity = 1;
        }, 200);
    });
});

const canvas = document.getElementById("leaves");
const pen = canvas.getContext("2d");
const COLORS = ["#7E8F5E", "#98A677", "#6F7F52", "#A9A56E", "#E9A0A3"];
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let leaves = [];

function size() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    pen.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function leaf(fresh) {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    return {
        x: Math.random() * width,
        y: fresh ? Math.random() * height : -30,
        vx: 10 + Math.random() * 25,
        vy: 25 + Math.random() * 30,
        size: 8 + Math.random() * 9,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 2,
        sway: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
}

function draw(item) {
    pen.save();
    pen.translate(item.x, item.y);
    pen.rotate(item.angle);
    pen.fillStyle = item.color;
    pen.globalAlpha = 0.8;
    pen.beginPath();
    pen.moveTo(0, -item.size);
    pen.quadraticCurveTo(item.size * 0.75, 0, 0, item.size);
    pen.quadraticCurveTo(-item.size * 0.75, 0, 0, -item.size);
    pen.fill();
    pen.restore();
}

let last = performance.now();
function frame(now) {
    const step = Math.min((now - last) / 1000, 0.1);
    last = now;
    pen.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    leaves.forEach((item, index) => {
        item.sway += step;
        item.angle += item.spin * step;
        item.x += (item.vx + Math.sin(item.sway) * 16) * step;
        item.y += item.vy * step;
        if (item.y > canvas.offsetHeight + 30 || item.x > canvas.offsetWidth + 30) leaves[index] = leaf(false);
        draw(item);
    });
    requestAnimationFrame(frame);
}

if (!calm) {
    size();
    leaves = Array.from({ length: 18 }, () => leaf(true));
    window.addEventListener("resize", size);
    requestAnimationFrame(frame);
}
