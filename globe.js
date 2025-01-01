// Create the Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Adjust aspect ratio for square canvas
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Transparent background
renderer.setSize(100, 100); // Set the globe size
document.getElementById('globe-container').appendChild(renderer.domElement);

// Create a Sphere Geometry for the Globe
const geometry = new THREE.SphereGeometry(5, 32, 32);

// Load the Globe Texture
const texture = new THREE.TextureLoader().load('./assets/globe.jpg');
const material = new THREE.MeshBasicMaterial({ map: texture });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Set the Camera Position
camera.position.z = 15;

// Add Animation Loop
function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.01; // Rotate the globe
    renderer.render(scene, camera);
}
animate();
