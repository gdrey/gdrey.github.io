// Create the Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Adjust aspect ratio for square canvas
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Transparent background
renderer.setSize(200, 200); // Set the globe size
document.getElementById('globe-container').appendChild(renderer.domElement);

// Create a Sphere Geometry for the Globe
const geometry = new THREE.SphereGeometry(5, 32, 32);

// Load the Globe Texture
const texture = new THREE.TextureLoader().load('./assets/globe.jpg'); // Relative path to the globe texture
const material = new THREE.MeshBasicMaterial({ map: texture });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Set the Camera Position
camera.position.z = 15;

// Add Animation Loop
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
            y: event.clientY - previousMousePosition.y,
        };

        globe.rotation.y += deltaMove.x * 0.01; // Adjust rotation sensitivity
        globe.rotation.x += deltaMove.y * 0.01;
    }

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
    };
});

// Adjust Camera and Renderer on Window Resize (Optional for this case)
window.addEventListener('resize', () => {
    renderer.setSize(200, 200); // Keep the globe size constant
    camera.aspect = 1; // Maintain square aspect ratio
    camera.updateProjectionMatrix();
});
