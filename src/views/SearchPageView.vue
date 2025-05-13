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
</script>

<template>
  <header>
    <NavBar />
  </header>
  <div class="search-wrapper">
    <SearchBar mode="manual" @search-phrase="updateSearch" />
    <FiltersForm />
    <p v-if="searchInput">🔍 Wyniki wyszukiwania dla: "{{ searchInput }}"</p>
    <FileList
      :filters="{ title: searchInput }"
      empty-message="Brak plików spełniających kryteria wyszukiwania"
    />
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
