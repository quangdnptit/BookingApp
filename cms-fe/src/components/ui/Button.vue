<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :class="[
      'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cinema-dark disabled:opacity-50 disabled:cursor-not-allowed',
      variants[props.variant],
      $attrs.class,
    ]"
  >
    <template v-if="props.loading">
      <span class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      Loading...
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button', loading: false, disabled: false }
)

const variants: Record<Variant, string> = {
  primary: 'bg-cinema-gold text-cinema-dark hover:bg-cinema-gold/90 focus:ring-cinema-gold/50',
  secondary: 'bg-cinema-panel border border-cinema-border text-zinc-200 hover:bg-cinema-border',
  danger: 'bg-red-600/90 text-white hover:bg-red-600 focus:ring-red-500/50',
  ghost: 'text-zinc-400 hover:bg-cinema-border hover:text-zinc-200',
}
</script>
