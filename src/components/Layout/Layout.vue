<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <main class="flex-1 flex flex-col min-h-0 overflow-auto">
      <router-view class="flex-1 flex flex-col min-h-0" />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
</script>
