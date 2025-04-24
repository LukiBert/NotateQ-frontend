<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NEmpty } from 'naive-ui'
import FileDescriptor from './FileDescriptor.vue'
import { type FileData, getAllFilesData } from '../constants'

const route = useRoute()

const fetchedFiles = ref<FileData[]>([])
const fetchedFilesArray = ref<FileData[]>([])

const noFiles = computed(() => fetchedFilesArray.value.length <= 0)

const applyFilters = () => {
  let result = [...fetchedFiles.value]

  const chosenCategory = (route.query.category as string) || ''

  if (chosenCategory) {
    console.log('Trying to filter')
    result = result.filter((file) => file.category == chosenCategory)
    console.log('Filtering complete')
  }

  fetchedFilesArray.value = result
}

watch(
  () => route.query,
  () => {
    applyFilters()
  },
)

onMounted(async () => {
  try {
    fetchedFiles.value = await getAllFilesData()
    applyFilters()
  } catch (err) {
    console.error('Failed to load files')
  }
})
</script>

<template>
  <div class="file-list-wrapper">
    <div class="file-list">
      <n-empty v-if="noFiles" description="Brak plików do pobrania"></n-empty>
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
