import type { Movie, Theater, Showtime, Seat, DashboardStats, User, LoginCredentials } from '../types'
import { mockMovies, mockTheaters, mockShowtimes, mockSeats } from './mockData'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Mock: accepts admin@reel.com / password. Replace with real auth API. */
export const api = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    await delay(500)
    if (credentials.email === 'admin@reel.com' && credentials.password === 'password') {
      return {
        user: { id: '1', email: credentials.email, name: 'CMS Admin' },
        token: 'mock-jwt-' + Date.now(),
      }
    }
    throw new Error('Invalid email or password')
  },

  async logout(): Promise<void> {
    await delay(200)
  },

  async getDashboardStats(): Promise<DashboardStats> {
    await delay(400)
    return {
      totalMovies: mockMovies.length,
      totalTheaters: mockTheaters.length,
      totalShowtimes: mockShowtimes.length,
      totalBookings: 1247,
      totalSeats: mockSeats.length,
    }
  },

  async getMovies(): Promise<Movie[]> {
    await delay(300)
    return [...mockMovies]
  },

  async getMovie(id: string): Promise<Movie | null> {
    await delay(200)
    return mockMovies.find((m) => m.id === id) ?? null
  },

  async createMovie(movie: Omit<Movie, 'id' | 'createdAt'>): Promise<Movie> {
    await delay(400)
    const newMovie: Movie = {
      ...movie,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    }
    mockMovies.push(newMovie)
    return newMovie
  },

  async updateMovie(id: string, data: Partial<Movie>): Promise<Movie | null> {
    await delay(400)
    const i = mockMovies.findIndex((m) => m.id === id)
    if (i === -1) return null
    mockMovies[i] = { ...mockMovies[i], ...data }
    return mockMovies[i]
  },

  async deleteMovie(id: string): Promise<boolean> {
    await delay(300)
    const i = mockMovies.findIndex((m) => m.id === id)
    if (i === -1) return false
    mockMovies.splice(i, 1)
    return true
  },

  async getTheaters(): Promise<Theater[]> {
    await delay(300)
    return JSON.parse(JSON.stringify(mockTheaters))
  },

  async getShowtimes(): Promise<Showtime[]> {
    await delay(300)
    return mockShowtimes.map((s) => ({
      ...s,
      movie: mockMovies.find((m) => m.id === s.movieId),
      screen: mockTheaters.flatMap((t) => t.screens).find((sc) => sc.id === s.screenId),
      theater: mockTheaters.find((t) => t.id === s.theaterId),
    }))
  },

  async createShowtime(data: Omit<Showtime, 'id'>): Promise<Showtime> {
    await delay(400)
    const newShowtime: Showtime = { ...data, id: 'sh' + Date.now() }
    mockShowtimes.push(newShowtime)
    return newShowtime
  },

  async deleteShowtime(id: string): Promise<boolean> {
    await delay(300)
    const i = mockShowtimes.findIndex((s) => s.id === id)
    if (i === -1) return false
    mockShowtimes.splice(i, 1)
    return true
  },

  async getSeats(): Promise<Seat[]> {
    await delay(300)
    return mockSeats.map((s) => ({
      ...s,
      screen: mockTheaters.flatMap((t) => t.screens).find((sc) => sc.id === s.screenId),
    }))
  },

  async getSeatsByScreen(screenId: string): Promise<Seat[]> {
    await delay(300)
    return mockSeats
      .filter((s) => s.screenId === screenId)
      .map((s) => ({
        ...s,
        screen: mockTheaters.flatMap((t) => t.screens).find((sc) => sc.id === s.screenId),
      }))
      .sort((a, b) => a.row.localeCompare(b.row) || a.seatNumber - b.seatNumber)
  },

  async createSeat(data: Omit<Seat, 'id'>): Promise<Seat> {
    await delay(400)
    const newSeat: Seat = { ...data, id: `seat-${Date.now()}` }
    mockSeats.push(newSeat)
    const screen = mockTheaters.flatMap((t) => t.screens).find((sc) => sc.id === data.screenId)
    if (screen) screen.capacity = mockSeats.filter((s) => s.screenId === data.screenId).length
    return { ...newSeat, screen }
  },

  async updateSeat(id: string, data: Partial<Seat>): Promise<Seat | null> {
    await delay(400)
    const i = mockSeats.findIndex((s) => s.id === id)
    if (i === -1) return null
    mockSeats[i] = { ...mockSeats[i], ...data }
    return mockSeats[i]
  },

  async deleteSeat(id: string): Promise<boolean> {
    await delay(300)
    const seat = mockSeats.find((s) => s.id === id)
    if (!seat) return false
    const i = mockSeats.findIndex((s) => s.id === id)
    mockSeats.splice(i, 1)
    const screen = mockTheaters.flatMap((t) => t.screens).find((sc) => sc.id === seat.screenId)
    if (screen) screen.capacity = mockSeats.filter((s) => s.screenId === seat.screenId).length
    return true
  },
}
