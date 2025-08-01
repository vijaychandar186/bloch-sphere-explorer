# Download Three.js r128 and OrbitControls using wget

This simple script fetches **three.min.js** (r128) and **OrbitControls.js** and places them in `js/three/`.

---

## download-threejs.sh

```bash
#!/bin/bash

# Create the target directory if it doesn't exist
mkdir -p js/three
cd js/three || exit 1

# Download three.min.js (Three.js r128)
echo "Downloading three.min.js..."
wget -q --show-progress https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js

# Download OrbitControls.js (matching version)
echo "Downloading OrbitControls.js..."
wget -q --show-progress https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js

echo "Done. Files are saved in js/three/"
```

✅ **Usage Instructions**
Save the above text into a file named `download-threejs.sh`.

In your terminal, make it executable:

```bash
chmod +x download-threejs.sh
```

Run it:

```bash
./download-threejs.sh
```

It will create the directory `js/three/` and download two files:

* `three.min.js` — the core Three.js library (version r128).
* `OrbitControls.js` — the relevant control file from examples compatible with r128.

✅ **Updating HTML**
After download, include them in your HTML like this:

```html
<script src="js/three/three.min.js"></script>
<script src="js/three/OrbitControls.js"></script>
```
