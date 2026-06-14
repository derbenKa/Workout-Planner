# Workout Planner

A self-hosted workout planning web app for your local network. Add exercises with images, build a weekly plan, and access it from any device on your LAN.

![Tech](https://img.shields.io/badge/React-18-blue) ![Tech](https://img.shields.io/badge/Node.js-20-green) ![Tech](https://img.shields.io/badge/SQLite-3-lightgrey) ![Tech](https://img.shields.io/badge/Docker-ready-2496ED)

## Features

- **Exercise Library** — Add exercises with name, muscle group, image and notes. Filter by muscle group.
- **Weekly Plan** — Assign exercises to any day of the week (Mon–Sun). Set sets × reps per entry.
- **Persistent data** — SQLite database and uploaded images survive container restarts via Docker volumes.
- **LAN access** — Runs on port `3001`, reachable from any device on your local network.

## Getting Started

### Requirements

- [Docker](https://www.docker.com/) + Docker Compose

### Run

```bash
git clone https://github.com/derbenKa/Workout-Planner.git
cd Workout-Planner
docker compose up --build -d
```

Open in browser: `http://localhost:3001`

From another device on your network: `http://<your-mac-ip>:3001`

```bash
# Find your local IP
ipconfig getifaddr en0
```

### Stop

```bash
docker compose down
```

## Project Structure

```
├── backend/          # Express API + SQLite
│   ├── routes/       # exercises & plan endpoints
│   ├── db.js         # database setup
│   └── index.js      # entry point
├── frontend/         # React + Vite
│   └── src/
│       ├── pages/    # Exercises, Plan
│       └── components/
├── data/             # Persistent volume (gitignored)
│   ├── workout.db
│   └── uploads/
├── Dockerfile        # Single-container build
└── docker-compose.yml
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | List all exercises |
| POST | `/api/exercises` | Create exercise (multipart/form-data) |
| PUT | `/api/exercises/:id` | Update exercise |
| DELETE | `/api/exercises/:id` | Delete exercise |
| GET | `/api/plan` | Get full weekly plan |
| POST | `/api/plan` | Add exercise to a day |
| PUT | `/api/plan/:id` | Update sets/reps |
| DELETE | `/api/plan/:id` | Remove from plan |

## Data

All data is stored in `./data/` and bind-mounted into the container. Deleting or rebuilding the container does **not** delete your exercises or images.
