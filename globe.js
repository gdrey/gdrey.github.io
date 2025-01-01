// Create the Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Transparent background
renderer.setSize(200, 200); // Globe size
document.getElementById('globe-container').appendChild(renderer.domElement);

// Create the Sphere Geometry for the Globe
const geometry = new THREE.SphereGeometry(5, 32, 32);

// Load the Globe Texture
const texture = new THREE.TextureLoader().load('./assets/globe.jpg'); // Update with your file's path
const material = new THREE.MeshBasicMaterial({ map: texture });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Set the Camera Position
camera.position.z = 15;

// Globe Rotation Animation
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Enable Dragging to Rotate the Globe
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.getElementById('globe-container').addEventListener('mousedown', () => {
    isDragging = true;
    document.getElementById('globe-container').style.cursor = 'grabbing';
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.getElementById('globe-container').style.cursor = 'grab';
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
        };

        globe.rotation.y += deltaMove.x * 0.01;
        previousMousePosition = {
            x: event.clientX,
        };
    }
});

// Add Scroll Bar Interactivity
const scrollThumb = document.getElementById('scroll-thumb');
const scrollBar = document.getElementById('scroll-bar');
let isScrolling = false;

scrollBar.addEventListener('mousedown', (event) => {
    isScrolling = true;
    const rect = scrollBar.getBoundingClientRect();
    const position = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    updateScrollThumb(position, rect.width);
});

document.addEventListener('mouseup', () => {
    isScrolling = false;
});

document.addEventListener('mousemove', (event) => {
    if (isScrolling) {
        const rect = scrollBar.getBoundingClientRect();
        const position = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
        updateScrollThumb(position, rect.width);
    }
});

function updateScrollThumb(position, maxWidth) {
    scrollThumb.style.left = `${position}px`;
    const normalizedPosition = position / maxWidth;
    globe.rotation.y = normalizedPosition * Math.PI * 2; // Normalize to full rotation
}
