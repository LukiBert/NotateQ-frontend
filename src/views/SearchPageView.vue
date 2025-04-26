<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FileList from '../components/FileList.vue'
import FiltersForm from '../components/FiltersForm.vue'
import SearchBar from '../components/SearchBar.vue'

const route = useRoute()
const router = useRouter()

const searchInput = ref((route.query.q as string) || '')

function dynamicSearchUpdate(phrase: string) {
  if (phrase) {
    searchInput.value = phrase
    router.replace({
      name: 'searchPage',
      query: {
        ...route.query,
        q: searchInput.value.trim(),
      },
    })
  }
}

function manualSearchUpdate(phrase: string) {
  if (phrase) {
    searchInput.value = phrase
    router.push({
      name: 'searchPage',
      query: {
        ...route.query,
        q: searchInput.value.trim(),
      },
    })
  }
}
</script>

<template>
  <div class="search-wrapper">
    <SearchBar
      mode="manual"
      @manual-search="manualSearchUpdate"
      @dynamic-search="dynamicSearchUpdate"
    />
    <FiltersForm />
    <p v-if="searchInput">🔍 Wyniki wyszukiwania dla: "{{ searchInput }}"</p>
    <FileList />
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
