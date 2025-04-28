<script setup lang="ts">
import { useRoute } from 'vue-router'
import { NSelect } from 'naive-ui'
import { ref, onMounted, computed, watch } from 'vue'
import { type Category, getFilesData } from '../constants'

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
</script>

<template>
  <div class="options-wrapper">
    <n-select v-model:value="selectedCategories" multiple :options="categoriesWithLabels" />
    <n-select placeholder="Sortuj"></n-select>
  </div>
</template>

<style scoped>
.options-wrapper {
  width: 500px;
  display: flex;
}
</style>
