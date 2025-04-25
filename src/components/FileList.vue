<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NEmpty } from 'naive-ui'
import FileDescriptor from './FileDescriptor.vue'
import { type FileData, getAllFilesData, getFilteredFilesData } from '../constants'

const route = useRoute()

const fetchedFiles = ref<FileData[]>([])

const noFiles = computed(() => fetchedFiles.value.length <= 0)

watch(
  () => route.query,
  async (newQuery) => {
    console.log(newQuery)
    fetchedFiles.value = await getFilteredFilesData(newQuery)
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="file-list-wrapper">
    <div class="file-list">
      <n-empty v-if="noFiles" description="Brak plików do pobrania"></n-empty>
      <FileDescriptor v-for="(item, index) in fetchedFiles" :key="index" :file="item" />
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
