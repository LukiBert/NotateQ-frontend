<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NEmpty } from 'naive-ui'
import FileDescriptor from './FileDescriptor.vue'
import { type FileData, getFilesData } from '../constants'

const { filters, emptyMessage } = defineProps<{
  filters?: Record<string, string | number | boolean>
  emptyMessage?: string
}>()

const route = useRoute()

const fetchedFiles = ref<FileData[]>([])

const noFiles = computed(() => fetchedFiles.value.length <= 0)

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
