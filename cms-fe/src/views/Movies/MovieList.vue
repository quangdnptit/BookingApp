<template>
  <div class="p-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="font-display font-bold text-2xl text-zinc-100">Movies</h1>
        <p class="text-cinema-muted mt-1">Manage movie catalog</p>
      </div>
      <router-link to="/movies/new">
        <Button>Add movie</Button>
      </router-link>
    </div>

    <Card>
      <CardHeader title="All movies" :subtitle="`${movies.length} movie(s)`" />
      <div v-if="loading" class="py-12 text-center text-cinema-muted">Loading...</div>
      <template v-else>
        <div class="overflow-x-auto rounded-lg border border-cinema-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-cinema-panel text-cinema-muted uppercase text-xs">
              <tr>
                <th class="px-4 py-3 font-medium">Poster</th>
                <th class="px-4 py-3 font-medium">Title</th>
                <th class="px-4 py-3 font-medium">Genre</th>
                <th class="px-4 py-3 font-medium">Duration</th>
                <th class="px-4 py-3 font-medium">Rating</th>
                <th class="px-4 py-3 font-medium">Status</th>
                <th class="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cinema-border">
              <tr
                v-for="m in movies"
                :key="m.id"
                class="bg-cinema-dark hover:bg-cinema-panel/80 transition-colors"
              >
                <td class="px-4 py-3">
                  <img :src="m.posterUrl" alt="" class="w-12 h-18 object-cover rounded" />
                </td>
                <td class="px-4 py-3 font-medium text-zinc-100">{{ m.title }}</td>
                <td class="px-4 py-3 text-cinema-muted">{{ m.genre }}</td>
                <td class="px-4 py-3">{{ m.durationMinutes }} min</td>
                <td class="px-4 py-3">{{ m.rating }}</td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex px-2 py-0.5 rounded text-xs font-medium',
                      m.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400',
                    ]"
                  >
                    {{ m.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <router-link :to="`/movies/${m.id}/edit`" class="text-cinema-gold hover:underline mr-3">
                    Edit
                  </router-link>
                  <button type="button" class="text-red-400 hover:underline" @click="handleDelete(m.id, m.title)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="!loading && movies.length === 0" class="py-12 text-center text-cinema-muted">
          No movies yet. <router-link to="/movies/new" class="text-cinema-gold hover:underline">Add one</router-link>.
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Movie } from '../../types'
import { api } from '../../api/client'
import Card from '../../components/ui/Card.vue'
import CardHeader from '../../components/ui/CardHeader.vue'
import Button from '../../components/ui/Button.vue'

const movies = ref<Movie[]>([])
const loading = ref(true)

onMounted(async () => {
  movies.value = await api.getMovies()
  loading.value = false
})

async function handleDelete(id: string, title: string) {
  if (!confirm(`Delete "${title}"?`)) return
  const ok = await api.deleteMovie(id)
  if (ok) movies.value = movies.value.filter((m) => m.id !== id)
}
</script>
