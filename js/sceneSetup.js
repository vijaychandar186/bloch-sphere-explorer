export function setupScene(visualization) {
    visualization.scene = new THREE.Scene();
    visualization.scene.background = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--background').trim());
    visualization.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    visualization.camera.position.set(5, 3, 5);
    visualization.camera.lookAt(0, 0, 0);
    visualization.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    visualization.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    visualization.renderer.setSize(window.innerWidth, window.innerHeight);
    visualization.renderer.shadowMap.enabled = true;
    visualization.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(visualization.renderer.domElement);
    visualization.scene.add(new THREE.AmbientLight(getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim(), 0.6));
    const directionalLight = new THREE.DirectionalLight(getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim(), 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    visualization.scene.add(directionalLight);
}

export function createBlochSphere(visualization) {
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        color: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        emissive: getComputedStyle(document.documentElement).getPropertyValue('--chart-3').trim(),
        shininess: 100,
    });
    visualization.sphere = new THREE.Mesh(geometry, material);
    visualization.sphere.castShadow = true;
    visualization.scene.add(visualization.sphere);
}

export function createStateVector(visualization) {
    visualization.arrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0).normalize(),
        new THREE.Vector3(0, 0, 0),
        2.2,
        getComputedStyle(document.documentElement).getPropertyValue('--destructive').trim(),
        0.3,
        0.15
    );
    visualization.arrow.line.material.linewidth = 4;
    visualization.scene.add(visualization.arrow);
}

export function createGridSystem(visualization) {
    const meridianMaterial = new THREE.LineBasicMaterial({
        color: getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim(),
        transparent: true,
        opacity: 0.6
    });
    for (let i = 0; i < 16; i++) {
        const points = Array.from({ length: 65 }, (_, j) => {
            const theta = (j / 64) * Math.PI * 2;
            return new THREE.Vector3(
                2 * Math.cos(theta),
                2 * Math.sin(theta) * Math.cos(i * Math.PI / 8),
                2 * Math.sin(theta) * Math.sin(i * Math.PI / 8)
            );
        });
        const meridianLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), meridianMaterial);
        visualization.gridLines.push(meridianLine);
        visualization.scene.add(meridianLine);
    }
    const parallelMaterial = new THREE.LineBasicMaterial({
        color: getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim(),
        transparent: true,
        opacity: 0.4
    });
    for (let i = 1; i < 8; i++) {
        const phi = (i / 8) * Math.PI;
        const y = 2 * Math.cos(phi);
        const r = 2 * Math.sin(phi);
        const points = Array.from({ length: 65 }, (_, j) => {
            const theta = (j / 64) * Math.PI * 2;
            return new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta));
        });
        const parallelLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), parallelMaterial);
        visualization.gridLines.push(parallelLine);
        visualization.scene.add(parallelLine);
    }
}

export function createAxes(visualization) {
    visualization.axesHelper = new THREE.AxesHelper(3);
    const colors = visualization.axesHelper.geometry.attributes.color;
    colors.setXYZ(0, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim().slice(1), 16) / 255, 0, 0);
    colors.setXYZ(1, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim().slice(1), 16) / 255, 0, 0);
    colors.setXYZ(2, 0, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--chart-2').trim().slice(1), 16) / 255, 0);
    colors.setXYZ(3, 0, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--chart-2').trim().slice(1), 16) / 255, 0);
    colors.setXYZ(4, 0, 0, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--chart-3').trim().slice(1), 16) / 255);
    colors.setXYZ(5, 0, 0, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--chart-3').trim().slice(1), 16) / 255);
    colors.needsUpdate = true;
    visualization.scene.add(visualization.axesHelper);
}

export function createTrajectory(visualization) {
    if (visualization.trajectoryLine) visualization.scene.remove(visualization.trajectoryLine);
    const material = new THREE.LineBasicMaterial({
        color: getComputedStyle(document.documentElement).getPropertyValue('--chart-5').trim(),
        transparent: true,
        opacity: 0.8,
        linewidth: 2
    });
    visualization.trajectoryLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(visualization.trajectoryPoints), material);
    visualization.scene.add(visualization.trajectoryLine);
}