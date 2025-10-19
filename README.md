# Seva Portal – Digital Document Services

Seva Portal is a full‑stack web application that enables citizens to securely access and manage government documents and allows authorized government officials to review and approve change requests.

## Key Features
- Citizen Aadhaar OTP login with secure flow (`crypto.randomInt`, `bcrypt`, Redis TTL)
- SMS delivery via Twilio (or mocked console OTP when Twilio is not configured)
- Rate limiting with `rate-limiter-flexible` (configurable; increased during testing)
- Government admin login (sample: Employee ID `GOV001`, Password `admin123`)
- Admin workflows: approve/reject change requests, review documents, biometric approval emails
- Modular architecture, environment‑driven config, production‑ready fallbacks

## Tech Stack
- Backend: Node.js, Express, TypeScript
- Frontend: React + TypeScript (Bootstrap UI)
- Infra/Security: Redis (`ioredis`), `bcryptjs`, `zod`, `rate-limiter-flexible`, `dotenv`, Twilio (optional)

## Security Highlights
- OTPs are never stored in plain text; hashed with bcrypt
- Minimal, privacy‑safe logging with masked identifiers
- Input validation with `zod`
- Session security; JWT scaffolding available

---

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TypeScript

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Install Server Dependencies**
```bash
cd server
npm install
```

3. **Install Client Dependencies**
```bash
cd client
npm install
```

## Configuration

1. Create a `.env` file in the root directory using the provided `.env.example` template
2. Update the environment variables according to your setup

## Running the Application

1. **Start the Server**
```bash
cd server
npm run dev
```
The server will start on http://localhost:3000

2. **Start the Client**
```bash
cd client
npm run dev
```
The client will start on http://localhost:3001

## Project Structure

```
├── client/                 # Next.js frontend
│   ├── public/            # Static files
│   └── src/              
│       ├── pages/         # Next.js pages
│       └── styles/        # CSS styles
│
├── server/                # Express backend
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── db.ts            # Database configuration
│
└── .env                  # Environment variables
```

## Available API Endpoints

- `/api/auth` - Authentication routes
- `/api/files` - File management
- `/api/upload` - File upload
- `/api/admin` - Admin routes

## Environment Variables

See `.env.example` for required environment variables...
