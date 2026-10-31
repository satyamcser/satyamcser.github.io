# Satyam Mishra Academic Website

Dark futuristic academic website for GitHub Pages.

## Files

- `index.html`: Main single-page academic website
- `assets/styles.css`: Styling and responsive layout
- `assets/site.js`: Publications, patents, books, search, tabs, and neural background animation
- `assets/scene.js`: 3D autonomous-driving background (Three.js): ego car, LiDAR sweep, tracked objects, drone, planned path, chase-to-BEV camera
- `assets/robot.js`: Interactive 3D robot arm in the Robotics section (inverse kinematics follows the pointer)
- `assets/scene.css`: Styles for the 3D scene, HUD, tilt cards, autonomy stack, robotics section, and responsive layout
- `assets/profile.jpg`: Profile photo
- `assets/favicon.svg`: Site icon
- `robots.txt` and `sitemap.xml`: Basic SEO files
- `404.html`: Redirect fallback for GitHub Pages

## Deploy on GitHub Pages

If your GitHub Pages repository already exists:

```bash
git clone https://github.com/satyam-mishra/satyam-mishra.github.io.git
cd satyam-mishra.github.io
```

Copy all files from this package into the repository root, then run:

```bash
git add .
git commit -m "Launch academic website"
git push origin main
```

Then open:

```text
https://satyam-mishra.github.io
```

## Edit publications

Open `assets/site.js` and edit the arrays:

- `fullPublications`
- `preprints`
- `books`
- `patents`

No build step is required.
