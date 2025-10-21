# 🧇 Waffle Timer

A beautiful, translucent floating Pomodoro timer widget with to-dos and sticky notes for macOS, Windows, and Linux.

## Features

✨ **Floating Widget**: Always-on-top, draggable, translucent design  
⏰ **Pomodoro Timer**: 50-minute focus sessions with visual progress ring  
✅ **To-Do List**: Add, complete, and delete tasks with local persistence  
📝 **Sticky Notes**: Quick note windows for brainstorming  
🎵 **Sound Control**: Mute/unmute completion chime  
🎨 **Glass Morphism**: Beautiful frosted glass aesthetic  

## Prerequisites

Before running the app, ensure you have:

- **Node.js** (v18+ recommended)
- **Rust** (latest stable)
- **Platform-specific requirements**:
  - macOS: Xcode Command Line Tools
  - Windows: Microsoft C++ Build Tools
  - Linux: webkit2gtk, libgtk-3

Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run tauri dev
```

## Build

To build for production:

```bash
npm run tauri build
```

The built app will be in `src-tauri/target/release/bundle/`

## Usage

- **Timer**: Click play to start a 50-minute focus session
- **To-Dos**: Click + to add tasks, check to complete
- **Sticky Notes**: Click the note icon to open a floating note
- **Collapse**: Click the chevron to minimize to a small icon
- **Drag**: Click and hold the header to move the widget

## Tech Stack

- **Tauri v2**: Cross-platform desktop framework
- **React 18**: UI library
- **TypeScript**: Type safety
- **TailwindCSS**: Styling with glass morphism
- **Zustand**: State management
- **Rust**: Backend logic

## Customization

### Timer Duration
Edit `src/store/useTimerStore.ts`:
```typescript
const DEFAULT_DURATION = 50 * 60; // Change to desired minutes * 60
```

### Theme Colors
Edit `src/styles.css` to customize the glass effect and colors.

### Window Size
Edit `src-tauri/tauri.conf.json` to adjust default window dimensions.

## Troubleshooting

### App doesn't start
- Ensure Rust is installed: `rustc --version`
- Check Node version: `node --version` (should be 18+)

### Window not transparent
- On Linux, ensure compositor is running
- On Windows, transparency requires Windows 10/11

### Audio not playing
- Replace `public/chime.mp3` with an actual audio file

## License

MIT

## Contributing

Pull requests are welcome! Please ensure code follows the existing style.

---

Made with 🧇 and ❤️