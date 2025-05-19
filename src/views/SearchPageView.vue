<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FileList from '../components/FileList.vue'
import FiltersForm from '../components/FiltersForm.vue'
import SearchBar from '../components/SearchBar.vue'
import NavBar from '../components/NavBar.vue'

const route = useRoute()
const router = useRouter()

const filters = ref({})

const searchInput = ref((route.query.title as string) || '')

function updateSearch(phrase: string) {
  searchInput.value = phrase
  router.replace({ name: 'searchPage', query: { ...route.query, title: phrase } })
}

watch(
  () => route.query,
  (newQuery) => {
    filters.value = newQuery
    searchInput.value = newQuery.title ? (newQuery.title as string) : ''
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
