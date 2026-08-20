# STEM Yatra

STEM Yatra is a village-themed interactive learning prototype for CBSE Class X students. Learners travel through a sequence of STEM missions, meet friendly mascot guides, solve subject-based challenges, collect points and badges, and connect classroom concepts with community problems.

The experience is built as a React + TypeScript web app with a folk-art inspired interface, mission cards, progress tracking, animated feedback, and subject worlds for biology, chemistry, physics, mathematics, technology, engineering, and coding.

## What learners do

- Explore a village map and unlock STEM worlds one by one.
- Complete short mission-based activities tied to real concepts.
- Earn points, badges, and concept summaries after each mission.
- Track progress locally in the browser.
- Celebrate completion after finishing all seven worlds.

## Learning worlds

| World | Subject | Mission | Core ideas |
| --- | --- | --- | --- |
| Bio Detective | Biology | Save the Living Garden | Photosynthesis, water transport, stomata, plant systems |
| Chemical Detective | Chemistry | Restore the Village Laboratory | Combination, decomposition, displacement, double displacement, pH |
| Circuit Rescue | Physics | Power the Community School | Closed circuits, Ohm's law, electrical power, series and parallel circuits |
| Maths Explorer | Mathematics | Plan the Harvest | Mean, median, mode, probability, data-based decisions |
| Tech Workshop | Technology | Choose the Right Tool | Rainwater harvesting, filtration, solar energy, context-aware technology |
| Engineering Hub | Engineering | Build the Village Bridge | Beam strength, trusses, load distribution, design choices |
| Data & Code Lab | Coding | Program the Irrigation System | Algorithms, sequencing, conditionals, debugging |

## Features

- Sequential mission unlocking with prerequisites.
- Mascot-led storytelling for each STEM subject.
- Points, badges, progress percentage, and learned-concept tracking.
- Reset and completion celebration flows.
- Local browser storage through `localStorage`.
- Responsive interface styled with Tailwind CSS.
- Motion and icon support through Framer Motion and Lucide React.

## Tech stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- ESLint

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run checks:

```bash
npm run lint
npm run typecheck
```

## Project structure

```text
src/
  components/        Reusable interface and game components
  data/              World and progress definitions
  hooks/             Progress persistence logic
  screens/           Village map, mission, and celebration screens
  worlds/            Subject-specific mission experiences
```

Static visual assets live in the root asset folders, including character art, subject card graphics, mission state graphics, UI icons, and decorative Madhubani-style assets.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
