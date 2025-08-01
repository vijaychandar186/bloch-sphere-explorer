export function setupControls(visualization) {
    visualization.controls = new THREE.OrbitControls(visualization.camera, visualization.renderer.domElement);
    visualization.controls.enableDamping = true;
    visualization.controls.dampingFactor = 0.05;
    visualization.controls.enableZoom = true;
    visualization.controls.enablePan = false;
    visualization.controls.minDistance = 3;
    visualization.controls.maxDistance = 10;
}

export function setupEventListeners(visualization) {
    visualization.elements.toggleBtn.addEventListener('click', () => visualization.toggleAnimation());
    visualization.elements.thetaSlider.addEventListener('input', () => visualization.onSliderChange());
    visualization.elements.phiSlider.addEventListener('input', () => visualization.onSliderChange());
    visualization.elements.speedSlider.addEventListener('input', () => {
        visualization.animationSpeed = parseFloat(visualization.elements.speedSlider.value);
        visualization.elements.speedValue.textContent = `${visualization.animationSpeed.toFixed(1)}x`;
    });
    visualization.elements.hamburgerBtn.addEventListener('click', () => visualization.toggleControlPanel());
    visualization.elements.themeToggle.addEventListener('click', (event) => visualization.toggleTheme(event));
    visualization.elements.fullscreenToggle.addEventListener('click', () => visualization.toggleFullscreen());
    visualization.elements.helpToggle.addEventListener('click', () => visualization.toggleHelpPanel());
    visualization.elements.showTrajectory.addEventListener('change', () => {
        visualization.options.showTrajectory = visualization.elements.showTrajectory.checked;
        if (!visualization.options.showTrajectory && visualization.trajectoryLine) {
            visualization.scene.remove(visualization.trajectoryLine);
            visualization.trajectoryPoints = [];
        }
    });
    visualization.elements.showGrid.addEventListener('change', () => {
        visualization.options.showGrid = visualization.elements.showGrid.checked;
        visualization.gridLines.forEach(line => (line.visible = visualization.options.showGrid));
    });
    visualization.elements.showAxes.addEventListener('change', () => {
        visualization.options.showAxes = visualization.elements.showAxes.checked;
        visualization.axesHelper.visible = visualization.options.showAxes;
    });
    window.addEventListener('resize', () => {
        visualization.camera.aspect = window.innerWidth / window.innerHeight;
        visualization.camera.updateProjectionMatrix();
        visualization.renderer.setSize(window.innerWidth, window.innerHeight);
        visualization.updateQuantumState();
    });
}

export function setupPresetButtons(visualization) {
    document.querySelectorAll('.preset-btn').forEach(button => {
        button.addEventListener('click', () => {
            const theta = parseFloat(button.getAttribute('data-theta') || '0');
            const phi = parseFloat(button.getAttribute('data-phi') || '0');
            visualization.setPresetState(theta, phi);
        });
    });
}

export function toggleAnimation(visualization) {
    visualization.isAnimating = !visualization.isAnimating;
    visualization.elements.thetaSlider.disabled = visualization.isAnimating;
    visualization.elements.phiSlider.disabled = visualization.isAnimating;
    visualization.elements.toggleText.textContent = visualization.isAnimating ? 'Pause Animation' : 'Start Animation';
    visualization.elements.playIcon.innerHTML = visualization.isAnimating
        ? '<path fill-rule="evenodd" d="M6 5h4v14H6zm8 0h4v14h-4z"/>'
        : '<path d="M8 5v14l11-7z"/>';
}

export function toggleControlPanel(visualization) {
    visualization.elements.controlPanel.classList.toggle('open');
    visualization.elements.hamburgerBtn.querySelector('svg').innerHTML = visualization.elements.controlPanel.classList.contains('open')
        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>';
    if (visualization.elements.helpPanel.classList.contains('open')) {
        visualization.toggleHelpPanel();
    }
}

export function toggleHelpPanel(visualization) {
    visualization.elements.helpPanel.classList.toggle('open');
    visualization.elements.helpToggle.querySelector('svg').innerHTML = visualization.elements.helpPanel.classList.contains('open')
        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>';
    if (visualization.elements.controlPanel.classList.contains('open')) {
        visualization.toggleControlPanel();
    }
}

export function toggleTheme(visualization, event) {
    const x = event.clientX || window.innerWidth / 2;
    const y = event.clientY || window.innerHeight / 2;
    document.documentElement.style.setProperty('--x', `${x}px`);
    document.documentElement.style.setProperty('--y', `${y}px`);
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            document.documentElement.classList.toggle('dark');
            visualization.saveTheme();
            visualization.updateSceneColors();
            visualization.updateThemeIcon();
        });
    } else {
        document.documentElement.classList.toggle('dark');
        visualization.saveTheme();
        visualization.updateSceneColors();
        visualization.updateThemeIcon();
    }
}

export function updateThemeIcon(visualization) {
    const isDark = document.documentElement.classList.contains('dark');
    visualization.elements.themeIcon.innerHTML = isDark
        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
}

export function toggleFullscreen(visualization) {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.error(`Fullscreen error: ${err.message}`));
        visualization.elements.fullscreenIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
    } else {
        document.exitFullscreen().catch(err => console.error(`Fullscreen exit error: ${err.message}`));
        visualization.elements.fullscreenIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>';
    }
}