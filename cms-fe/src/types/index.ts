export interface Movie {
  id: string
  title: string
  description: string
  durationMinutes: number
  rating: string
  genre: string
  posterUrl: string
  releaseDate: string
  isActive: boolean
  createdAt: string
}

export interface Theater {
  id: string
  name: string
  address: string
  screenCount: number
  screens: Screen[]
  isActive: boolean
}

export interface Screen {
  id: string
  name: string
  capacity: number
  theaterId: string
}

export type SeatType = 'standard' | 'premium' | 'wheelchair'

export interface Seat {
  id: string
  screenId: string
  row: string
  seatNumber: number
  type: SeatType
  isActive: boolean
  screen?: Screen
}

export interface Showtime {
  id: string
  movieId: string
  screenId: string
  theaterId: string
  startTime: string
  endTime: string
  price: number
  currency: string
  isActive: boolean
  movie?: Movie
  screen?: Screen
  theater?: Theater
}

export interface DashboardStats {
  totalMovies: number
  totalTheaters: number
  totalShowtimes: number
  totalBookings: number
  totalSeats: number
}

export interface User {
  id: string
  email: string
  name: string
}

export interface LoginCredentials {
  email: string
  password: string
}
