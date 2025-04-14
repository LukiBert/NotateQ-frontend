<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NLoadingBarProvider } from 'naive-ui'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <n-loading-bar-provider>
    <header>
      <NavBar />
    </header>
    <main>
      <RouterView />
    </main>
  </n-loading-bar-provider>
</template>
