<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="font-display font-bold text-2xl text-gray-800">Seats</h1>
      <p class="text-cinema-muted mt-1">Manage seats per screen</p>
    </div>

    <div v-if="loading" class="text-cinema-muted">Loading theaters...</div>
    <template v-else>
      <Card class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Screen</label>
        <select
          v-model="screenId"
          class="w-full max-w-md px-3 py-2 rounded-lg bg-cinema-panel border border-cinema-border text-gray-800 focus:outline-none focus:ring-2 focus:ring-cinema-gold/40 shadow-sm"
        >
          <option value="">Select a screen</option>
          <option v-for="{ screen, theater } in screens" :key="screen.id" :value="screen.id">
           {{ theater.name }} - {{ screen.name }} - {{ screen.capacity }} seats
          </option>
        </select>
      </Card>

      <template v-if="screenId">
        <Card class="mb-6">
          <CardHeader title="Seat layout" :subtitle="`${seats.length} seat(s)`" />
          <div v-if="seatsLoading" class="py-8 text-center text-cinema-muted">Loading seats...</div>
          <div v-else-if="seats.length === 0" class="py-8 text-center text-cinema-muted">
            No seats yet. Add seats above.
          </div>
          <div v-else class="overflow-x-auto">
            <div class="inline-block p-4 bg-cinema-surface rounded-lg border border-cinema-border">
              <div class="flex gap-0.5 mb-2">
                <span class="w-6 text-xs text-cinema-muted" />
                <span
                  v-for="i in maxCol"
                  :key="i"
                  class="w-7 text-center text-xs text-cinema-muted"
                >
                  {{ i }}
                </span>
              </div>
              <div v-for="row in rows" :key="row" class="flex gap-0.5 items-center mb-1">
                <span class="w-6 text-xs font-medium text-cinema-muted">{{ row }}</span>
                <div class="flex gap-0.5">
                  <template v-for="num in maxCol" :key="`${row}-${num}`">
                    <span
                      v-if="!seatMap.get(`${row}-${num}`)"
                      class="w-7 h-7 rounded bg-gray-200"
                    />
                    <span
                      v-else
                      :class="[
                        'w-7 h-7 rounded flex items-center justify-center text-xs font-medium',
                        SEAT_TYPE_STYLE[seatMap.get(`${row}-${num}`)!.type],
                        !seatMap.get(`${row}-${num}`)?.isActive ? 'opacity-40' : '',
                      ]"
                      :title="`${row}${num} — ${seatMap.get(`${row}-${num}`)?.type}`"
                    >
                      {{ seatMap.get(`${row}-${num}`)?.isActive ? num : '—' }}
                    </span>
                  </template>
                </div>
              </div>
            </div>
            <div class="flex gap-4 mt-4 text-xs text-cinema-muted">
              <span class="flex items-center gap-1"><span class="w-4 h-4 rounded bg-gray-400" /> Standard</span>
              <span class="flex items-center gap-1"><span class="w-4 h-4 rounded bg-cinema-gold" /> Premium</span>
              <span class="flex items-center gap-1"><span class="w-4 h-4 rounded bg-sky-500" /> Wheelchair</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="All seats (table)" subtitle="Edit seat type or remove seat" />
          <div v-if="seatsLoading" class="py-8 text-center text-cinema-muted">Loading...</div>
          <template v-else>
            <div class="overflow-x-auto rounded-lg border border-cinema-border">
              <table class="w-full text-sm text-left">
                <thead class="bg-cinema-surface text-cinema-muted uppercase text-xs">
                  <tr>
                    <th class="px-4 py-3 font-medium">Row</th>
                    <th class="px-4 py-3 font-medium">Number</th>
                    <th class="px-4 py-3 font-medium">Type</th>                  
                    <th class="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-cinema-border">
                  <tr
                    v-for="seat in seats"
                    :key="seat.id"
                    class="bg-cinema-panel hover:bg-cinema-surface/80 transition-colors"
                  >
                    <td class="px-4 py-3 font-medium">{{ seat.row }}</td>
                    <td class="px-4 py-3">{{ seat.seatNumber }}</td>
                    <td class="px-4 py-3">
                      <Select
                        v-if="editingId === seat.id"
                        :model-value="seat.type"
                        :options="SEAT_TYPE_OPTIONS"
                        class="w-32"
                        @update:model-value="(v: string) => handleUpdateSeat(seat.id, { type: v as Seat['type'] })"
                        @blur="editingId = null"
                      />
                      <span
                        v-else
                        :class="['inline-flex px-2 py-0.5 rounded text-xs', SEAT_TYPE_STYLE[seat.type]]"
                      >
                        {{ seat.type }}
                      </span>
                    </td>

                    <td class="px-4 py-3 text-right">
                      <template v-if="editingId === seat.id">
                        <button type="button" class="text-cinema-muted hover:text-gray-700 text-sm" @click="editingId = null">
                          Done
                        </button>
                      </template>
                      <template v-else>
                        <button type="button" class="text-cinema-gold hover:underline mr-3" @click="editingId = seat.id">
                          Edit
                        </button>
                        <button type="button" class="text-red-600 hover:underline" @click="handleDeleteSeat(seat.id)">
                          Delete
                        </button>
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </Card>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Seat, Theater } from '../types'
import { api } from '../api/client'
import Card from '../components/ui/Card.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import Select from '../components/ui/Select.vue'

const SEAT_TYPE_OPTIONS = [
  { value: 'STANDARD', label: 'Standard' },
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'WHEELCHAIR', label: 'Wheelchair' },
]

const SEAT_TYPE_STYLE: Record<Seat['type'], string> = {
  STANDARD: 'bg-gray-400 text-white',
  PREMIUM: 'bg-cinema-gold text-white',
  WHEELCHAIR: 'bg-sky-500 text-white',
}

const theaters = ref<Theater[]>([])
const screenId = ref('')
const seats = ref<Seat[]>([])
const loading = ref(true)
const seatsLoading = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({ row: 'A', seatNumber: 1, type: 'STANDARD' as Seat['type'], isActive: true })
const saving = ref(false)

const screens = computed(() =>
  theaters.value.flatMap((t) => t.screens.map((screen) => ({ screen, theater: t })))
)
const selectedScreen = computed(() => screens.value.find((s) => s.screen.id === screenId.value))
const rows = computed(() => [...new Set(seats.value.map((s) => s.row))].sort())
const maxCol = computed(() => Math.max(0, ...seats.value.map((s) => s.seatNumber)))
const seatMap = computed(() => new Map(seats.value.map((s) => [`${s.row}-${s.seatNumber}`, s])))

watch(theaters, (data) => {
  if (data.length && data[0].screens.length && !screenId.value) {
    screenId.value = data[0].screens[0].id
  }
}, { immediate: true })

watch(screenId, async (id) => {
  if (!id) {
    seats.value = []
    return
  }
  seatsLoading.value = true
  seats.value = await api.getSeatsByScreen(id)
  seatsLoading.value = false
}, { immediate: true })

async function loadTheaters() {
  theaters.value = await api.getTheaters()
  loading.value = false
}
loadTheaters()

async function handleAddSeat() {
  if (!screenId.value) return
  saving.value = true
  try {
    const created = await api.createSeat({
      screenId: screenId.value,
      row: form.row.trim().toUpperCase() || 'A',
      seatNumber: form.seatNumber,
      type: form.type,
      isActive: form.isActive,
    })
    seats.value = [...seats.value, created].sort((a, b) => a.row.localeCompare(b.row) || a.seatNumber - b.seatNumber)
    form.seatNumber++
  } finally {
    saving.value = false
  }
}

async function handleUpdateSeat(id: string, data: Partial<Seat>) {
  const updated = await api.updateSeat(id, data)
  if (updated) {
    seats.value = seats.value.map((s) => (s.id === id ? { ...s, ...updated } : s))
    editingId.value = null
  }
}

async function handleDeleteSeat(id: string) {
  if (!confirm('Remove this seat?')) return
  const ok = await api.deleteSeat(id)
  if (ok) seats.value = seats.value.filter((s) => s.id !== id)
}
</script>
