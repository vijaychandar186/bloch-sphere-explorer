import { BlochSphereVisualization } from './blochSphere.js';
import { setupScene, createBlochSphere, createStateVector, createGridSystem, createAxes, createTrajectory } from './sceneSetup.js';
import { setupControls, setupEventListeners, setupPresetButtons, toggleAnimation, toggleControlPanel, toggleHelpPanel, toggleTheme, updateThemeIcon, toggleFullscreen } from './eventHandlers.js';
import { setPresetState, onSliderChange, updateSceneColors, updateQuantumState, animate } from './quantumState.js';

// Extend BlochSphereVisualization to include modular methods
class ExtendedBlochSphereVisualization extends BlochSphereVisualization {
    constructor() {
        super();
        this.setupScene = () => setupScene(this);
        this.createBlochSphere = () => createBlochSphere(this);
        this.createStateVector = () => createStateVector(this);
        this.createGridSystem = () => createGridSystem(this);
        this.createAxes = () => createAxes(this);
        this.createTrajectory = () => createTrajectory(this);
        this.setupControls = () => setupControls(this);
        this.setupEventListeners = () => setupEventListeners(this);
        this.setupPresetButtons = () => setupPresetButtons(this);
        this.toggleAnimation = () => toggleAnimation(this);
        this.toggleControlPanel = () => toggleControlPanel(this);
        this.toggleHelpPanel = () => toggleHelpPanel(this);
        this.toggleTheme = (event) => toggleTheme(this, event);
        this.updateThemeIcon = () => updateThemeIcon(this);
        this.toggleFullscreen = () => toggleFullscreen(this);
        this.setPresetState = (theta, phi) => setPresetState(this, theta, phi);
        this.onSliderChange = () => onSliderChange(this);
        this.updateSceneColors = () => updateSceneColors(this);
        this.updateQuantumState = () => updateQuantumState(this);
        this.animate = () => animate(this);
    }
}

// Load HTML partials dynamically
async function loadPartials() {
    const containers = {
        'pole-labels-container': 'templates/pole-labels.html',
        'top-buttons-container': 'templates/top-buttons.html',
        'control-panel-container': 'templates/control-panel.html',
        'help-panel-container': 'templates/help-panel.html'
    };

    for (const [containerId, filePath] of Object.entries(containers)) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to load ${filePath}`);
            const html = await response.text();
            document.getElementById(containerId).innerHTML = html;
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
        }
    }
}

// Initialize the visualization after partials are loaded
document.addEventListener('DOMContentLoaded', async () => {
    await loadPartials();
    const visualization = new ExtendedBlochSphereVisualization();
    visualization.init();
});