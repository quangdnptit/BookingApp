import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import type { Movie } from '../../types';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../../components/ui/Table';

export function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMovies().then((data) => {
      setMovies(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const ok = await api.deleteMovie(id);
    if (ok) setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-zinc-100">Movies</h1>
          <p className="text-cinema-muted mt-1">Manage movie catalog</p>
        </div>
        <Link to="/movies/new">
          <Button>Add movie</Button>
        </Link>
      </div>

      <Card>
        <CardHeader
          title="All movies"
          subtitle={`${movies.length} movie(s)`}
        />
        {loading ? (
          <div className="py-12 text-center text-cinema-muted">Loading...</div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <Th>Poster</Th>
                <Th>Title</Th>
                <Th>Genre</Th>
                <Th>Duration</Th>
                <Th>Rating</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((m) => (
                <TableRow key={m.id}>
                  <Td>
                    <img
                      src={m.posterUrl}
                      alt=""
                      className="w-12 h-18 object-cover rounded"
                    />
                  </Td>
                  <Td className="font-medium text-zinc-100">{m.title}</Td>
                  <Td className="text-cinema-muted">{m.genre}</Td>
                  <Td>{m.durationMinutes} min</Td>
                  <Td>{m.rating}</Td>
                  <Td>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        m.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'
                      }`}
                    >
                      {m.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <Link to={`/movies/${m.id}/edit`} className="text-cinema-gold hover:underline mr-3">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id, m.title)}
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
        {!loading && movies.length === 0 && (
          <div className="py-12 text-center text-cinema-muted">
            No movies yet. <Link to="/movies/new" className="text-cinema-gold hover:underline">Add one</Link>.
          </div>
        )}
      </Card>
    </div>
  );
}
