<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import FileList from '../components/FileList.vue'
import FiltersForm from '../components/FiltersForm.vue'
import SearchBar from '../components/SearchBar.vue'

const route = useRoute()

const searchInput = ref((route.query.title as string) || '')
</script>

<template>
  <div class="search-wrapper">
    <SearchBar mode="manual" />
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
