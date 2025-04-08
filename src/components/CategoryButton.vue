<script setup>
import { LogoTux } from '@vicons/ionicons4'
import { NFlex, NCard, NIcon } from 'naive-ui'

defineProps(['categoryName'])
</script>

<template>
  <n-card hoverable class="category-card" content-style="padding: 1rem; text-align: center;">
    <n-flex vertical justify="center">
      <n-icon :size="40" :component="LogoTux" />
      <p>{{ categoryName }}</p>
    </n-flex>
  </n-card>
</template>

<style scoped>
.category-card {
  max-width: 120px;
  min-width: 80px;
  margin: 0.5rem;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.category-card:hover {
  transform: scale(1.02);
}

.category-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  word-wrap: break-word;
}
.n-icon {
  width: 100%;
}
</style>
