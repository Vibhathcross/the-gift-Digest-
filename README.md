# Love Gallery 💕

A simple, elegant, romantic image gallery webpage designed for GitHub Pages.

Live Website URL (after enabling GitHub Pages):
`https://vibhathcross.github.io/the-gift-Digest-/`

---

## ✨ Features

- **Romantic Intro Screen**: "Welcome to Love Gallery" with soft typography and a gentle fade-in effect.
- **Interactive Navigation**: Tap the right arrow (`→`) to step through your memory photos.
- **Uncropped Images (`object-fit: contain`)**: Every image—portrait, landscape, square, tall, or wide—is displayed completely without cropping.
- **Smooth Crossfade Transitions**: Double-buffered fading effect for seamless image switching.
- **Replay Feature**: After the final image, the navigation button seamlessly becomes a Replay button (`↻`).
- **Touch Swipe & Keyboard Support**:
  - Desktop: Right Arrow / Space for Next, Left Arrow for Previous.
  - Mobile: Swipe Left for Next, Swipe Right for Previous.
- **Ambient Romance**: Soft ambient floating heart particles drifting across a romantic pastel background.
- **100% Static GitHub Pages Compatible**: Built purely with HTML, CSS, and vanilla JavaScript.

---

## 📁 Repository Structure

```text
the-gift-Digest-/
├── index.html       # Gallery markup & intro screen
├── style.css        # Romantic aesthetics, responsiveness & layout rules
├── script.js        # Image list, transition engine, touch/keyboard listeners
└── images/          # Image folder
    ├── image1.jpg   # Sample landscape photo
    ├── image2.jpg   # Sample portrait photo
    ├── image3.jpg   # Sample square photo
    └── image4.jpg   # Sample tall photo
```

---

## 🖼️ How to Add or Change Images

1. Place your photo files (`.jpg`, `.png`, `.webp`) into the `images/` directory.
2. Open `script.js` in any text editor.
3. Update the `images` array with your file paths:

```javascript
const images = [
    "images/image1.jpg",
    "images/image2.jpg",
    "images/image3.jpg",
    "images/image4.png",
    "images/your_new_photo.jpg"
];
```

---

## 🚀 How to Publish to GitHub Pages

1. **Commit and Push to GitHub**:
   ```bash
   git add .
   git commit -m "Create Love Gallery"
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub: `https://github.com/Vibhathcross/the-gift-Digest-`
   - Click **Settings** (top navigation bar).
   - Scroll down to **Pages** (under Code and automation).
   - Under **Build and deployment -> Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and root `/`, then click **Save**.
   - Within 1-2 minutes, your website will be live at:
     **`https://vibhathcross.github.io/the-gift-Digest-/`**
