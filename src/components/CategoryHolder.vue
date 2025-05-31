<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NScrollbar, NSkeleton } from 'naive-ui'
import { type Category } from '../constants'
import { getAllCategories } from '@/constants/requests'
import CategoryButton from './CategoryButton.vue'

const fetchedCategories = ref<Category[]>([])

const loading = ref(true)

onMounted(async () => {
  try {
    fetchedCategories.value = await getAllCategories()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="category-wrapper">
    <span class="heading">Kategorie główne</span>
    <n-scrollbar x-scrollable trigger="none" content-style="overflow: hidden;">
      <div class="category-container">
        <div v-if="loading" style="width: 80%">
          <n-skeleton text :repeat="2" />
          <n-skeleton text style="width: 60%" />
        </div>
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
