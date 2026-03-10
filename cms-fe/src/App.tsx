import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { MovieList } from './pages/Movies/MovieList';
import { MovieForm } from './pages/Movies/MovieForm';
import { Showtimes } from './pages/Showtimes';
import { Theaters } from './pages/Theaters';
import { Seats } from './pages/Seats';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="movies" element={<MovieList />} />
          <Route path="movies/new" element={<MovieForm />} />
          <Route path="movies/:id/edit" element={<MovieForm />} />
          <Route path="showtimes" element={<Showtimes />} />
          <Route path="theaters" element={<Theaters />} />
          <Route path="seats" element={<Seats />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
