<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NEmpty } from 'naive-ui'
import FileDescriptor from './FileDescriptor.vue'
import { type FileData, getFilesData, type SortOption } from '../constants'

const { filters, emptyMessage, sortOption } = defineProps<{
  filters?: Record<string, string | number | boolean>
  emptyMessage?: string
  sortOption?: SortOption | null
}>()

const fetchedFiles = ref<FileData[]>([])

const noFiles = computed(() => fetchedFiles.value.length <= 0)

const sortedFiles = computed(() => {
  if (!fetchedFiles.value.length) return []

  if (!sortOption) {
    return fetchedFiles.value
  }

  return [...fetchedFiles.value].sort((a, b) => {
    switch (sortOption) {
      case 'downloads_asc':
        return a.downloads - b.downloads
      case 'downloads_desc':
        return b.downloads - a.downloads
      case 'rating_asc':
        return a.rating - b.rating
      case 'rating_desc':
        return b.rating - a.rating
      case 'date_asc':
        return new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime()
      case 'date_desc':
        return new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
      default:
        return 0
    }
  })
})

watch(
  () => filters,
  async (newFilters) => {
    fetchedFiles.value = await getFilesData(newFilters)
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="file-list-wrapper">
    <div class="file-list">
      <n-empty v-if="noFiles" :description="emptyMessage || 'Brak plików do pobrania'" />
      <FileDescriptor v-for="(item, index) in sortedFiles" :key="index" :file="item" />
    </div>
  </div>
</template>

<style scoped>
.file-list-wrapper {
  padding: 1rem;
  width: 100%;
}

.fill-list-heading {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

/* Desktop view */
@media (min-width: 1024px) {
  .file-list {
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
  }
}
</style>
