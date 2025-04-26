<script setup lang="ts">
import SearchBar from '../components/SearchBar.vue'
import CategoryHolder from '../components/CategoryHolder.vue'
import FileList from '../components/FileList.vue'
</script>

<template>
  <SearchBar mode="manual" />
  <CategoryHolder />
  <FileList :show-heading="true" />
</template>
