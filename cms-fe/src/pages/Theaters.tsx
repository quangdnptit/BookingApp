import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Theater } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, Th, Td } from '../components/ui/Table';

export function Theaters() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTheaters().then((data) => {
      setTheaters(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-zinc-100">Theaters</h1>
        <p className="text-cinema-muted mt-1">View theater and screen information</p>
      </div>

      <Card>
        <CardHeader
          title="All theaters"
          subtitle={`${theaters.length} theater(s)`}
        />
        {loading ? (
          <div className="py-12 text-center text-cinema-muted">Loading...</div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <Th>Name</Th>
                <Th>Address</Th>
                <Th>Screens</Th>
                <Th>Total capacity</Th>
                <Th>Status</Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {theaters.map((t) => (
                <TableRow key={t.id}>
                  <Td className="font-medium text-zinc-100">{t.name}</Td>
                  <Td className="text-cinema-muted">{t.address}</Td>
                  <Td>{t.screenCount}</Td>
                  <Td>
                    {t.screens.reduce((sum, s) => sum + s.capacity, 0)}
                  </Td>
                  <Td>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        t.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400'
                      }`}
                    >
                      {t.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </Td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
