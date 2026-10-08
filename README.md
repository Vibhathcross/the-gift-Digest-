# Love Gallery 💕

A simple, elegant, romantic image gallery designed for GitHub Pages with automatic folder syncing.

Live Website URL (after enabling GitHub Pages):
`https://vibhathcross.github.io/the-gift-Digest-/`

---

## ✨ Features

- **Romantic Intro Screen**: "Welcome to Love Gallery" with soft typography and a gentle fade-in animation.
- **Full Screen on Entering**: Automatically switches to full screen view when you tap the enter button (`→`).
- **Memory Collections Selection**:
  - **Colophon**: Words, reflections & thoughts (mapped to `colophon/` folder).
  - **Important Memories**: Milestones & precious moments (mapped to `important_memories/` folder).
  - Each collection features an aesthetic romantic cover card.
- **⚡ Automatic GitHub Folder Sync**:
  - Simply drop or upload images into the `colophon/` or `important_memories/` folders on GitHub.
  - The gallery uses the GitHub API to dynamically detect all new images automatically—no code changes required!
- **Uncropped Image Display (`object-fit: contain`)**: Every photograph—portrait, landscape, square, tall, or wide—is shown completely without cropping.
- **Mobile Optimized**:
  - Touch swipe left/right to move through memories.
  - Screen tap zones (tap right to advance, tap left to go back).
  - Dynamic mobile viewport (`100dvh`) with safe area support.
- **Back to Collections**: Easily return to the chapters screen to view the other section anytime.
- **Ambient Romance**: Soft ambient floating heart particles drifting across a romantic pastel gradient.

---

## 📁 Repository Structure

```text
the-gift-Digest-/
├── index.html              # HTML structure (Intro, Collections, Gallery)
├── style.css               # Romantic styles, card layouts, mobile responsiveness
├── script.js               # Auto GitHub sync, transitions, gesture engine
├── images/                 # Section cover artwork
│   ├── colophon_cover.jpg  # Romantic cover for Colophon
│   └── memories_cover.jpg  # Romantic cover for Important Memories
├── colophon/               # 📂 Add images for "Colophon" here!
│   └── .gitkeep
└── important_memories/     # 📂 Add images for "Important Memories" here!
    └── .gitkeep
```

---

## 🖼️ How to Add Photos

### Method 1: Directly on GitHub (Easiest)
1. Go to your repository: [https://github.com/Vibhathcross/the-gift-Digest-](https://github.com/Vibhathcross/the-gift-Digest-)
2. Click into either folder:
   - **`colophon`** or
   - **`important_memories`**
3. Click **Add file** → **Upload files**.
4. Drag and drop your photos (`.jpg`, `.png`, `.webp`) and click **Commit changes**.
5. That's it! The gallery will automatically detect and display the new photos when you open that collection on the website.

### Method 2: Via Git Command Line
```bash
# Add photos to colophon or important_memories
git add .
git commit -m "Add new memory photos"
git push origin main
```

---

## 🚀 How to Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/Vibhathcross/the-gift-Digest-`
2. Click **Settings** (top navigation bar).
3. Scroll down to **Pages** (under *Code and automation*).
4. Under **Build and deployment -> Source**, select **Deploy from a branch**.
5. Under **Branch**, select `main` and root `/`, then click **Save**.
6. Within 1-2 minutes, your website will be live at:  
   👉 **`https://vibhathcross.github.io/the-gift-Digest-/`**
