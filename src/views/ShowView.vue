<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchBar from '../components/SearchBar.vue'
import FileList from '../components/FileList.vue'

const route = useRoute()
const router = useRouter()

const searchInput = ref(route.query.q as string || '')


function updateSearch(phrase: string) {
  searchInput.value = phrase
  router.replace({ path: '/show', query: { q: phrase } })
}


watch(() => route.query.q, (newVal) => {
  searchInput.value = newVal as string || ''
})
</script>

<template>
  <div class="show-view">
    <SearchBar mode="manual" @search-phrase="updateSearch" />
    <p v-if="searchInput">🔍 Szukasz: "{{ searchInput }}"</p>
    <FileList :show-heading="false" :filters="{ title: searchInput }" empty-message="Brak plików spełniających kryteria wyszukiwania" />
  </div>
</template>

<style scoped>
.show-view {
  padding: 2rem;
}
</style>
