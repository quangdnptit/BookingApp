<template>
  <div v-if="loading" class="p-8">
    <div class="text-cinema-muted">Loading...</div>
  </div>
  <div v-else class="p-8">
    <div class="mb-8">
      <h1 class="font-display font-bold text-2xl text-zinc-100">
        {{ isEdit ? 'Edit movie' : 'Add movie' }}
      </h1>
      <p class="text-cinema-muted mt-1">
        {{ isEdit ? 'Update movie details' : 'Create a new movie entry' }}
      </p>
    </div>

    <Card class="max-w-2xl">
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">Title</label>
          <Input v-model="form.title" placeholder="Movie title" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">Description</label>
          <textarea
            v-model="form.description"
            placeholder="Short description"
            rows="3"
            class="w-full px-3 py-2 rounded-lg bg-cinema-dark border border-cinema-border text-zinc-100 placeholder:text-cinema-muted focus:outline-none focus:ring-2 focus:ring-cinema-gold/50"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Duration (min)</label>
            <Input v-model.number="form.durationMinutes" type="number" min="1" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Rating</label>
            <select
              v-model="form.rating"
              class="w-full px-3 py-2 rounded-lg bg-cinema-dark border border-cinema-border text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cinema-gold/50"
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
          <label class="block text-sm font-medium text-zinc-300 mb-1">Genre</label>
          <Input v-model="form.genre" placeholder="e.g. Action, Drama" />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">Poster URL</label>
          <Input v-model="form.posterUrl" placeholder="https://..." />
        </div>
        <div>
          <label class="block text-sm font-medium text-zinc-300 mb-1">Release date</label>
          <Input v-model="form.releaseDate" type="date" />
        </div>
        <div class="flex items-center gap-2">
          <input
            id="isActive"
            v-model="form.isActive"
            type="checkbox"
            class="rounded border-cinema-border bg-cinema-dark text-cinema-gold focus:ring-cinema-gold"
          />
          <label for="isActive" class="text-sm text-zinc-300">Active (visible to users)</label>
        </div>
        <div class="flex gap-3 pt-4">
          <Button type="submit" :loading="saving">
            {{ isEdit ? 'Save changes' : 'Create movie' }}
          </Button>
          <Button type="button" variant="secondary" @click="router.push('/movies')">Cancel</Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Movie } from '../../types'
import { api } from '../../api/client'
import Card from '../../components/ui/Card.vue'
import Button from '../../components/ui/Button.vue'
import Input from '../../components/ui/Input.vue'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)
const isEdit = computed(() => id.value && id.value !== 'new')

const form = reactive<Omit<Movie, 'id' | 'createdAt'>>({
  title: '',
  description: '',
  durationMinutes: 0,
  rating: 'PG-13',
  genre: '',
  posterUrl: '',
  releaseDate: '',
  isActive: true,
})
const loading = ref(false)
const saving = ref(false)

onMounted(async () => {
  if (isEdit.value && id.value) {
    loading.value = true
    const movie = await api.getMovie(id.value)
    if (movie) {
      form.title = movie.title
      form.description = movie.description
      form.durationMinutes = movie.durationMinutes
      form.rating = movie.rating
      form.genre = movie.genre
      form.posterUrl = movie.posterUrl
      form.releaseDate = movie.releaseDate
      form.isActive = movie.isActive
    }
    loading.value = false
  }
})

async function handleSubmit() {
  saving.value = true
  try {
    if (isEdit.value && id.value) {
      await api.updateMovie(id.value, form)
    } else {
      await api.createMovie(form)
    }
    router.push('/movies')
  } finally {
    saving.value = false
  }
}
</script>
