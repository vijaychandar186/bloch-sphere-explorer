export class BlochSphereVisualization {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.sphere = null;
        this.arrow = null;
        this.controls = null;
        this.trajectoryLine = null;
        this.trajectoryPoints = [];
        this.axesHelper = null;
        this.gridLines = [];
        this.state = { theta: Math.PI / 2, phi: 0, time: 0 };
        this.options = { showTrajectory: false, showGrid: true, showAxes: true };
        this.isAnimating = false;
        this.animationSpeed = 0.5;
        this.isInitialized = false;

        this.elements = {
            toggleBtn: document.getElementById('toggleBtn'),
            thetaSlider: document.getElementById('thetaSlider'),
            phiSlider: document.getElementById('phiSlider'),
            speedSlider: document.getElementById('speedSlider'),
            thetaDisplay: document.getElementById('theta-display'),
            phiDisplay: document.getElementById('phi-display'),
            thetaValue: document.getElementById('theta-value'),
            phiValue: document.getElementById('phi-value'),
            speedValue: document.getElementById('speed-value'),
            stateCurrent: document.getElementById('state-current'),
            prob0: document.getElementById('prob0'),
            prob1: document.getElementById('prob1'),
            prob0Bar: document.getElementById('prob0-bar'),
            prob1Bar: document.getElementById('prob1-bar'),
            pole0: document.getElementById('pole0'),
            pole1: document.getElementById('pole1'),
            playIcon: document.getElementById('playIcon'),
            toggleText: document.getElementById('toggleText'),
            themeToggle: document.getElementById('themeToggle'),
            themeIcon: document.getElementById('themeIcon'),
            hamburgerBtn: document.getElementById('hamburgerBtn'),
            controlPanel: document.getElementById('controlPanel'),
            fullscreenToggle: document.getElementById('fullscreenToggle'),
            fullscreenIcon: document.getElementById('fullscreenIcon'),
            helpToggle: document.getElementById('helpToggle'),
            helpPanel: document.getElementById('helpPanel'),
            showTrajectory: document.getElementById('showTrajectory'),
            showGrid: document.getElementById('showGrid'),
            showAxes: document.getElementById('showAxes'),
        };
    }

    init() {
        this.setupScene();
        this.createBlochSphere();
        this.createStateVector();
        this.createGridSystem();
        this.createAxes();
        this.setupControls();
        this.setupEventListeners();
        this.setupPresetButtons();
        this.updateThemeIcon();
        this.updateQuantumState();
        this.animate();
    }

    saveTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
}