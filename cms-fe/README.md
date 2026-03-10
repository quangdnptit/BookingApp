# Reel CMS — Movie Booking (Frontend)

Content Management System frontend for a movie booking application. Dark cinema-themed UI.

## Stack

- **Vite** + **Vue 3** + **TypeScript**
- **Vue Router** for navigation
- **Tailwind CSS** for styling

## Features

- **Login** — Sign in to access the CMS (demo: `admin@reel.com` / `password`). Session is stored in `localStorage`.
- **Dashboard** — Overview stats (movies, theaters, showtimes, bookings) and quick actions
- **Movies** — List, add, edit, delete movies (title, description, duration, rating, genre, poster, release date)
- **Showtimes** — View and delete scheduled showtimes (movie, theater/screen, start/end, price)
- **Theaters** — View theaters and screens (read-only with mock data)
- **Seats** — Manage seats per screen (add, edit type, deactivate, delete)

Data is currently **mock** (in-memory). Replace `src/api/client.ts` with real HTTP calls to your backend.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview   # serve production build
```

## Project structure

```
src/
  api/          # API client + mock data (including mock login)
  components/   # Layout (Sidebar), UI (Button, Card, CardHeader, Input, Table, Select)
  composables/  # useAuth (user, login, logout)
  router/       # Vue Router + auth guard
  types/        # Movie, Theater, Screen, Showtime, Seat, DashboardStats, User
  views/        # Login, Dashboard, Movies (list/form), Showtimes, Theaters, Seats
```
