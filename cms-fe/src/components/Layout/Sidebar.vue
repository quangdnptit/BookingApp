<template>
  <aside class="w-56 min-h-screen bg-cinema-panel border-r border-cinema-border flex flex-col shadow-sm">
    <div class="p-6 border-b border-cinema-border">
      <h1 class="font-display font-bold text-xl text-cinema-gold">Movie CMS</h1>
      <p class="text-cinema-muted text-sm mt-0.5">Movie Booking</p>
    </div>
    <nav class="flex-1 p-3 space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :end="item.to === '/'"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-cinema-surface hover:text-gray-900"
        active-class="!bg-cinema-gold/15 !text-cinema-gold"
      >
        <span class="text-lg">{{ item.icon }}</span>
        {{ item.label }}
      </router-link>
    </nav>
    <div class="p-3 border-t border-cinema-border space-y-2">
      <p v-if="user" class="px-3 py-1.5 text-cinema-muted text-sm truncate" :title="user.email">
        {{ user.name }}
      </p>
      <Button variant="ghost" class="w-full justify-start" @click="handleLogout">Sign out</Button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import Button from '../ui/Button.vue'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/movies', label: 'Movies', icon: '🎬' },
  { to: '/showtimes', label: 'Showtimes', icon: '🕐' },
  { to: '/theaters', label: 'Theaters', icon: '🏛️' },
  { to: '/seats', label: 'Seats', icon: '💺' },
]

const { user, logout } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.replace('/login')
}
</script>
