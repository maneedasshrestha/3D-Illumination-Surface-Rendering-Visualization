
# 3D Illumination & Surface Rendering Visualization

![Project Preview](public/og-image.png)

## Project Overview

This project is an interactive web application that demonstrates 3D illumination and surface rendering techniques using **Three.js** and **React Three Fiber**. It provides an educational platform for users to explore different lighting models and rendering methods applied to various 3D shapes.

## Live Demo

The project is live at: [Illumination & Surface Rendering](https://illumination-surface-rendering.vercel.app/)

## Features

- **Interactive 3D Shape Gallery:** Choose from a variety of pre-configured 3D shapes
- **Custom Model Upload:** Upload your own 3D models in OBJ, GLTF, GLB, or STL formats
- **Texture Mapping:** Apply custom image textures to 3D objects
- **Comprehensive Lighting Controls:**
  - Toggle ambient, diffuse, and specular reflection independently
  - Preset lighting configurations (White, Warm, Cool, Dramatic, Sunset, Disco)
  - Visual light source indicators
- **Rendering Techniques:** Switch between different shading models:
  - Constant (Flat) Shading
  - Gouraud Shading
  - Phong Shading
  - Optimized Fast Phong
  - Wireframe visualization
- **Environment Options:** Multiple background settings with interactive space environment
- **Responsive Design:** Works on both desktop and mobile devices
- **Intuitive UI:** Clean, modern interface with real-time controls

## Technologies Used

- **Three.js** - Industry-standard 3D graphics library for the web
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber
- **React** - Front-end UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn-ui** - High-quality React components
- **React Router** - For navigation between views
- **Vite** - Next-generation frontend build tool

## How to Install & Run Locally

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later (or yarn/pnpm)

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/illumination-surface-rendering.git
cd illumination-surface-rendering
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Start the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

```
illumination-surface-rendering/
├── public/               # Static files
├── src/
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
│   ├── pages/            # Page components
│   ├── App.tsx           # Root component
│   └── main.tsx          # Application entry point
├── index.html            # HTML template
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Key Components

- **ShapeViewer**: Main component for 3D shape visualization
- **Scene**: Three.js scene setup and rendering
- **RenderControls**: UI controls for adjusting rendering parameters
- **ShapeGrid**: Gallery of available 3D shapes
- **InteractiveBackground**: Animated 3D background for the home page

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open-source and available under the MIT License.

## Acknowledgments

- Three.js for providing an excellent 3D graphics library
- React Three Fiber for simplifying Three.js integration with React
- shadcn-ui for beautiful and accessible UI components
- All contributors who have helped improve this project

---

Made with ❤️ for 3D graphics enthusiasts and learners
