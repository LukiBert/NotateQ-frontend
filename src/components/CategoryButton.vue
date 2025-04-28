<script setup lang="ts">
import { useRouter } from 'vue-router'
import { NFlex, NCard } from 'naive-ui'
import type { Category } from '../constants'

const { category } = defineProps<{
  category: Category
}>()

const router = useRouter()

function navToSearchPage() {
  router.push({ name: 'searchPage', query: { category: category.id } })
}
</script>

<template>
  <n-card
    hoverable
    class="category-card"
    content-style="padding: 1rem; text-align: center;"
    @click="navToSearchPage"
  >
    <n-flex vertical justify="center">
      {{ category.name }}
    </n-flex>
  </n-card>
</template>

<style scoped>
.category-card {
  width: auto;
  margin: 0.5rem;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.category-card:hover {
  transform: scale(1.02);
}
</style>
