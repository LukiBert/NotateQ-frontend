<script setup>
import CategoryButton from './CategoryButton.vue'
import { NGrid, NGi, NScrollbar } from 'naive-ui'
</script>

<template>
  <div class="wrapper">
    <p>Przeglądaj kategorie NotateQ</p>
    <n-scrollbar x-scrollable trigger="none">
      <n-grid collapsed :x-gap="60" :collapsed-rows="2" :cols="10">
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
}
</style>
