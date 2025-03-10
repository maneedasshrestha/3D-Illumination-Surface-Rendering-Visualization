# 3D Illumination & Surface Rendering Visualization

## Project Overview

This project aims to simplify the understanding of illumination and surface rendering methods using **Three.js**. The web application provides an interactive 3D environment where users can explore different rendering techniques on various 3D shapes.

## Live Demo

The project is live at: [Illumination & Surface Rendering](https://illumination-surface-rendering.vercel.app/)

## Features

1. 3D Model Viewer

Displays 3D shapes, including basic shapes (e.g., cubes) and custom models.

Custom models can be uploaded and rendered using the app.

2. Rendering Options

Toggle wireframe mode to show or hide the wireframe of the shape.

Toggle lighting modes:

Ambient Lighting

Diffuse Lighting

Specular Lighting

Change the rendering mode (e.g., Phong shading).

Change the shape color to any hex color code.

3. Custom Model Support

Users can upload their own 3D models via session storage.

Custom models can be loaded from a URL stored in session storage.

4. Background and Texture Options

Choose between different background options (e.g., "space").

Users can upload a custom texture image for the shape.

The texture can be selected from various preset options or uploaded as a custom texture.

5. Lighting Control

Select from preset lighting configurations for ambient, diffuse, and specular light colors.

Custom lighting allows users to modify light colors and positions for each light source.

6. Model Rotation Controls

Pause rotation to freeze the model in place.

The model automatically rotates unless paused.

7. Interactive UI

Control Panel: Open/close the rendering controls to adjust options like wireframe mode, lighting, textures, and rotation.

Go Back Button: Navigate back to the home screen or the previous page.

8. Toast Notifications

The app provides user feedback through toast notifications, including errors (e.g., loading errors or missing custom models) and successful actions.

## Technologies Used

- **Three.js** - For rendering 3D graphics
- **React** - For building a responsive and interactive UI
- **TypeScript** - For type safety and maintainability
- **shadcn-ui** - For UI components
- **Tailwind CSS** - For styling and responsiveness

## How to Run Locally

Ensure you have **Node.js** and **npm** installed. Follow these steps:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

This will launch the project on a local development server with hot reloading.


## Contribution

If you'd like to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Open a Pull Request.

## License

This project is open-source and available under the **MIT License**.

---

