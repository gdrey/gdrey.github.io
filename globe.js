// Create the Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Transparent background
renderer.setSize(200, 200); // Globe size
document.getElementById('globe-container').appendChild(renderer.domElement);

// Create the Sphere Geometry for the Globe
const geometry = new THREE.SphereGeometry(5, 32, 32);

// Load the Custom Globe Texture
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

        // Adjust the globe's rotation
        globe.rotation.y += deltaMove.x * 0.01;

        // Determine which part of the image is visible
        const visibleAngle = (globe.rotation.y % (2 * Math.PI)) / Math.PI; // Normalized rotation (0 to 2)
        if (visibleAngle > 0.25 && visibleAngle < 0.75) {
            // Middle (dark) section is visible
            document.body.style.backgroundColor = '#333';
            document.body.style.color = 'white';
        } else {
            // Light sections are visible
            document.body.style.backgroundColor = '#f0f0f0';
            document.body.style.color = 'black';
        }

        previousMousePosition = {
            x: event.clientX,
        };
    }
});

// Adjust Renderer and Camera on Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(200, 200);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
});
