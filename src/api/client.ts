import type { Movie, Theater, Showtime, Seat, DashboardStats, User, LoginCredentials, Screen } from '../types'
import { http, setAuthToken } from './http'

// Backend DTOs (match OpenAPI schema)
interface LoginResponse {
  token: string
  id: string
  email: string
  fullName: string
  role?: string
}

interface BackendMovie {
  id: string
  title: string
  description: string
  durationMinutes: number
  genre: string
  ageRating: string
  posterUrl: string
  createdAt: string
}

interface BackendRoom {
  id: string
  name: string
  totalSeats: number
  createdAt?: string
}

interface BackendTheater {
  id: string
  name: string
  location: string
  createdAt?: string
  rooms?: BackendRoom[]
}

interface BackendShowtime {
  id: string
  startTime: string
  endTime: string
  basePrice: number
  createdAt?: string
  movieId?: string
  roomId?: string
}

interface BackendSeat {
  id: string
  seatRow: string
  seatNumber: number
  seatType: string
  isActive?: boolean
  createdAt?: string
  roomId?: string
}

function mapMovie(b: BackendMovie): Movie {
  return {
    id: b.id,
    title: b.title,
    description: b.description ?? '',
    durationMinutes: b.durationMinutes,
    rating: b.ageRating ?? 'PG-13',
    genre: b.genre ?? '',
    posterUrl: b.posterUrl ?? '',
    isActive: true,
    createdAt: b.createdAt ?? '',
  }
}

function mapTheater(b: BackendTheater): Theater {
  const rooms = b.rooms ?? []
  return {
    id: b.id,
    name: b.name,
    address: b.location ?? '',
    screenCount: rooms.length,
    screens: rooms.map((r) => ({
      id: r.id,
      name: r.name,
      capacity: r.totalSeats ?? 0,
      theaterId: b.id,
    })),
    isActive: true,
  }
}

function mapShowtime(b: BackendShowtime, movies?: Movie[], theaters?: Theater[]): Showtime {
  const screenId = b.roomId ?? ''
  const movieId = b.movieId ?? ''
  let screen: Theater['screens'][0] | undefined
  let theater: Theater | undefined
  if (theaters) {
    for (const t of theaters) {
      screen = t.screens.find((s) => s.id === screenId)
      if (screen) {
        theater = t
        break
      }
    }
  }
  return {
    id: b.id,
    movieId,
    screenId,
    theaterId: theater?.id ?? '',
    startTime: b.startTime,
    endTime: b.endTime,
    price: b.basePrice ?? 0,
    currency: 'USD',
    isActive: true,
    movie: movies?.find((m) => m.id === movieId),
    screen,
    theater,
  }
}

function mapSeat(
  b: BackendSeat,
  screen?: { id: string; name: string; capacity: number; theaterId: string },
  fallbackScreenId?: string
): Seat {
  return {
    id: b.id,
    screenId: b.roomId ?? fallbackScreenId ?? '',
    row: b.seatRow ?? '',
    seatNumber: b.seatNumber ?? 0,
    type: (b.seatType as Seat['type']) ?? 'standard',
    isActive: b.isActive ?? true,
    screen,
  }
}

export const api = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const res = await http.post<LoginResponse>('/api/auth/login', {
      email: credentials.email,
      password: credentials.password,
    })
    setAuthToken(res.token)
    return {
      user: { id: res.id, email: res.email, name: res.fullName ?? res.email },
      token: res.token,
    }
  },

  async logout(): Promise<void> {
    setAuthToken(null)
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const [movies, theaters, showtimes, seats] = await Promise.all([
      http.get<BackendMovie[]>('/api/movies'),
      http.get<BackendTheater[]>('/api/theaters'),
      http.get<BackendShowtime[]>('/api/showtimes'),
      http.get<BackendSeat[]>('/api/seats'),
    ])
    return {
      totalMovies: Array.isArray(movies) ? movies.length : 0,
      totalTheaters: Array.isArray(theaters) ? theaters.length : 0,
      totalShowtimes: Array.isArray(showtimes) ? showtimes.length : 0,
      totalBookings: 0,
      totalSeats: Array.isArray(seats) ? seats.length : 0,
    }
  },

  async getMovies(): Promise<Movie[]> {
    const list = await http.get<BackendMovie[]>('/api/movies')
    return (Array.isArray(list) ? list : []).map(mapMovie)
  },

  async getMovie(id: string): Promise<Movie | null> {
    try {
      const b = await http.get<BackendMovie>(`/api/movies/${id}`)
      return mapMovie(b)
    } catch {
      return null
    }
  },

  async createMovie(movie: Omit<Movie, 'id' | 'createdAt'>): Promise<Movie> {
    const b = await http.post<BackendMovie>('/api/movies', {
      title: movie.title,
      description: movie.description,
      durationMinutes: movie.durationMinutes,
      genre: movie.genre,
      ageRating: movie.rating,
      posterUrl: movie.posterUrl ?? '',
    })
    return mapMovie(b)
  },

  async updateMovie(id: string, data: Partial<Movie>): Promise<Movie | null> {
    try {
      const existing = await this.getMovie(id)
      if (!existing) return null
      const merged = { ...existing, ...data }
      const b = await http.put<BackendMovie>(`/api/movies/${id}`, {
        title: merged.title,
        description: merged.description,
        durationMinutes: merged.durationMinutes,
        genre: merged.genre,
        ageRating: merged.rating,
        posterUrl: merged.posterUrl ?? '',
      })
      return mapMovie(b)
    } catch {
      return null
    }
  },

  async deleteMovie(id: string): Promise<boolean> {
    try {
      await http.delete(`/api/movies/${id}`)
      return true
    } catch {
      return false
    }
  },

  async getTheaters(): Promise<Theater[]> {
    const list = await http.get<BackendTheater[]>('/api/theaters')
    const theaters = Array.isArray(list) ? list : []
    const result: Theater[] = []
    for (const t of theaters) {
      if (t.id) {
        try {
          const rooms = await http.get<BackendRoom[]>(`/api/rooms/theater/${t.id}`)
          result.push(mapTheater({ ...t, rooms: Array.isArray(rooms) ? rooms : [] }))
        } catch {
          result.push(mapTheater(t))
        }
      } else {
        result.push(mapTheater(t))
      }
    }
    return result
  },

  async createTheater(data: { name: string; address: string }): Promise<Theater> {
    const b = await http.post<BackendTheater>('/api/theaters', {
      name: data.name,
      location: data.address,
    })
    return mapTheater(b)
  },

  async updateTheater(id: string, data: { name?: string; address?: string }): Promise<Theater | null> {
    try {
      const existing = await http.get<BackendTheater>(`/api/theaters/${id}`)
      const b = await http.put<BackendTheater>(`/api/theaters/${id}`, {
        name: data.name ?? existing.name,
        location: data.address ?? existing.location,
      })
      return mapTheater(b)
    } catch {
      return null
    }
  },

  async deleteTheater(id: string): Promise<boolean> {
    try {
      await http.delete(`/api/theaters/${id}`)
      return true
    } catch {
      return false
    }
  },

  async createRoom(theaterId: string, data: { name: string; totalRows: number; seatsPerRow: number }): Promise<Screen> {
    const b = await http.post<BackendRoom>('/api/rooms', {
      theaterId,
      name: data.name,
      totalRows: data.totalRows,
      seatsPerRow: data.seatsPerRow,
    })
    return {
      id: b.id,
      name: b.name,
      capacity: b.totalSeats ?? 0,
      theaterId,
    }
  },

  async deleteRoom(id: string): Promise<boolean> {
    try {
      await http.delete(`/api/rooms/${id}`)
      return true
    } catch {
      return false
    }
  },

  async getShowtimes(): Promise<Showtime[]> {
    const [list, movies, theaters] = await Promise.all([
      http.get<BackendShowtime[]>('/api/showtimes'),
      this.getMovies(),
      this.getTheaters(),
    ])
    const showtimes = Array.isArray(list) ? list : []
    return showtimes.map((s) => mapShowtime(s, movies, theaters))
  },

  async createShowtime(data: Omit<Showtime, 'id'>): Promise<Showtime> {
    const b = await http.post<BackendShowtime>('/api/showtimes', {
      movieId: data.movieId,
      roomId: data.screenId,
      startTime: data.startTime,
      endTime: data.endTime,
      basePrice: data.price,
    })
    return mapShowtime(b)
  },

  async updateShowtime(
    id: string,
    data: { movieId?: string; screenId?: string; startTime?: string; endTime?: string; price?: number }
  ): Promise<Showtime | null> {
    try {
      const [existing, movies, theaters] = await Promise.all([
        http.get<BackendShowtime>(`/api/showtimes/${id}`),
        this.getMovies(),
        this.getTheaters(),
      ])
      const b = await http.put<BackendShowtime>(`/api/showtimes/${id}`, {
        movieId: data.movieId ?? existing.movieId,
        roomId: data.screenId ?? existing.roomId,
        startTime: data.startTime ?? existing.startTime,
        endTime: data.endTime ?? existing.endTime,
        basePrice: data.price ?? existing.basePrice,
      })
      return mapShowtime(b, movies, theaters)
    } catch {
      return null
    }
  },

  async deleteShowtime(id: string): Promise<boolean> {
    try {
      await http.delete(`/api/showtimes/${id}`)
      return true
    } catch {
      return false
    }
  },

  async getSeatsByScreen(screenId: string): Promise<Seat[]> {
    const list = await http.get<BackendSeat[]>(`/api/seats/room/${screenId}`)
    const seats = Array.isArray(list) ? list : []
    const theaters = await this.getTheaters()
    const screen = theaters.flatMap((t) => t.screens).find((s) => s.id === screenId)
    return seats
      .map((s) => mapSeat(s, screen, screenId))
      .sort((a, b) => a.row.localeCompare(b.row) || a.seatNumber - b.seatNumber)
  },

  async updateSeat(id: string, data: Partial<Seat>): Promise<Seat | null> {
    try {
      const b = await http.put<BackendSeat>(`/api/seats/${id}`, {
        seatRow: data.row,
        seatNumber: data.seatNumber,
        seatType: data.type,
        isActive: data.isActive,
      })
      return mapSeat(b)
    } catch {
      return null
    }
  },

  async deleteSeat(id: string): Promise<boolean> {
    try {
      await http.delete(`/api/seats/${id}`)
      return true
    } catch {
      return false
    }
  },
}
