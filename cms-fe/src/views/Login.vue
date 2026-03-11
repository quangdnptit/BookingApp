<template>
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center bg-cinema-dark">
    <div class="w-8 h-8 border-2 border-cinema-gold border-t-transparent rounded-full animate-spin" />
  </div>
  <div v-else class="min-h-screen flex items-center justify-center bg-cinema-dark px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="font-display font-bold text-3xl text-cinema-gold">Movie CMS</h1>
        <p class="text-cinema-muted mt-1">Movie Booking — Sign in</p>
      </div>
      <form
        class="p-6 rounded-xl bg-cinema-panel border border-cinema-border shadow-xl space-y-4"
        @submit.prevent="handleSubmit"
      >
        <div
          v-if="error"
          class="px-3 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-sm"
          role="alert"
        >
          {{ error }}
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
          <Input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@reel.com"
            autocomplete="email"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
          <Input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>
        <Button type="submit" class="w-full" :loading="loading" :disabled="loading">Sign in</Button>
      </form>
      <p class="text-center text-cinema-muted text-xs mt-4">Demo: admin@reel.com / password</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const { user, isLoading, login } = useAuth()
const router = useRouter()
const route = useRoute()
const redirect = (route.query.redirect as string) || '/'

watch(
  [user, isLoading],
  ([u, loadingState]) => {
    if (!loadingState && u) router.replace(redirect)
  },
  { immediate: true }
)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    router.replace(redirect)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
