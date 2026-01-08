# tubexdubai Website

A modern, responsive React website for tubexdubai - Innovative IT Solutions for Your Business.

## Features

- 🎨 Modern and beautiful UI design
- 📱 Fully responsive layout
- ⚡ Fast performance with Vite
- 🎯 Smooth scrolling navigation
- 📧 Contact form with file attachments
- 🍪 Cookie consent banner
- 📸 Gallery section
- 🔗 Social media integration ready

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Productions

To create a production build:

```bash
npm run build
```

The build files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
TubexWebsite/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── About.jsx
│   │   ├── Services.jsx
│   │   ├── Gallery.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── Logo (1) (1).png
├── index.html
├── package.json
└── vite.config.js
```

## Customization

### Replacing Gallery Images

Replace the placeholder images in `src/components/Gallery.jsx` with your actual images. You can add images to a `public/images` folder and reference them like:

```jsx
src: '/images/your-image.jpg'
```

### Updating Colors

Edit the CSS variables in `src/index.css` to match your brand colors:

```css
:root {
  --primary-color: #1a56db;
  --secondary-color: #0ea5e9;
  --accent-color: #f59e0b;
  /* ... */
}
```

### Contact Form Backend

The contact form currently shows an alert on submission. To connect it to a backend:

1. Update the `handleSubmit` function in `src/components/Contact.jsx`
2. Add your API endpoint
3. Handle form validation and submission

## Technologies Used

- React 18
- Vite
- Modern CSS with CSS Variables
- Responsive Design

## License

Copyright © 2025 tubexdubai - All Rights Reserved.
