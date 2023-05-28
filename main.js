var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);

var filterSelect = document.getElementById('filterSelect');
filterSelect.addEventListener('change', handleFilter, false);

var brightnessRange = document.getElementById('brightnessRange');
brightnessRange.addEventListener('input', handleBrightness, false);

var saturationRange = document.getElementById('saturationRange');
saturationRange.addEventListener('input', handleSaturation, false);

var scene, camera, renderer;
var geometry, material, mesh;
var texture = null;
var brightnessValue = 1.0;
var saturationValue = 1.0;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 1;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('canvas-container').appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function handleImage(e) {
  var reader = new FileReader();
  reader.onload = function(event) {
    new THREE.TextureLoader().load(event.target.result, function(tex) {
      texture = tex;
      applyFilter();
    });
  };
  reader.readAsDataURL(e.target.files[0]);
}

function handleFilter(e) {
  if (texture) {
    applyFilter();
  }
}

function handleBrightness(e) {
  brightnessValue = parseFloat(e.target.value);
  if (texture) {
    applyFilter();
  }
}

function handleSaturation(e) {
  saturationValue = parseFloat(e.target.value);
  if (texture) {
    applyFilter();
  }
}

function applyFilter() {
  // dispose previous mesh if any
  if (mesh) {
    mesh.material.dispose();
    mesh.geometry.dispose();
    scene.remove(mesh);
  }

  // create new mesh with the applied filter
  geometry = new THREE.PlaneBufferGeometry(texture.image.width / texture.image.height, 1);
  material = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: texture },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      brightness: { value: brightnessValue },
      saturation: { value: saturationValue },
    },
    vertexShader: document.getElementById('vertex-shader').textContent,
    fragmentShader: document.getElementById('fragment-shader-' + filterSelect.value).textContent,
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}
var downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', handleDownload, false);

function handleDownload(e) {
  // Render the scene
  renderer.render(scene, camera);

  // Convert the WebGL output to a data URL
  var dataUrl = renderer.domElement.toDataURL('image/png');

  // Set up a virtual link
  var link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'image.png';
  
  // Trigger a click event on the link to start the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}





init();
animate();
