<script setup lang="ts">
import CategoryButton from './CategoryButton.vue'
import { NGrid, NGi, NScrollbar } from 'naive-ui'
</script>

<template>
  <div class="category-wrapper">
    <span class="heading">Przeglądaj kategorie NotateQ</span>
    <n-scrollbar x-scrollable trigger="none" content-style="overflow: hidden;">
      <n-grid collapsed :x-gap="90" :y-gap="10" :collapsed-rows="3" :cols="10">
        <n-gi v-for="n in 20">
          <CategoryButton categoryName="Język Polski" />
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
