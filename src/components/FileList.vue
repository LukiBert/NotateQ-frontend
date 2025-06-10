<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { NEmpty, NPagination } from 'naive-ui'
import FileDescriptor from './FileDescriptor.vue'
import type { FileShort, SortOption } from '../constants'
import { getFilesList } from '@/constants/requests'
import { useRoute } from 'vue-router'

const route = useRoute()

const { filters, emptyMessage, sortOption } = defineProps<{
  filters?: Record<string, string | number | boolean>
  emptyMessage?: string
  sortOption?: SortOption | null
}>()

const totalCount = ref(0)
const nextPage = ref<string | null>(null)
const prevPage = ref<string | null>(null)
const fetchedFilesShort = ref<FileShort[]>([])

const noFiles = computed(() => fetchedFilesShort.value.length <= 0)

const page = ref(1)
const pageCount = computed(() => Math.ceil(totalCount.value / 5))

const isHomePage = ref(false)

watch(page, async (newPage) => {
  const res = await getFilesList(newPage, filters, isHomePage.value)
  totalCount.value = res.count
  nextPage.value = res.next
  prevPage.value = res.previous
  fetchedFilesShort.value = res.results
})

watch(
  () => filters,
  async (newFilters) => {
    page.value = 1
    const res = await getFilesList(1, newFilters, isHomePage.value)
    totalCount.value = res.count
    nextPage.value = res.next
    prevPage.value = res.previous
    fetchedFilesShort.value = res.results
  },
  { immediate: true, deep: true },
)

onMounted(() => {
  if (route.name === 'home') {
    isHomePage.value = true
  }
})
</script>

<template>
  <div class="file-list-wrapper">
    <div class="file-list">
      <n-pagination v-if="!isHomePage" v-model:page="page" :page-count="pageCount" />
      <n-empty v-if="noFiles" :description="emptyMessage || 'Brak plików do pobrania'" />
      <FileDescriptor v-for="(item, index) in fetchedFilesShort" :key="index" :file="item" />
      <n-pagination v-if="!noFiles && !isHomePage" v-model:page="page" :page-count="pageCount" />
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
