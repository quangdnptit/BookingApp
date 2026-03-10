import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import type { Movie } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const emptyMovie: Omit<Movie, 'id' | 'createdAt'> = {
  title: '',
  description: '',
  durationMinutes: 0,
  rating: 'PG-13',
  genre: '',
  posterUrl: '',
  releaseDate: '',
  isActive: true,
};

export function MovieForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  const [form, setForm] = useState(emptyMovie);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      api.getMovie(id).then((movie) => {
        if (movie) {
          const { id: _id, createdAt: _c, ...rest } = movie;
          setForm(rest);
        }
        setLoading(false);
      });
    }
  }, [isEdit, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit && id) {
        await api.updateMovie(id, form);
      } else {
        await api.createMovie(form);
      }
      navigate('/movies');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-cinema-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-zinc-100">
          {isEdit ? 'Edit movie' : 'Add movie'}
        </h1>
        <p className="text-cinema-muted mt-1">
          {isEdit ? 'Update movie details' : 'Create a new movie entry'}
        </p>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Movie title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short description"
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-cinema-dark border border-cinema-border text-zinc-100 placeholder:text-cinema-muted focus:outline-none focus:ring-2 focus:ring-cinema-gold/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Duration (min)</label>
              <Input
                type="number"
                min={1}
                value={form.durationMinutes || ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) || 0 }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Rating</label>
              <select
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-cinema-dark border border-cinema-border text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cinema-gold/50"
              >
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
                <option value="NC-17">NC-17</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Genre</label>
            <Input
              value={form.genre}
              onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
              placeholder="e.g. Action, Drama"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Poster URL</label>
            <Input
              value={form.posterUrl}
              onChange={(e) => setForm((f) => ({ ...f, posterUrl: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Release date</label>
            <Input
              type="date"
              value={form.releaseDate}
              onChange={(e) => setForm((f) => ({ ...f, releaseDate: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="rounded border-cinema-border bg-cinema-dark text-cinema-gold focus:ring-cinema-gold"
            />
            <label htmlFor="isActive" className="text-sm text-zinc-300">Active (visible to users)</label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={saving}>
              {isEdit ? 'Save changes' : 'Create movie'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/movies')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
