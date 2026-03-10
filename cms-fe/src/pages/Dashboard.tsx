import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { DashboardStats } from '../types';
import { Card } from '../components/ui/Card';

const statCards = [
  { key: 'totalMovies' as const, label: 'Movies', icon: '🎬', to: '/movies', color: 'from-amber-500/20 to-amber-600/5' },
  { key: 'totalTheaters' as const, label: 'Theaters', icon: '🏛️', to: '/theaters', color: 'from-emerald-500/20 to-emerald-600/5' },
  { key: 'totalShowtimes' as const, label: 'Showtimes', icon: '🕐', to: '/showtimes', color: 'from-violet-500/20 to-violet-600/5' },
  { key: 'totalSeats' as const, label: 'Seats', icon: '💺', to: '/seats', color: 'from-sky-500/20 to-sky-600/5' },
  { key: 'totalBookings' as const, label: 'Bookings', icon: '🎟️', color: 'from-rose-500/20 to-rose-600/5' },
];

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-zinc-100">Dashboard</h1>
        <p className="text-cinema-muted mt-1">Overview of your movie booking CMS</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse h-32" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map(({ key, label, icon, to, color }) => (
            <Link key={key} to={to || '#'} className={to ? 'block' : 'pointer-events-none'}>
              <Card className={`h-full bg-gradient-to-br ${color} border-cinema-border hover:border-cinema-gold/30 transition-colors`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cinema-muted text-sm">{label}</p>
                    <p className="text-2xl font-bold text-zinc-100 mt-1">{stats[key]}</p>
                  </div>
                  <span className="text-3xl">{icon}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : null}

      <Card className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-100 mb-2">Quick actions</h2>
        <p className="text-cinema-muted text-sm mb-4">Manage your content from the sidebar or use the links above.</p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/movies/new"
            className="px-4 py-2 rounded-lg bg-cinema-gold text-cinema-dark font-medium hover:bg-cinema-gold/90 transition-colors"
          >
            Add movie
          </Link>
          <Link
            to="/showtimes"
            className="px-4 py-2 rounded-lg border border-cinema-border text-zinc-300 hover:bg-cinema-border transition-colors"
          >
            Manage showtimes
          </Link>
        </div>
      </Card>
    </div>
  );
}
