import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Seat, Screen, Theater } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../components/ui/Table';

const SEAT_TYPE_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'wheelchair', label: 'Wheelchair' },
];

const SEAT_TYPE_STYLE: Record<Seat['type'], string> = {
  standard: 'bg-zinc-600 hover:bg-zinc-500',
  premium: 'bg-cinema-gold/80 text-cinema-dark hover:bg-cinema-gold',
  wheelchair: 'bg-sky-600 hover:bg-sky-500',
};

export function Seats() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [screenId, setScreenId] = useState<string>('');
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ row: 'A', seatNumber: 1, type: 'standard' as Seat['type'], isActive: true });
  const [saving, setSaving] = useState(false);

  const screens: { screen: Screen; theater: Theater }[] = theaters.flatMap((t) =>
    t.screens.map((s) => ({ screen: s, theater: t }))
  );
  const selectedScreen = screens.find((s) => s.screen.id === screenId);

  useEffect(() => {
    api.getTheaters().then((data) => {
      setTheaters(data);
      if (data.length && data[0].screens.length && !screenId) {
        setScreenId(data[0].screens[0].id);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!screenId) {
      setSeats([]);
      return;
    }
    setSeatsLoading(true);
    api.getSeatsByScreen(screenId).then((data) => {
      setSeats(data);
      setSeatsLoading(false);
    });
  }, [screenId]);

  const handleAddSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenId) return;
    setSaving(true);
    try {
      const created = await api.createSeat({
        screenId,
        row: form.row.trim().toUpperCase() || 'A',
        seatNumber: form.seatNumber,
        type: form.type,
        isActive: form.isActive,
      });
      setSeats((prev) => [...prev, created].sort((a, b) => a.row.localeCompare(b.row) || a.seatNumber - b.seatNumber));
      setForm((f) => ({ ...f, seatNumber: f.seatNumber + 1 }));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSeat = async (id: string, data: Partial<Seat>) => {
    const updated = await api.updateSeat(id, data);
    if (updated) {
      setSeats((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
      );
      setEditingId(null);
    }
  };

  const handleDeleteSeat = async (id: string) => {
    if (!confirm('Remove this seat?')) return;
    const ok = await api.deleteSeat(id);
    if (ok) setSeats((prev) => prev.filter((s) => s.id !== id));
  };

  const rows = Array.from(new Set(seats.map((s) => s.row))).sort();
  const maxCol = Math.max(0, ...seats.map((s) => s.seatNumber));
  const seatMap = new Map(seats.map((s) => [`${s.row}-${s.seatNumber}`, s]));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-zinc-100">Seats</h1>
        <p className="text-cinema-muted mt-1">Manage seats per screen</p>
      </div>

      {loading ? (
        <div className="text-cinema-muted">Loading theaters...</div>
      ) : (
        <>
          <Card className="mb-6">
            <label className="block text-sm font-medium text-zinc-300 mb-2">Screen</label>
            <select
              value={screenId}
              onChange={(e) => setScreenId(e.target.value)}
              className="w-full max-w-md px-3 py-2 rounded-lg bg-cinema-dark border border-cinema-border text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cinema-gold/50"
            >
              <option value="">Select a screen</option>
              {screens.map(({ screen, theater }) => (
                <option key={screen.id} value={screen.id}>
                  {theater.name} — {screen.name} ({screen.capacity} seats)
                </option>
              ))}
            </select>
          </Card>

          {screenId && (
            <>
              <Card className="mb-6">
                <CardHeader
                  title="Add seat"
                  subtitle={`Add a new seat to ${selectedScreen?.screen.name ?? 'this screen'}`}
                />
                <form onSubmit={handleAddSeat} className="flex flex-wrap items-end gap-4">
                  <div className="w-24">
                    <label className="block text-xs text-cinema-muted mb-1">Row</label>
                    <Input
                      value={form.row}
                      onChange={(e) => setForm((f) => ({ ...f, row: e.target.value }))}
                      placeholder="A"
                      maxLength={2}
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-cinema-muted mb-1">Number</label>
                    <Input
                      type="number"
                      min={1}
                      value={form.seatNumber}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, seatNumber: Number(e.target.value) || 1 }))
                      }
                    />
                  </div>
                  <div className="w-36">
                    <label className="block text-xs text-cinema-muted mb-1">Type</label>
                    <Select
                      options={SEAT_TYPE_OPTIONS}
                      value={form.type}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, type: e.target.value as Seat['type'] }))
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="newActive"
                      checked={form.isActive}
                      onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                      className="rounded border-cinema-border bg-cinema-dark text-cinema-gold"
                    />
                    <label htmlFor="newActive" className="text-sm text-zinc-300">Active</label>
                  </div>
                  <Button type="submit" loading={saving}>
                    Add seat
                  </Button>
                </form>
              </Card>

              <Card className="mb-6">
                <CardHeader
                  title="Seat layout"
                  subtitle={`${seats.length} seat(s)`}
                />
                {seatsLoading ? (
                  <div className="py-8 text-center text-cinema-muted">Loading seats...</div>
                ) : seats.length === 0 ? (
                  <div className="py-8 text-center text-cinema-muted">
                    No seats yet. Add seats above.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="inline-block p-4 bg-cinema-dark rounded-lg">
                      <div className="flex gap-0.5 mb-2">
                        <span className="w-6 text-xs text-cinema-muted" />
                        {Array.from({ length: maxCol }, (_, i) => (
                          <span
                            key={i}
                            className="w-7 text-center text-xs text-cinema-muted"
                          >
                            {i + 1}
                          </span>
                        ))}
                      </div>
                      {rows.map((row) => (
                        <div key={row} className="flex gap-0.5 items-center mb-1">
                          <span className="w-6 text-xs font-medium text-cinema-muted">{row}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: maxCol }, (_, i) => {
                              const num = i + 1;
                              const seat = seatMap.get(`${row}-${num}`);
                              if (!seat)
                                return (
                                  <span
                                    key={`${row}-${num}`}
                                    className="w-7 h-7 rounded bg-cinema-border/30"
                                  />
                                );
                              return (
                                <span
                                  key={seat.id}
                                  className={`w-7 h-7 rounded flex items-center justify-center text-xs font-medium ${SEAT_TYPE_STYLE[seat.type]} ${!seat.isActive ? 'opacity-40' : ''}`}
                                  title={`${row}${num} — ${seat.type}`}
                                >
                                  {seat.isActive ? num : '—'}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-4 text-xs text-cinema-muted">
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-zinc-600" /> Standard
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-cinema-gold/80" /> Premium
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded bg-sky-600" /> Wheelchair
                      </span>
                    </div>
                  </div>
                )}
              </Card>

              <Card>
                <CardHeader title="All seats (table)" subtitle="Edit type or deactivate" />
                {seatsLoading ? (
                  <div className="py-8 text-center text-cinema-muted">Loading...</div>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <Th>Row</Th>
                        <Th>Number</Th>
                        <Th>Type</Th>
                        <Th>Status</Th>
                        <Th className="text-right">Actions</Th>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {seats.map((seat) => (
                        <TableRow key={seat.id}>
                          <Td className="font-medium">{seat.row}</Td>
                          <Td>{seat.seatNumber}</Td>
                          <Td>
                            {editingId === seat.id ? (
                              <Select
                                options={SEAT_TYPE_OPTIONS}
                                value={seat.type}
                                onChange={(e) =>
                                  handleUpdateSeat(seat.id, {
                                    type: e.target.value as Seat['type'],
                                  })
                                }
                                onBlur={() => setEditingId(null)}
                                className="w-32"
                              />
                            ) : (
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-xs ${SEAT_TYPE_STYLE[seat.type]}`}
                              >
                                {seat.type}
                              </span>
                            )}
                          </Td>
                          <Td>
                            {editingId === seat.id ? (
                              <input
                                type="checkbox"
                                checked={seat.isActive}
                                onChange={(e) =>
                                  handleUpdateSeat(seat.id, { isActive: e.target.checked })
                                }
                                className="rounded border-cinema-border bg-cinema-dark text-cinema-gold"
                              />
                            ) : (
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-xs ${
                                  seat.isActive
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-zinc-500/20 text-zinc-400'
                                }`}
                              >
                                {seat.isActive ? 'Active' : 'Inactive'}
                              </span>
                            )}
                          </Td>
                          <Td className="text-right">
                            {editingId === seat.id ? (
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="text-cinema-muted hover:text-zinc-300 text-sm"
                              >
                                Done
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(seat.id)}
                                  className="text-cinema-gold hover:underline mr-3"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSeat(seat.id)}
                                  className="text-red-400 hover:underline"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </Td>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
