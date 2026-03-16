# HamPrep - UK Foundation Ham Radio Exam Preparation

An interactive web application to help you prepare for and pass the **UK Foundation Amateur Radio Examination**. Built with modern web technologies, featuring comprehensive study materials, interactive quizzes, progress tracking, and full internationalisation support.

## Features

- **Comprehensive Study Material** — All 8 syllabus topics covered with detailed, exam-focused content
- **Interactive Quiz System** — 120+ exam-style multiple choice questions with explanations
- **Mock Exams** — Realistic mock exams matching the real format (26 questions, 45 minutes, 73% pass mark)
- **Progress Tracking** — Dashboard showing scores, streaks, and weak areas
- **Dark/Light Mode** — Full Material UI theming with persistent preference
- **Internationalisation** — English and Welsh (Cymraeg) language support
- **User Accounts** — Register and login to track your progress across sessions
- **Responsive Design** — Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- **Next.js 15** (App Router) with TypeScript
- **Material UI 6** with custom light/dark themes
- **Redux Toolkit** + **Redux Persist** for state management
- **next-intl** for internationalisation (i18n)
- **Zod** for form validation
- **Axios** for API communication

### Backend
- **Flask** (Python) REST API
- **JSON file-based database** with file locking for thread safety
- **SHA-512** password hashing
- **JWT** authentication (Flask-JWT-Extended)

### Testing
- **Jest** + **React Testing Library** (unit & integration)
- **Playwright** (end-to-end)
- **pytest** (backend)
- **100% test coverage** target
- Testing triangle: ~70% unit, ~20% integration, ~10% E2E

### Infrastructure
- **Docker** + **Docker Compose** for containerisation
- **GitHub Container Registry (GHCR)** for image publishing
- **GitHub Actions** CI/CD pipeline

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 20+
- [Python](https://python.org/) 3.12+
- [Docker](https://docker.com/) (optional, for containerised setup)

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/yourusername/hamradiosite.git
cd hamradiosite

# Start all services
docker compose up -d

# The app will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
```

### Development Setup

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements-dev.txt

# Seed the database with topics and questions
flask seed-db

# Start development server
flask run
```

The API will be available at `http://localhost:5000/api`.

### Environment Variables

Create `.env.local` in the frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Create `.env` in the backend directory:
```
JWT_SECRET_KEY=your-secret-key-change-in-production
FLASK_ENV=development
```

## Running Tests

### Frontend Tests

```bash
cd frontend

# Run unit/integration tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Backend Tests

```bash
cd backend

# Run tests with coverage
pytest --cov=app --cov-report=html

# Run with verbose output
pytest -v
```

## Project Structure

```
hamradiosite/
├── .github/workflows/     # CI/CD pipelines
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React components
│   │   ├── store/         # Redux store and slices
│   │   ├── theme/         # MUI theme configuration
│   │   ├── i18n/          # Internationalisation config
│   │   ├── messages/      # Translation files (en, cy)
│   │   ├── lib/           # API client, validators
│   │   └── types/         # TypeScript type definitions
│   ├── e2e/               # Playwright E2E tests
│   └── public/            # Static assets
├── backend/               # Flask backend application
│   ├── app/
│   │   ├── api/           # API route blueprints
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities and helpers
│   ├── data/              # JSON database files
│   ├── seeds/             # Seed data (JSON)
│   └── tests/             # pytest tests
├── docker-compose.yml     # Production Docker setup
└── docker-compose.dev.yml # Development Docker setup
```

## UK Foundation Exam Information

The **UK Foundation Amateur Radio Licence** exam consists of:
- **26 multiple choice questions**
- **45 minutes** to complete
- **Pass mark: 19/26 (73%)**
- Administered by the **RSGB** (Radio Society of Great Britain)
- Licence issued by **Ofcom** (free of charge)

### Syllabus Topics

1. **Licensing Conditions** — Licence types, Ofcom, callsigns, bands, power limits
2. **Technical Basics** — Ohm's Law, power, AC/DC, frequency, wavelength, decibels
3. **Transmitters and Receivers** — Block diagrams, modulation types (AM, FM, SSB)
4. **Feeders and Antennas** — Coax, SWR, dipoles, verticals, Yagis, baluns
5. **Propagation** — Ground wave, sky wave, ionosphere, line of sight
6. **EMC** — Interference, harmonics, filtering, complaints handling
7. **Operating Practices** — Phonetic alphabet, Q-codes, RST, repeaters, CTCSS
8. **Safety** — Electrical safety, RF exposure, antenna safety, first aid

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| POST | `/api/auth/refresh` | Refresh access token | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/topics` | List all topics | No |
| GET | `/api/topics/:slug` | Get topic with content | No |
| GET | `/api/questions` | Get questions | No |
| POST | `/api/quizzes/start` | Start quiz session | Yes |
| GET | `/api/quizzes/:id` | Get quiz questions | Yes |
| POST | `/api/quizzes/:id/submit` | Submit answers | Yes |
| GET | `/api/quizzes/:id/results` | Get quiz results | Yes |
| GET | `/api/progress` | Overall progress | Yes |
| GET | `/api/progress/topics` | Per-topic breakdown | Yes |
| GET | `/api/progress/weak-areas` | Weakest topics | Yes |
| GET | `/api/progress/history` | Recent attempts | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Licence

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This application is an independent study aid and is not affiliated with, endorsed by, or connected to the RSGB (Radio Society of Great Britain) or Ofcom. While every effort has been made to ensure accuracy, always refer to the official RSGB Foundation Licence training materials for the most current and authoritative information.

## Acknowledgements

- [RSGB](https://rsgb.org/) for the Foundation licence syllabus
- [Ofcom](https://ofcom.org.uk/) for amateur radio licensing
- The amateur radio community for their ongoing support of newcomers
