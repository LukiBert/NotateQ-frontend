<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NEmpty } from 'naive-ui'
import FileDescriptor from './FileDescriptor.vue'
import { type FileData, getAllFilesData } from '../constants'

const fetchedFiles = ref<FileData[]>([])
const fetchedFilesArray = computed<FileData[]>(() => {
  return fetchedFiles.value.sort((a, b) => b.id - a.id)
})

const noFiles = computed<boolean>(() => {
  return fetchedFilesArray.value.length <= 0
})

onMounted(async () => {
  try {
    fetchedFiles.value = await getAllFilesData()
  } catch (err) {
    console.error('Failed to load categories')
  }
})
</script>

<template>
  <div class="file-list-wrapper">
    <p class="file-list-heading">Proponowane dokumenty</p>
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
