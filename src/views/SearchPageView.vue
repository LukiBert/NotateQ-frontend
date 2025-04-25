<script setup lang="ts">
import FileList from '../components/FileList.vue'
import FiltersForm from '../components/FiltersForm.vue'
import SearchBar from '../components/SearchBar.vue'
</script>

<template>
  <div class="search-wrapper">
    <SearchBar />
    <FiltersForm />
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
