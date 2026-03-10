<template>
  <div :class="['bg-cinema-panel border border-cinema-border rounded-xl p-6', $attrs.class]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>
