<template>
  <input
    ref="inputRef"
    :value="modelValue"
    class="w-full px-3 py-2 rounded-lg bg-cinema-dark border border-cinema-border text-zinc-100 placeholder:text-cinema-muted focus:outline-none focus:ring-2 focus:ring-cinema-gold/50 focus:border-cinema-gold disabled:opacity-50 disabled:cursor-not-allowed"
    v-bind="$attrs"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ inheritAttrs: false })
defineProps<{ modelValue?: string | number }>()
defineEmits<{ 'update:modelValue': [value: string | number] }>()
const inputRef = ref<HTMLInputElement | null>(null)
defineExpose({ el: inputRef })
</script>
