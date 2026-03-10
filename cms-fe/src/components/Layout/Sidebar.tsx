import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/movies', label: 'Movies', icon: '🎬' },
  { to: '/showtimes', label: 'Showtimes', icon: '🕐' },
  { to: '/theaters', label: 'Theaters', icon: '🏛️' },
  { to: '/seats', label: 'Seats', icon: '💺' },
];

export function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-cinema-panel border-r border-cinema-border flex flex-col">
      <div className="p-6 border-b border-cinema-border">
        <h1 className="font-display font-bold text-xl text-cinema-gold">Reel CMS</h1>
        <p className="text-cinema-muted text-sm mt-0.5">Movie Booking</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cinema-gold/15 text-cinema-gold'
                  : 'text-zinc-400 hover:bg-cinema-border hover:text-zinc-200'
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
