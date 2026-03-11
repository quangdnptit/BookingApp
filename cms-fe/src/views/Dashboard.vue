<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="mb-10 flex items-center justify-between">
      <div>
        <h1 class="font-display font-bold text-3xl text-gray-800 tracking-tight">Overview</h1>
        <p class="text-cinema-muted mt-1">Manage your movie booking</p>
      </div>
      <div class="flex gap-3">
        <router-link to="/showtimes">
          <Button variant="secondary">Manage showtimes</Button>
        </router-link>
        <router-link to="/movies/new">
          <Button>Add movie</Button>
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <Card v-for="i in 5" :key="i" class="animate-pulse h-36 bg-cinema-surface" />
    </div>
    <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <router-link
        v-for="item in statCards"
        :key="item.key"
        :to="item.to || '#'"
        :class="item.to ? 'block' : 'pointer-events-none'"
      >
        <Card
          :class="[
            'h-full transition-all duration-200 hover:shadow-md',
            item.to ? 'hover:border-cinema-gold/40 cursor-pointer' : '',
            item.bg,
          ]"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-cinema-muted text-sm">{{ item.label }}</p>
              <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats[item.key] }}</p>
            </div>
            <span class="text-3xl">{{ item.icon }}</span>
          </div>
        </Card>
      </router-link>
    </div>

    <Card class="mt-8">
      <h2 class="text-lg font-semibold text-gray-800 mb-1">Quick actions</h2>
      <p class="text-cinema-muted text-sm">Jump straight into managing content from the sidebar or the links above.</p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DashboardStats } from '../types'
import { api } from '../api/client'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'

const statCards = [
  { key: 'totalMovies' as const, label: 'Movies', icon: '🎬', to: '/movies', bg: 'bg-amber-50 border-amber-200/60' },
  { key: 'totalTheaters' as const, label: 'Theaters', icon: '🏛️', to: '/theaters', bg: 'bg-emerald-50 border-emerald-200/60' },
  { key: 'totalShowtimes' as const, label: 'Showtimes', icon: '🕐', to: '/showtimes', bg: 'bg-violet-50 border-violet-200/60' },
  { key: 'totalSeats' as const, label: 'Seats', icon: '💺', to: '/seats', bg: 'bg-sky-50 border-sky-200/60' },
  { key: 'totalBookings' as const, label: 'Bookings', icon: '🎟️', to: '', bg: 'bg-rose-50 border-rose-200/60' },
]

const stats = ref<DashboardStats | null>(null)
const loading = ref(true)

onMounted(async () => {
  stats.value = await api.getDashboardStats()
  loading.value = false
})
</script>
