#!/bin/bash

# Create the target directory if it doesn't exist
mkdir -p js/three
cd js/three || exit 1

# Download three.min.js from CDN
echo "Downloading three.min.js..."
wget -q --show-progress https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js

# Download OrbitControls.js from CDN
echo "Downloading OrbitControls.js..."
wget -q --show-progress https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js

echo "Done. Files are saved in js/three/"