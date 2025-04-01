<script setup>
import CategoryButton from './CategoryButton.vue'
import { NGrid, NGi, NScrollbar } from 'naive-ui'
</script>

<template>
  <div class="wrapper">
    <p>Przeglądaj kategorie NotateQ</p>
    <n-scrollbar x-scrollable trigger="none">
      <n-grid collapsed :x-gap="80" :y-gap="10" :collapsed-rows="2" :cols="10">
        <n-gi v-for="n in 20">
          <CategoryButton categoryName="Polski" />
        </n-gi>
      </n-grid>
    </n-scrollbar>
  </div>
</template>

<style scoped>
.wrapper {
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  background-color: #f9f9f9;
}
p {
  margin-left: 0.5rem;
}
.n-grid {
  margin-bottom: 0.75rem;
}
</style>
