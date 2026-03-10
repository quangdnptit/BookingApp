<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="font-display font-bold text-2xl text-zinc-100">Showtimes</h1>
      <p class="text-cinema-muted mt-1">Manage screening schedules</p>
    </div>

    <Card>
      <CardHeader title="Scheduled showtimes" :subtitle="`${showtimes.length} showtime(s)`" />
      <div v-if="loading" class="py-12 text-center text-cinema-muted">Loading...</div>
      <template v-else>
        <div class="overflow-x-auto rounded-lg border border-cinema-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-cinema-panel text-cinema-muted uppercase text-xs">
              <tr>
                <th class="px-4 py-3 font-medium">Movie</th>
                <th class="px-4 py-3 font-medium">Theater / Screen</th>
                <th class="px-4 py-3 font-medium">Start</th>
                <th class="px-4 py-3 font-medium">End</th>
                <th class="px-4 py-3 font-medium">Price</th>
                <th class="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cinema-border">
              <tr
                v-for="s in showtimes"
                :key="s.id"
                class="bg-cinema-dark hover:bg-cinema-panel/80 transition-colors"
              >
                <td class="px-4 py-3">
                  <div class="font-medium text-zinc-100">{{ s.movie?.title ?? s.movieId }}</div>
                </td>
                <td class="px-4 py-3 text-cinema-muted">
                  {{ s.theater?.name ?? s.theaterId }} / {{ s.screen?.name ?? s.screenId }}
                </td>
                <td class="px-4 py-3">{{ formatDateTime(s.startTime) }}</td>
                <td class="px-4 py-3">{{ formatDateTime(s.endTime) }}</td>
                <td class="px-4 py-3">{{ s.currency }} {{ s.price.toFixed(2) }}</td>
                <td class="px-4 py-3 text-right">
                  <button type="button" class="text-red-400 hover:underline" @click="handleDelete(s.id)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="!loading && showtimes.length === 0" class="py-12 text-center text-cinema-muted">
          No showtimes scheduled.
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Showtime } from '../types'
import { api } from '../api/client'
import Card from '../components/ui/Card.vue'
import CardHeader from '../components/ui/CardHeader.vue'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
}

const showtimes = ref<Showtime[]>([])
const loading = ref(true)

onMounted(async () => {
  showtimes.value = await api.getShowtimes()
  loading.value = false
})

async function handleDelete(id: string) {
  if (!confirm('Delete this showtime?')) return
  const ok = await api.deleteShowtime(id)
  if (ok) showtimes.value = showtimes.value.filter((s) => s.id !== id)
}
</script>
