<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type Category, getAllCategories } from '../constants'

import CategoryButton from './CategoryButton.vue'
import { NGrid, NGi, NScrollbar } from 'naive-ui'

const fetchedCategories = ref<Category[]>([])

onMounted(async () => {
  try {
    fetchedCategories.value = await getAllCategories()
    //console.log('hello ' + fetchedCategories.value)
  } catch (err) {
    console.error('Failed to load categories')
  }
})
</script>

<template>
  <div class="category-wrapper">
    <span class="heading">Przeglądaj kategorie NotateQ</span>
    <n-scrollbar x-scrollable trigger="none" content-style="overflow: hidden;">
      <n-grid collapsed :x-gap="90" :y-gap="10" :cols="10">
        <n-gi v-for="(category, index) in fetchedCategories" :key="index">
          <CategoryButton :categoryName="category.name" />
        </n-gi>
      </n-grid>
    </n-scrollbar>
  </div>
</template>

<style scoped>
.category-wrapper {
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
.n-grid {
  margin-bottom: 0.75rem;
}
</style>
