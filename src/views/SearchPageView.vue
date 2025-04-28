<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FileList from '../components/FileList.vue'
import FiltersForm from '../components/FiltersForm.vue'
import SearchBar from '../components/SearchBar.vue'

const route = useRoute()
const router = useRouter()

const searchInput = ref((route.query.title as string) || '')

function updateSearch(phrase: string) {
  searchInput.value = phrase
  router.replace({ name: 'searchPage', query: { title: phrase } })
}

watch(
  () => route.query.title,
  (newVal) => {
    searchInput.value = (newVal as string) || ''
  },
)
</script>

<template>
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
.options-wrapper {
  width: 500px;
  display: flex;
}
</style>
