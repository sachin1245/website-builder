# Next.js Website Builder

## Overview

This project is a sophisticated website builder application built with Next.js, React, and TypeScript. It offers a drag-and-drop interface for creating and customizing websites, with features like responsive design, theming, and real-time previews.

## Features

1. **Drag-and-Drop Interface**

   - Intuitive element placement and manipulation
   - Support for text, images, videos, and buttons

2. **Responsive Design**

   - Preview modes for desktop, tablet, and mobile
   - Adaptive grid layout system

3. **Theme Management**

   - Global styling options
   - Custom color schemes and typography

4. **Multi-Page Support**

   - Create and manage multiple pages within a project
   - Dynamic routing and navigation

5. **Real-time Preview**

   - Live preview of website changes
   - Device-specific previews

6. **Advanced Element Properties**

   - Detailed control over element styling and positioning
   - Custom property panels for each element type

7. **Template System**

   - Save and load custom templates
   - Pre-defined starter templates

8. **Undo/Redo Functionality**

   - Full history management for user actions

9. **Section Management**

   - Add and customize multiple sections per page
   - Section-specific background controls

10. **Performance Optimizations**

    - Efficient state management with React Context
    - Optimized rendering with React hooks

11. **Extensible Architecture**
    - Modular component structure for easy feature additions
    - Clear separation of concerns in code organization

## Project Structure

```
src/
├── app/
│ ├── layout.tsx
│ ├── page.tsx
│ └── preview/
│ └── [slug]/
│ └── page.tsx
├── components/
│ ├── Builder/
│ ├── Elements/
│ ├── LoadTemplate/
│ ├── Navigation/
│ └── Preview/
├── context/
├── hooks/
├── styles/
├── types/
└── utils/
```

- `app/`: Next.js 14.2.5 app directory structure
- `components/`: Reusable React components
- `context/`: React Context for state management
- `hooks/`: Custom React hooks
- `styles/`: Global styles and theme definitions
- `types/`: TypeScript type definitions
- `utils/`: Utility functions and helpers

## Setup and Running the Project

1. **Clone the repository**

   ```bash
   git clone https://github.com/sachin1245/website-builder.git
   cd website-builder
   ```

````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Start the production server**

   ```bash
   npm start
   ```

## Technologies Used

- Next.js 14 (with App Router)
- React 18
- TypeScript
- Tailwind CSS
- React DnD (for drag-and-drop functionality)
- UUID (for unique identifier generation)

## Architecture Highlights

- **State Management**: Utilizes React Context for global state, with optimized updates to prevent unnecessary re-renders.
- **Component Design**: Implements a modular component structure, allowing for easy extension and maintenance.
- **Custom Hooks**: Leverages custom hooks for shared logic, such as drag-and-drop functionality and element management.
- **Responsive Design**: Employs a custom grid system and layout calculations for true responsive behavior.
- **Type Safety**: Utilizes TypeScript throughout the project for enhanced code quality and developer experience.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
````
