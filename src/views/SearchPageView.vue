<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'
import FileList from '../components/FileList.vue'
import FiltersForm from '../components/FiltersForm.vue'
import SearchBar from '../components/SearchBar.vue'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()

const searchInput = ref((route.query.title as string) || '')

function updateSearch(phrase: string) {
  searchInput.value = phrase
  router.replace({ name: 'searchPage', query: { ...route.query, title: phrase } })
}

watch(
  () => route.query.title,
  (newVal) => {
    searchInput.value = (newVal as string) || ''
  },
)

const filters = ref<Record<string, string | number | boolean>>({})

// Define valid filters and how each should be parsed
const filterParsers: Record<string, (value: string | string[]) => string | number | boolean> = {
  author: (val) => String(val),
  downloads_min: (val) => Number(val),
  downloads_max: (val) => Number(val),
  upload_date_before: (val) => String(val),
  upload_date_after: (val) => String(val),
  to_delete: (val) => val === 'true',
  category: (val) => (Array.isArray(val) ? val.join(',') : String(val)),
  date: (val) => String(val),
  rating_min: (val) => Number(val),
  rating_max: (val) => Number(val),
  books: (val) => (Array.isArray(val) ? val.join(',') : String(val)),
  tags: (val) => (Array.isArray(val) ? val.join(',') : String(val)),
}

watch(
  () => route.query,
  (query) => {
    const newFilters: Record<string, string | number | boolean> = {}

    for (const key in query) {
      if (!(key in filterParsers)) continue

      const value = query[key]
      if (value == null) continue

      try {
        const parsed = filterParsers[key](value)
        if (parsed !== '' && !(typeof parsed === 'number' && isNaN(parsed))) {
          newFilters[key] = parsed
        }
      } catch {
        // Skip invalid values silently
        continue
      }
    }

    filters.value = newFilters
  },
  { immediate: true },
)
</script>

<template>
  <header>
    <NavBar />
  </header>
  <div class="search-wrapper">
    <SearchBar mode="manual" @search-phrase="updateSearch" />
    <FiltersForm />
    <p v-if="searchInput">🔍 Wyniki wyszukiwania dla: "{{ searchInput }}"</p>
    <FileList :filters="filters" empty-message="Brak plików spełniających kryteria wyszukiwania" />
  </div>
</template>

<style scoped>
.search-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
