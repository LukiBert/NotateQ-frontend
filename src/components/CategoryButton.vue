<script setup>
import { LogoTux } from '@vicons/ionicons4'
import { NButton, NFlex, NIcon } from 'naive-ui'

defineProps(['categoryName'])
</script>

<template>
  <n-button text>
    <n-flex vertical>
      <n-icon :size="40" :component="LogoTux" />
      <p>{{ categoryName }}</p>
    </n-flex>
  </n-button>
</template>

<style scoped>
p {
  text-wrap: wrap;
}
.n-button {
  max-width: 60px;
  margin: 0.5rem;
}
.n-icon {
  width: 100%;
}
</style>
