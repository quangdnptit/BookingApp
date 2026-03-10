import type { Movie, Theater, Showtime, Seat } from '../types';

function generateSeatsForScreen(
  screenId: string,
  rows: number,
  seatsPerRow: number,
  premiumRows: number[] = []
): Seat[] {
  const rowsList = Array.from({ length: rows }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const out: Seat[] = [];
  let id = 1;
  rowsList.forEach((row, rowIndex) => {
    const isPremium = premiumRows.includes(rowIndex);
    for (let num = 1; num <= seatsPerRow; num++) {
      out.push({
        id: `seat-${screenId}-${id}`,
        screenId,
        row,
        seatNumber: num,
        type: isPremium ? 'premium' : 'standard',
        isActive: true,
      });
      id++;
    }
  });
  return out;
}

export const mockSeats: Seat[] = [
  ...generateSeatsForScreen('s1', 10, 12, [8, 9]),
  ...generateSeatsForScreen('s2', 8, 10),
  ...generateSeatsForScreen('s3', 6, 10),
  ...generateSeatsForScreen('s4', 12, 18, [10, 11]),
  ...generateSeatsForScreen('s5', 10, 15, [8]),
];

export const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    durationMinutes: 148,
    rating: 'PG-13',
    genre: 'Sci-Fi, Thriller',
    posterUrl: 'https://image.tmdb.org/t/p/w200/9gk7adHYeDvHkCSEqAvQNLV5ur4.jpg',
    releaseDate: '2010-07-16',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'The Dark Knight',
    description: 'Batman must accept one of the greatest psychological tests to fight injustice.',
    durationMinutes: 152,
    rating: 'PG-13',
    genre: 'Action, Crime, Drama',
    posterUrl: 'https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    releaseDate: '2008-07-18',
    isActive: true,
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space.',
    durationMinutes: 169,
    rating: 'PG-13',
    genre: 'Sci-Fi, Drama, Adventure',
    posterUrl: 'https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    releaseDate: '2014-11-07',
    isActive: true,
    createdAt: '2024-01-17T10:00:00Z',
  },
];

export const mockTheaters: Theater[] = [
  {
    id: 't1',
    name: 'Grand Cinema Downtown',
    address: '123 Main St, City Center',
    screenCount: 5,
    screens: [
      { id: 's1', name: 'Screen 1', capacity: 120, theaterId: 't1' },
      { id: 's2', name: 'Screen 2', capacity: 80, theaterId: 't1' },
      { id: 's3', name: 'Screen 3', capacity: 60, theaterId: 't1' },
    ],
    isActive: true,
  },
  {
    id: 't2',
    name: 'Starlight Multiplex',
    address: '456 Oak Ave, Westside',
    screenCount: 4,
    screens: [
      { id: 's4', name: 'Screen A', capacity: 200, theaterId: 't2' },
      { id: 's5', name: 'Screen B', capacity: 150, theaterId: 't2' },
    ],
    isActive: true,
  },
];

export const mockShowtimes: Showtime[] = [
  {
    id: 'sh1',
    movieId: '1',
    screenId: 's1',
    theaterId: 't1',
    startTime: '2025-03-15T14:00:00',
    endTime: '2025-03-15T16:28:00',
    price: 12.99,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 'sh2',
    movieId: '2',
    screenId: 's2',
    theaterId: 't1',
    startTime: '2025-03-15T18:00:00',
    endTime: '2025-03-15T20:32:00',
    price: 11.99,
    currency: 'USD',
    isActive: true,
  },
  {
    id: 'sh3',
    movieId: '3',
    screenId: 's4',
    theaterId: 't2',
    startTime: '2025-03-16T12:00:00',
    endTime: '2025-03-16T14:49:00',
    price: 13.99,
    currency: 'USD',
    isActive: true,
  },
];
