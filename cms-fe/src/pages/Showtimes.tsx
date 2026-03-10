import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Showtime } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../components/ui/Table';

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export function Showtimes() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getShowtimes().then((data) => {
      setShowtimes(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this showtime?')) return;
    const ok = await api.deleteShowtime(id);
    if (ok) setShowtimes((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-zinc-100">Showtimes</h1>
        <p className="text-cinema-muted mt-1">Manage screening schedules</p>
      </div>

      <Card>
        <CardHeader
          title="Scheduled showtimes"
          subtitle={`${showtimes.length} showtime(s)`}
        />
        {loading ? (
          <div className="py-12 text-center text-cinema-muted">Loading...</div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <Th>Movie</Th>
                <Th>Theater / Screen</Th>
                <Th>Start</Th>
                <Th>End</Th>
                <Th>Price</Th>
                <Th className="text-right">Actions</Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {showtimes.map((s) => (
                <TableRow key={s.id}>
                  <Td>
                    <div className="font-medium text-zinc-100">{s.movie?.title ?? s.movieId}</div>
                  </Td>
                  <Td className="text-cinema-muted">
                    {s.theater?.name ?? s.theaterId} / {s.screen?.name ?? s.screenId}
                  </Td>
                  <Td>{formatDateTime(s.startTime)}</Td>
                  <Td>{formatDateTime(s.endTime)}</Td>
                  <Td>
                    {s.currency} {s.price.toFixed(2)}
                  </Td>
                  <Td className="text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </Td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!loading && showtimes.length === 0 && (
          <div className="py-12 text-center text-cinema-muted">No showtimes scheduled.</div>
        )}
      </Card>
    </div>
  );
}
