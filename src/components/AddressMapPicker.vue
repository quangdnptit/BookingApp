<template>
  <div class="address-map-picker">
    <div class="flex gap-2 mb-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search address (e.g. Hanoi Vietnam)"
        class="flex-1 px-3 py-2 rounded-lg bg-cinema-panel border border-cinema-border text-gray-800 text-sm placeholder:text-cinema-muted focus:outline-none focus:ring-2 focus:ring-cinema-gold/40"
        @keydown.enter.prevent="searchByText"
      />
      <button
        type="button"
        class="px-4 py-2 rounded-lg bg-cinema-gold text-white text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cinema-gold/40 disabled:opacity-60"
        :disabled="loading"
        @click="searchByText"
      >
        Search
      </button>
    </div>
    <div ref="mapEl" class="h-96 w-full rounded-lg border border-cinema-border bg-cinema-surface"></div>
    <p class="mt-2 text-xs text-cinema-muted">Search by text above or click on the map to pick an address. The address will be filled above.</p>
    <p v-if="loading" class="mt-1 text-xs text-cinema-gold">Resolving address...</p>
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapEl = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const loading = ref(false)
const error = ref('')

const emit = defineEmits<{ 'pick': [address: string] }>()

// Default map center: Hanoi, Vietnam
const HN_LOCATION = { lat: 21.0285, lng: 105.8542, zoom: 12 } as const

// Nominatim API (OpenStreetMap geocoding)
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'
const NOMINATIM_HEADERS: HeadersInit = {
  Accept: 'application/json',
  'User-Agent': 'CMS-Booking-FE/1.0',
}
const NOMINATIM_FORMAT = 'json'
const NOMINATIM_SEARCH_LIMIT = 1
const NOMINATIM_ZOOM_AFTER_SEARCH = 14

// Map tiles (OpenStreetMap)
const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

let map: L.Map | null = null
let marker: L.Marker | null = null

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: NOMINATIM_FORMAT,
  })
  const url = `${NOMINATIM_BASE_URL}/reverse?${params}`
  const res = await fetch(url, { headers: NOMINATIM_HEADERS })
  if (!res.ok) throw new Error('Address lookup failed')
  const data = await res.json()
  return data.display_name ?? `${lat}, ${lng}`
}

function createMarkerIcon() {
  return L.divIcon({
    className: 'address-picker-marker',
    html: '<div style="background:#c9a227;width:24px;height:24px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

function setMarkerAt(lat: number, lng: number) {
  if (!map) return
  const latlng = L.latLng(lat, lng)
  if (marker) marker.setLatLng(latlng)
  else marker = L.marker(latlng, { icon: createMarkerIcon() }).addTo(map)
  map.setView(latlng, map.getZoom())
}

async function searchByText() {
  const q = searchQuery.value.trim()
  if (!q) return
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams({
      q: q,
      format: NOMINATIM_FORMAT,
      limit: String(NOMINATIM_SEARCH_LIMIT),
    })
    const url = `${NOMINATIM_BASE_URL}/search?${params}`
    const res = await fetch(url, { headers: NOMINATIM_HEADERS })
    if (!res.ok) throw new Error('Search failed')
    const data = await res.json()
    if (!data || data.length === 0) {
      error.value = 'No results found. Try a different search or click on the map.'
      return
    }
    const first = data[0]
    const lat = parseFloat(first.lat)
    const lon = parseFloat(first.lon)
    const address = first.display_name ?? `${lat}, ${lon}`
    setMarkerAt(lat, lon)
    if (map) map.setView([lat, lon], NOMINATIM_ZOOM_AFTER_SEARCH)
    emit('pick', address)
  } catch {
    error.value = 'Search failed. Try again or click on the map.'
  } finally {
    loading.value = false
  }
}

function onMapClick(e: L.LeafletMouseEvent) {
  const { lat, lng } = e.latlng
  if (marker) marker.setLatLng(e.latlng)
  else if (map) marker = L.marker(e.latlng, { icon: createMarkerIcon() }).addTo(map)
  loading.value = true
  error.value = ''
  reverseGeocode(lat, lng)
    .then((address) => {
      emit('pick', address)
    })
    .catch(() => {
      error.value = 'Could not resolve address. You can type it manually.'
      emit('pick', `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  if (!mapEl.value) return
  map = L.map(mapEl.value).setView([HN_LOCATION.lat, HN_LOCATION.lng], HN_LOCATION.zoom)
  L.tileLayer(OSM_TILE_URL, { attribution: OSM_ATTRIBUTION }).addTo(map)
  map.on('click', onMapClick)
})

onBeforeUnmount(() => {
  if (map) {
    map.off('click', onMapClick)
    map.remove()
    map = null
  }
  marker = null
})
</script>
