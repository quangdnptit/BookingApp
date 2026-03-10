<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="font-display font-bold text-2xl text-zinc-100">Dashboard</h1>
      <p class="text-cinema-muted mt-1">Overview of your movie booking CMS</p>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <Card v-for="i in 5" :key="i" class="animate-pulse h-32" />
    </div>
    <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <router-link
        v-for="item in statCards"
        :key="item.key"
        :to="item.to || '#'"
        :class="item.to ? 'block' : 'pointer-events-none'"
      >
        <Card
          :class="[
            'h-full bg-gradient-to-br border-cinema-border hover:border-cinema-gold/30 transition-colors',
            item.color,
          ]"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-cinema-muted text-sm">{{ item.label }}</p>
              <p class="text-2xl font-bold text-zinc-100 mt-1">{{ stats[item.key] }}</p>
            </div>
            <span class="text-3xl">{{ item.icon }}</span>
          </div>
        </Card>
      </router-link>
    </div>

    <Card class="mt-8">
      <h2 class="text-lg font-semibold text-zinc-100 mb-2">Quick actions</h2>
      <p class="text-cinema-muted text-sm mb-4">Manage your content from the sidebar or use the links above.</p>
      <div class="flex flex-wrap gap-3">
        <router-link
          to="/movies/new"
          class="px-4 py-2 rounded-lg bg-cinema-gold text-cinema-dark font-medium hover:bg-cinema-gold/90 transition-colors"
        >
          Add movie
        </router-link>
        <router-link
          to="/showtimes"
          class="px-4 py-2 rounded-lg border border-cinema-border text-zinc-300 hover:bg-cinema-border transition-colors"
        >
          Manage showtimes
        </router-link>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DashboardStats } from '../types'
import { api } from '../api/client'
import Card from '../components/ui/Card.vue'

const statCards = [
  { key: 'totalMovies' as const, label: 'Movies', icon: '🎬', to: '/movies', color: 'from-amber-500/20 to-amber-600/5' },
  { key: 'totalTheaters' as const, label: 'Theaters', icon: '🏛️', to: '/theaters', color: 'from-emerald-500/20 to-emerald-600/5' },
  { key: 'totalShowtimes' as const, label: 'Showtimes', icon: '🕐', to: '/showtimes', color: 'from-violet-500/20 to-violet-600/5' },
  { key: 'totalSeats' as const, label: 'Seats', icon: '💺', to: '/seats', color: 'from-sky-500/20 to-sky-600/5' },
  { key: 'totalBookings' as const, label: 'Bookings', icon: '🎟️', to: '', color: 'from-rose-500/20 to-rose-600/5' },
]

const stats = ref<DashboardStats | null>(null)
const loading = ref(true)

onMounted(async () => {
  stats.value = await api.getDashboardStats()
  loading.value = false
})
</script>
