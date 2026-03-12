<template>
  <div class="p-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="font-display font-bold text-2xl text-zinc-100">Theaters</h1>
        <p class="text-cinema-muted mt-1">Manage theaters and rooms</p>
      </div>
      <Button @click="showTheaterForm = true">Add theater</Button>
    </div>

    <!-- Add theater form -->
    <Card v-if="showTheaterForm && !editingTheaterId" class="mb-6">
      <CardHeader title="New theater" subtitle="Create a new theater" />
      <form class="space-y-4" @submit.prevent="handleCreateTheater">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input v-model="theaterForm.name" placeholder="Theater name" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Address / Location</label>
          <Input v-model="theaterForm.address" placeholder="Address or location" required />
          <p class="mt-1 text-xs text-cinema-muted">This address is shown to customers.</p>
          <details class="mt-2">
            <summary class="cursor-pointer text-sm text-cinema-gold hover:underline">Pick from map</summary>
            <div class="mt-2">
              <AddressMapPicker @pick="theaterForm.address = $event" />
            </div>
          </details>
        </div>
        <div class="flex gap-3">
          <Button type="submit" :loading="savingTheater">Create theater</Button>
          <Button type="button" variant="secondary" @click="showTheaterForm = false">Cancel</Button>
        </div>
      </form>
    </Card>

    <!-- Edit theater form -->
    <Card v-if="editingTheaterId" class="mb-6">
      <CardHeader title="Edit theater" subtitle="Update theater details" />
      <form class="space-y-4" @submit.prevent="handleSaveTheaterEdit">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input v-model="theaterEditForm.name" placeholder="Theater name" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Address / Location</label>
          <Input v-model="theaterEditForm.address" placeholder="Address or location" required />
          <p class="mt-1 text-xs text-cinema-muted">This address is shown to customers.</p>
          <details class="mt-2">
            <summary class="cursor-pointer text-sm text-cinema-gold hover:underline">Pick from map</summary>
            <div class="mt-2">
              <AddressMapPicker @pick="theaterEditForm.address = $event" />
            </div>
          </details>
        </div>
        <div class="flex gap-3">
          <Button type="submit" :loading="savingTheaterEdit">Save changes</Button>
          <Button type="button" variant="secondary" @click="editingTheaterId = null">Cancel</Button>
        </div>
      </form>
    </Card>

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
                <th class="px-4 py-3 font-medium">Rooms</th>
                <th class="px-4 py-3 font-medium">Total capacity</th>
                <th class="px-4 py-3 font-medium">Status</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cinema-border">
              <template v-for="t in theaters" :key="t.id">
                <tr class="bg-cinema-panel hover:bg-cinema-surface/80 transition-colors">
                  <td class="px-4 py-3 font-medium text-gray-800">{{ t.name }}</td>
                  <td class="px-4 py-3 text-cinema-muted">{{ t.address }}</td>
                  <td class="px-4 py-3">{{ t.screenCount }}</td>
                  <td class="px-4 py-3">{{ t.screens.reduce((sum, s) => sum + s.capacity, 0) }}</td>
                  <td class="px-4 py-3">
                    <span
                      :class="[
                        'inline-flex px-2 py-0.5 rounded text-xs font-medium',
                        t.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600',
                      ]"
                    >
                      {{ t.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
          
                    <button
                      type="button"
                      class="text-green-600 hover:underline mr-3"
                      @click="openAddRoom(t)"
                    >
                      Add room
                    </button>
                            <button
                      type="button"
                      class="text-cinema-gold hover:underline mr-3"
                      @click="openEditTheater(t)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="text-red-600 hover:underline"
                      @click="handleDeleteTheater(t.id, t.name)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                <!-- Rooms for this theater -->
                <tr v-if="t.screens.length" class="bg-cinema-surface/60">
                  <td colspan="6" class="px-4 py-2">
                    <div class="text-cinema-muted text-xs font-medium mb-1">Rooms</div>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="s in t.screens"
                        :key="s.id"
                        class="inline-flex items-center gap-1 px-2 py-1 rounded bg-cinema-surface text-gray-600 text-xs"
                      >
                        {{ s.name }} ({{ s.capacity }} seats)
                        <button
                          type="button"
                          class="text-red-400 hover:underline"
                          @click="handleDeleteRoom(s.id, s.name)"
                        >
                          ×
                        </button>
                      </span>
                    </div>
                  </td>
                </tr>
                <!-- Add room form for this theater -->
                <tr v-if="addingRoomFor?.id === t.id" class="bg-cinema-surface/60">
                  <td colspan="6" class="px-4 py-3">
                    <form class="flex flex-wrap items-end gap-4" @submit.prevent="handleCreateRoom">
                      <div class="w-48">
                        <label class="block text-xs text-cinema-muted mb-1">Room name</label>
                        <Input v-model="roomForm.name" placeholder="e.g. Screen 1" required />
                      </div>
                      <div class="w-28">
                        <label class="block text-xs text-cinema-muted mb-1">Seats</label>
                        <Input v-model.number="roomForm.totalRow" type="number" min="1" required />
                      </div>
                      <div class="w-28">
                        <label class="block text-xs text-cinema-muted mb-1">Seats</label>
                        <Input v-model.number="roomForm.seatsPerRow" type="number" min="1" required />
                      </div>
                      <Button type="submit" :loading="savingRoom">Add room</Button>
                      <Button type="button" variant="ghost" @click="addingRoomFor = null">Cancel</Button>
                    </form>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div v-if="theaters.length === 0" class="py-12 text-center text-cinema-muted">
          No theaters yet. Add one above.
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Theater } from '../types'
import { api } from '../api/client'
import Card from '../components/ui/Card.vue'
import CardHeader from '../components/ui/CardHeader.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import AddressMapPicker from '../components/AddressMapPicker.vue'

const theaters = ref<Theater[]>([])
const loading = ref(true)
const showTheaterForm = ref(false)
const savingTheater = ref(false)
const theaterForm = reactive({ name: '', address: '' })

const editingTheaterId = ref<string | null>(null)
const savingTheaterEdit = ref(false)
const theaterEditForm = reactive({ name: '', address: '' })

const addingRoomFor = ref<Theater | null>(null)
const savingRoom = ref(false)
const roomForm = reactive({ name: '', totalRow: 10, seatsPerRow: 20 })

async function loadTheaters() {
  theaters.value = await api.getTheaters()
}

onMounted(async () => {
  await loadTheaters()
  loading.value = false
})

async function handleCreateTheater() {
  savingTheater.value = true
  try {
    await api.createTheater({ name: theaterForm.name, address: theaterForm.address })
    theaterForm.name = ''
    theaterForm.address = ''
    showTheaterForm.value = false
    await loadTheaters()
  } finally {
    savingTheater.value = false
  }
}

function openEditTheater(theater: Theater) {
  editingTheaterId.value = theater.id
  theaterEditForm.name = theater.name
  theaterEditForm.address = theater.address
  addingRoomFor.value = null
}

async function handleSaveTheaterEdit() {
  if (!editingTheaterId.value) return
  savingTheaterEdit.value = true
  try {
    const updated = await api.updateTheater(editingTheaterId.value, {
      name: theaterEditForm.name,
      address: theaterEditForm.address,
    })
    if (updated) {
      editingTheaterId.value = null
      await loadTheaters()
    }
  } finally {
    savingTheaterEdit.value = false
  }
}

function openAddRoom(theater: Theater) {
  addingRoomFor.value = theater
  roomForm.name = ''
  roomForm.totalRow = 10
  roomForm.seatsPerRow = 20
  editingTheaterId.value = null
  addingRoomFor.value = theater
  roomForm.name = ''
  roomForm.totalRow = 10
  roomForm.seatsPerRow = 20
}

async function handleCreateRoom() {
  if (!addingRoomFor.value) return
  savingRoom.value = true
  try {
    await api.createRoom(addingRoomFor.value.id, {
      name: roomForm.name,
      totalRows: roomForm.totalRow,
      seatsPerRow: roomForm.seatsPerRow

    })
    addingRoomFor.value = null
    await loadTheaters()
  } finally {
    savingRoom.value = false
  }
}

async function handleDeleteTheater(id: string, name: string) {
  if (!confirm(`Delete theater "${name}"? This will remove all its rooms.`)) return
  const ok = await api.deleteTheater(id)
  if (ok) await loadTheaters()
}

async function handleDeleteRoom(id: string, name: string) {
  if (!confirm(`Delete room "${name}"?`)) return
  const ok = await api.deleteRoom(id)
  if (ok) await loadTheaters()
}
</script>
