<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type Category, getAllCategories } from '../constants'

import CategoryButton from './CategoryButton.vue'
import { NGrid, NGi, NFlex, NScrollbar } from 'naive-ui'

const fetchedCategories = ref<Category[]>([])

onMounted(async () => {
  fetchedCategories.value = await getAllCategories()
})
</script>

<template>
  <div class="category-wrapper">
    <span class="heading">Kategorie główne</span>
    <n-scrollbar x-scrollable trigger="none" content-style="overflow: hidden;">
      <div class="category-container">
        <CategoryButton
          v-for="(category, index) in fetchedCategories"
          :key="index"
          :category="category"
        />
      </div>
      <div class="scroll-bar-gap"></div>
    </n-scrollbar>
  </div>
</template>

<style scoped>
.category-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  background-color: white;
}
.heading {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-left: 0.5rem;
}
.category-container {
  display: flex;
  flex-flow: wrap;
  justify-content: start;
  min-width: 600px;
}
.scroll-bar-gap {
  height: 15px;
}
@media (min-width: 1024px) {
  .category-container {
    justify-content: center;
  }
}
</style>
