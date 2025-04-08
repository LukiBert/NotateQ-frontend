<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import FileDescriptor from './FileDescriptor.vue'

const fetchedFiles = ref([])
const fetchedFilesArray = computed(() => {
  return fetchedFiles.value
})

const fetchFiles = async () => {
  try {
    const res = await axios.get('http://20.26.121.115:8000/api/files/')
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
  <div class="wrapper">
    <p class="heading">Proponowane dokumenty</p>
    <div class="file-list">
      <FileDescriptor
        v-for="(item, index) in fetchedFilesArray"
        :key="index"
        :file-title="item.title"
        :file-description="item.description"
        :file-author="item.author"
        :file-downloads="item.downloads"
        :fileId="item.id"
      />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 1rem;
}

.heading {
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
