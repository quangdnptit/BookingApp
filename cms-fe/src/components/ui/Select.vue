<template>
  <select
    :value="modelValue"
    :class="[
      'w-full px-3 py-2 rounded-lg bg-cinema-panel border border-cinema-border text-gray-800 focus:outline-none focus:ring-2 focus:ring-cinema-gold/40 focus:border-cinema-gold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm',
      $attrs.class,
    ]"
    v-bind="$attrs"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option value="">Select...</option>
    <option v-for="opt in options" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{
  modelValue: string
  options: { value: string; label: string }[]
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
