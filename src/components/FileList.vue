<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import FileDescriptor from './FileDescriptor.vue'
import { API_URL, type FileData } from '../constants'

const fetchedFiles = ref<FileData[]>([])
const fetchedFilesArray = computed<FileData[]>(() => {
  return fetchedFiles.value.sort((a, b) => b.id - a.id)
})

const fetchFiles = async () => {
  try {
    const res = await axios.get(`${API_URL}api/files/`)
    fetchedFiles.value = res.data
  } catch (err) {
    console.error('Error fetching files:', err)
  }
}

onMounted(async () => {
  fetchFiles()
})
</script>

<template>
  <div class="file-list-wrapper">
    <p class="file-list-heading">Proponowane dokumenty</p>
    <div class="file-list">
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
