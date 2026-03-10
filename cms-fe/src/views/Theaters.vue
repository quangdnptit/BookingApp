<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="font-display font-bold text-2xl text-zinc-100">Theaters</h1>
      <p class="text-cinema-muted mt-1">View theater and screen information</p>
    </div>

    <Card>
      <CardHeader title="All theaters" :subtitle="`${theaters.length} theater(s)`" />
      <div v-if="loading" class="py-12 text-center text-cinema-muted">Loading...</div>
      <template v-else>
        <div class="overflow-x-auto rounded-lg border border-cinema-border">
          <table class="w-full text-sm text-left">
            <thead class="bg-cinema-panel text-cinema-muted uppercase text-xs">
              <tr>
                <th class="px-4 py-3 font-medium">Name</th>
                <th class="px-4 py-3 font-medium">Address</th>
                <th class="px-4 py-3 font-medium">Screens</th>
                <th class="px-4 py-3 font-medium">Total capacity</th>
                <th class="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cinema-border">
              <tr
                v-for="t in theaters"
                :key="t.id"
                class="bg-cinema-dark hover:bg-cinema-panel/80 transition-colors"
              >
                <td class="px-4 py-3 font-medium text-zinc-100">{{ t.name }}</td>
                <td class="px-4 py-3 text-cinema-muted">{{ t.address }}</td>
                <td class="px-4 py-3">{{ t.screenCount }}</td>
                <td class="px-4 py-3">{{ t.screens.reduce((sum, s) => sum + s.capacity, 0) }}</td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-flex px-2 py-0.5 rounded text-xs font-medium',
                      t.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-500/20 text-zinc-400',
                    ]"
                  >
                    {{ t.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Theater } from '../types'
import { api } from '../api/client'
import Card from '../components/ui/Card.vue'
import CardHeader from '../components/ui/CardHeader.vue'

const theaters = ref<Theater[]>([])
const loading = ref(true)

onMounted(async () => {
  theaters.value = await api.getTheaters()
  loading.value = false
})
</script>
