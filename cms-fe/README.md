# Reel CMS — Movie Booking (Frontend)

Content Management System frontend for a movie booking application. Dark cinema-themed UI.

## Stack

- **Vite** + **React 19** + **TypeScript**
- **React Router** for navigation
- **Tailwind CSS** for styling

## Features

- **Dashboard** — Overview stats (movies, theaters, showtimes, bookings) and quick actions
- **Movies** — List, add, edit, delete movies (title, description, duration, rating, genre, poster, release date)
- **Showtimes** — View and delete scheduled showtimes (movie, theater/screen, start/end, price)
- **Theaters** — View theaters and screens (read-only with mock data)

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
  api/          # API client + mock data
  components/   # Layout (Sidebar), UI (Button, Card, Input, Table, Select)
  pages/        # Dashboard, Movies (list/form), Showtimes, Theaters
  types/        # Movie, Theater, Screen, Showtime, DashboardStats
```
