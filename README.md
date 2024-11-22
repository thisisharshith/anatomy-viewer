# 3D Anatomy Viewer

![3D Anatomy Viewer]

An interactive 3D anatomy visualization tool that allows users to explore human anatomy through a detailed 3D model. Built with Next.js, Three.js, and powered by GROQ AI for educational content.

## 🌟 Features

- **Interactive 3D Model**
  - Full 360° rotation and zoom
  - System isolation (Respiratory, Digestive, etc.)
  - Part highlighting and selection
  - Smooth camera transitions

- **Educational Content**
  - Age-appropriate anatomical information
  - AI-powered explanations via GROQ
  - Detailed part descriptions
  - Interactive learning experience

- **Quiz System**
  - Text-based quizzes
  - 3D mesh identification challenges
  - Profession-based difficulty adjustment
  - Progress tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- GROQ API key

### Installation

1. Clone the repository
bash
git clone https://github.com/yourusername/anatomy-viewer.git
cd anatomy-viewer

2. Install dependencies
bash
npm install

3. Set up environment variables
bash
Create a .env.local file and add:
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here


4. Start the development server
bash
npm run dev


Visit `http://localhost:3000` to see the application.



## 📁 Project Structure
anatomy-viewer/
├── app/ # Next.js app router
│ ├── api/ # API endpoints
│ ├── part/ # Dynamic part routes
│ └── quiz/ # Quiz system
├── components/ # React components
│ ├── quiz/ # Quiz components
│ └── 3d/ # 3D viewer components
├── public/
│ └── models/ # 3D model files (.glb)
├── utils/ # Utility functions
└── styles/ # Global styles



## 🎮 Usage Guide

### Navigation
- **Orbit Controls**: 
  - Left-click + drag to rotate
  - Right-click + drag to pan
  - Scroll to zoom

### System Selection
1. Choose an anatomical system from the home page
2. Use the system filter to isolate specific parts
3. Click on organs for detailed information

### Quiz Mode
1. Access from the navigation menu
2. Choose quiz type (Text/3D)
3. Enter age and profession for personalized content
4. Complete the quiz to test your knowledge

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Import project to Vercel
3. Set environment variables:

bash
NEXT_PUBLIC_GROQ_API_KEY=your_key


4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
bash
git checkout -b feature/AmazingFeature
3. Commit your changes
bash
git commit -m 'Add some AmazingFeature'

4. Push to the branch
bash
git push origin feature/AmazingFeature

5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- 3D model provided by [Source]
- GROQ AI for powering educational content
- Three.js community for resources and support

## 📫 Contact

Harshith G - [@yourtwitter](https://x.com/HarshithG28)

Project Link: [https://github.com/thisisharshith/anatomy-viewer](https://github.com/thisisharshith/anatomy-viewer)

## 🔮 Future Features

- [ ] VR/AR support
- [ ] Multiple language support
- [ ] More detailed anatomical systems
- [ ] Advanced quiz features
- [ ] User progress tracking
