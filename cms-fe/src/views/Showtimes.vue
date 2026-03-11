<template>
  <div class="p-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="font-display font-bold text-2xl text-zinc-100">Showtimes</h1>
        <p class="text-cinema-muted mt-1">Manage screening schedules</p>
      </div>
      <Button @click="showForm = true">Add showtime</Button>
    </div>

    <!-- Add showtime form -->
    <Card v-if="showForm" class="mb-6">
      <CardHeader title="New showtime" subtitle="Schedule a movie in a room" />
      <form class="space-y-4" @submit.prevent="handleCreateShowtime">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Movie</label>
            <select
              v-model="form.movieId"
              required
              class="w-full px-3 py-2 rounded-lg bg-cinema-panel border border-cinema-border text-gray-800 focus:outline-none focus:ring-2 focus:ring-cinema-gold/40 shadow-sm"
            >
              <option value="">Select movie</option>
              <option v-for="m in movies" :key="m.id" :value="m.id">{{ m.title }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Room</label>
            <select
              v-model="form.screenId"
              required
              class="w-full px-3 py-2 rounded-lg bg-cinema-panel border border-cinema-border text-gray-800 focus:outline-none focus:ring-2 focus:ring-cinema-gold/40 shadow-sm"
            >
              <option value="">Select room</option>
              <optgroup v-for="t in theaters" :key="t.id" :label="t.name">
                <option v-for="s in t.screens" :key="s.id" :value="s.id">
                  {{ s.name }} ({{ s.capacity }} seats)
                </option>
              </optgroup>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Start date & time</label>
            <Input v-model="form.startTime" type="datetime-local" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">End date & time</label>
            <Input v-model="form.endTime" type="datetime-local" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Price</label>
            <Input v-model.number="form.price" type="number" min="0" step="0.01" required />
          </div>
        </div>
        <div class="flex gap-3">
          <Button type="submit" :loading="saving">Create showtime</Button>
          <Button type="button" variant="secondary" @click="showForm = false">Cancel</Button>
        </div>
      </form>
    </Card>

    <Card>
      <CardHeader title="Scheduled showtimes" :subtitle="`${showtimes.length} showtime(s)`" />
      <div v-if="loading" class="py-12 text-center text-cinema-muted">Loading...</div>
      <template v-else>
        <div class="overflow-x-auto rounded-lg border border-cinema-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-cinema-panel text-cinema-muted uppercase text-xs">
              <tr>
                <th class="px-4 py-3 font-medium">Movie</th>
                <th class="px-4 py-3 font-medium">Theater / Room</th>
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
                class="bg-cinema-panel hover:bg-cinema-surface/80 transition-colors"
              >
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-800">{{ s.movie?.title ?? s.movieId }}</div>
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
import { ref, reactive, onMounted } from 'vue'
import type { Showtime, Movie, Theater } from '../types'
import { api } from '../api/client'
import Card from '../components/ui/Card.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
}

const showtimes = ref<Showtime[]>([])
const movies = ref<Movie[]>([])
const theaters = ref<Theater[]>([])
const loading = ref(true)
const showForm = ref(false)
const saving = ref(false)

const form = reactive({
  movieId: '',
  screenId: '',
  startTime: '',
  endTime: '',
  price: 0,
})

async function load() {
  const [showtimesList, moviesList, theatersList] = await Promise.all([
    api.getShowtimes(),
    api.getMovies(),
    api.getTheaters(),
  ])
  showtimes.value = showtimesList
  movies.value = moviesList
  theaters.value = theatersList
}

onMounted(async () => {
  await load()
  loading.value = false
})

async function handleCreateShowtime() {
  saving.value = true
  try {
    await api.createShowtime({
      movieId: form.movieId,
      screenId: form.screenId,
      theaterId: theaters.value.find((t) => t.screens.some((s) => s.id === form.screenId))?.id ?? '',
      startTime: form.startTime ? new Date(form.startTime).toISOString() : '',
      endTime: form.endTime ? new Date(form.endTime).toISOString() : '',
      price: form.price,
      currency: 'USD',
      isActive: true,
    })
    form.movieId = ''
    form.screenId = ''
    form.startTime = ''
    form.endTime = ''
    form.price = 0
    showForm.value = false
    await load()
  } finally {
    saving.value = false
  }
}

async function handleDelete(id: string) {
  if (!confirm('Delete this showtime?')) return
  const ok = await api.deleteShowtime(id)
  if (ok) showtimes.value = showtimes.value.filter((s) => s.id !== id)
}
</script>
