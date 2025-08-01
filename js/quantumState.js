export function setPresetState(visualization, theta, phi) {
    visualization.isAnimating = false;
    visualization.elements.toggleText.textContent = 'Start Animation';
    visualization.elements.playIcon.innerHTML = '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>';
    visualization.state.theta = theta * Math.PI / 180;
    visualization.state.phi = phi * Math.PI / 180;
    visualization.elements.thetaSlider.value = theta.toString();
    visualization.elements.phiSlider.value = phi.toString();
    visualization.elements.thetaSlider.disabled = false;
    visualization.elements.phiSlider.disabled = false;
    visualization.updateQuantumState();
    const activeButton = document.querySelector('.preset-btn.active');
    if (activeButton) activeButton.classList.remove('active');
    const clickedButton = document.querySelector(`[data-theta="${theta}"][data-phi="${phi}"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
        setTimeout(() => clickedButton.classList.remove('active'), 1000);
    }
}

export function onSliderChange(visualization) {
    visualization.state.theta = parseFloat(visualization.elements.thetaSlider.value) * Math.PI / 180;
    visualization.state.phi = parseFloat(visualization.elements.phiSlider.value) * Math.PI / 180;
    visualization.updateQuantumState();
}

export function updateSceneColors(visualization) {
    visualization.scene.background = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--background').trim());
    visualization.sphere.material.color.set(getComputedStyle(document.documentElement).getPropertyValue('--primary').trim());
    visualization.sphere.material.emissive.set(getComputedStyle(document.documentElement).getPropertyValue('--chart-3').trim());
    visualization.arrow.setColor(getComputedStyle(document.documentElement).getPropertyValue('--destructive').trim());
    if (visualization.trajectoryLine) {
        visualization.trajectoryLine.material.color.set(getComputedStyle(document.documentElement).getPropertyValue('--chart-5').trim());
    }
    visualization.gridLines.forEach(line => {
        line.material.color.set(getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim());
    });
    const colors = visualization.axesHelper.geometry.attributes.color;
    colors.setXYZ(0, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim().slice(1), 16) / 255, 0, 0);
    colors.setXYZ(1, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim().slice(1), 16) / 255, 0, 0);
    colors.setXYZ(2, 0, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--chart-2').trim().slice(1), 16) / 255, 0);
    colors.setXYZ(3, 0, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--chart-2').trim().slice(1), 16) / 255, 0);
    colors.setXYZ(4, 0, 0, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--chart-3').trim().slice(1), 16) / 255);
    colors.setXYZ(5, 0, 0, parseInt(getComputedStyle(document.documentElement).getPropertyValue('--chart-3').trim().slice(1), 16) / 255);
    colors.needsUpdate = true;
    visualization.scene.children.forEach(child => {
        if (child.isLight && child instanceof THREE.AmbientLight) {
            child.color.set(getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim());
        } else if (child.isLight && child instanceof THREE.DirectionalLight) {
            child.color.set(getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim());
        }
    });
}

export function updateQuantumState(visualization) {
    if (visualization.isAnimating) {
        visualization.state.theta = Math.PI / 2 + Math.PI / 4 * Math.sin(visualization.state.time * visualization.animationSpeed);
        visualization.state.phi = visualization.state.time * visualization.animationSpeed;
        visualization.elements.thetaSlider.value = (visualization.state.theta * 180 / Math.PI).toString();
        visualization.elements.phiSlider.value = ((visualization.state.phi * 180 / Math.PI) % 360).toString();
    }
    const x = Math.sin(visualization.state.theta) * Math.cos(visualization.state.phi);
    const y = Math.cos(visualization.state.theta);
    const z = Math.sin(visualization.state.theta) * Math.sin(visualization.state.phi);
    visualization.arrow.setDirection(new THREE.Vector3(x, y, z).normalize());
    if (visualization.options.showTrajectory) {
        visualization.trajectoryPoints.push(new THREE.Vector3(x * 2, y * 2, z * 2));
        if (visualization.trajectoryPoints.length > 200) visualization.trajectoryPoints.shift();
        visualization.createTrajectory();
    }
    const thetaDeg = Math.round(visualization.state.theta * 180 / Math.PI);
    const phiDeg = Math.round((visualization.state.phi * 180 / Math.PI) % 360);
    visualization.elements.thetaDisplay.textContent = `${thetaDeg}°`;
    visualization.elements.thetaValue.textContent = `${thetaDeg}°`;
    visualization.elements.phiDisplay.textContent = `${phiDeg}°`;
    visualization.elements.phiValue.textContent = `${phiDeg}°`;
    const prob0 = Math.pow(Math.cos(visualization.state.theta / 2), 2);
    const prob1 = Math.pow(Math.sin(visualization.state.theta / 2), 2);
    visualization.elements.prob0.textContent = `${Math.round(prob0 * 100)}%`;
    visualization.elements.prob1.textContent = `${Math.round(prob1 * 100)}%`;
    visualization.elements.prob0Bar.style.width = `${prob0 * 100}%`;
    visualization.elements.prob1Bar.style.width = `${prob1 * 100}%`;
    const alpha = Math.cos(visualization.state.theta / 2);
    const betaMagnitude = Math.sin(visualization.state.theta / 2);
    const phase = Math.abs(visualization.state.phi % (2 * Math.PI)) < 0.01 ? 0 : visualization.state.phi;
    let phaseStr = phase === 0 ? '' : `e<sup>i${(phase % (2 * Math.PI)).toFixed(2)}</sup>`;
    if (Math.abs(visualization.state.phi % (2 * Math.PI) - Math.PI) < 0.01) phaseStr = '-';
    if (Math.abs(visualization.state.phi % (2 * Math.PI) - Math.PI / 2) < 0.01) phaseStr = 'i';
    if (Math.abs(visualization.state.phi % (2 * Math.PI) - 3 * Math.PI / 2) < 0.01) phaseStr = '-i';
    visualization.elements.stateCurrent.innerHTML = Math.abs(alpha) < 0.001
        ? `${phaseStr ? phaseStr + '|' : '|'}1⟩`
        : Math.abs(betaMagnitude) < 0.001
        ? '|0⟩'
        : `${alpha.toFixed(2)}|0⟩ ${phaseStr && betaMagnitude.toFixed(2) !== '0.00' ? (betaMagnitude.toFixed(2)[0] === '-' ? '-' : '+') + ` ${phaseStr}${Math.abs(betaMagnitude).toFixed(2)}|1⟩` : ''}`;
    
    if (visualization.isInitialized) {
        const pole0Pos = new THREE.Vector3(0, 2.2, 0).project(visualization.camera);
        const pole1Pos = new THREE.Vector3(0, -2.2, 0).project(visualization.camera);
        const canvas = visualization.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        visualization.elements.pole0.style.left = `${(pole0Pos.x * 0.5 + 0.5) * width}px`;
        visualization.elements.pole0.style.top = `${(-pole0Pos.y * 0.5 + 0.5) * height}px`;
        visualization.elements.pole1.style.left = `${(pole1Pos.x * 0.5 + 0.5) * width}px`;
        visualization.elements.pole1.style.top = `${(-pole1Pos.y * 0.5 + 0.5) * height}px`;
        visualization.elements.pole0.style.visibility = 'visible';
        visualization.elements.pole1.style.visibility = 'visible';
    }
    visualization.isInitialized = true;
}

export function animate(visualization) {
    requestAnimationFrame(() => visualization.animate());
    if (visualization.isAnimating) visualization.state.time += 0.01;
    visualization.updateQuantumState();
    if (visualization.sphere) visualization.sphere.rotation.y += 0.002;
    visualization.controls.update();
    visualization.renderer.render(visualization.scene, visualization.camera);
}