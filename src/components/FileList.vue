<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { NEmpty } from 'naive-ui'
import FileDescriptor from './FileDescriptor.vue'
import { type FileData, getAllFilesData } from '../constants'

const props = defineProps<{
  showHeading?: boolean
  filters?: Record<string, string | number | boolean>
  emptyMessage?: string
}>()


const fetchedFiles = ref<FileData[]>([])
const fetchedFilesArray = computed<FileData[]>(() => {
  return fetchedFiles.value.sort((a, b) => b.id - a.id)
})

// const filteredFiles = computed(() => {
//   const title = props.filters?.title?.toString().toLowerCase()
//
//   if (!title) return fetchedFilesArray.value
//
//   return fetchedFilesArray.value.filter(file =>
//     file.title.toLowerCase().includes(title)
//   )
// })


const noFiles = computed(() => fetchedFilesArray.value.length === 0)

// async function loadFiles() {
//   try {
//     fetchedFiles.value = await getAllFilesData(props.filters)
//   } catch (err) {
//     console.error('Failed to load files:', err)
//   }
// }
//
// onMounted(loadFiles)
// watch(() => props.filters, loadFiles, { deep: true })

watch(
  () => props.filters,
  async (newFilters) => {
    try {
      fetchedFiles.value = await getAllFilesData(newFilters)
    } catch (err) {
      console.error('Failed to reload files with filters')
    }
  },
  { immediate: true, deep: true }
)

</script>

<template>
  <div class="file-list-wrapper">
    <p v-if="showHeading" class="file-list-heading">Proponowane dokumenty</p>
    <div class="file-list">
      <n-empty v-if="noFiles" :description="props.emptyMessage || 'Brak plików do pobrania'" />
      <FileDescriptor v-for="(item, index) in fetchedFilesArray" :key="index" :file="item" />
    </div>
  </div>
</template>

<style scoped>
.file-list-wrapper {
  padding: 1rem;
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
