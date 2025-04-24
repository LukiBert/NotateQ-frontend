<script setup lang="ts">
import { useRoute } from 'vue-router'
import { NFlex, NSelect } from 'naive-ui'
import { ref, onMounted, computed, nextTick } from 'vue'
import { type Category, getAllCategories } from '../constants'

const route = useRoute()

const fetchedCategories = ref<Category[]>([])
const selectedCategories = ref([])

const queryCategories = computed(() => {
  const raw = route.query.category
  if (Array.isArray(raw)) return raw
  if (typeof raw === 'string') return [raw]
  return []
})

const categoriesWithLabels = computed(() => {
  return fetchedCategories.value.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }))
})

onMounted(async () => {
  try {
    fetchedCategories.value = await getAllCategories()

    selectedCategories.value = queryCategories.value
  } catch (err) {
    console.error('Failed to load categories')
  }
})
</script>

<template>
  <n-flex vertical>
    <n-select v-model:value="selectedCategories" multiple :options="categoriesWithLabels" />
  </n-flex>
</template>
