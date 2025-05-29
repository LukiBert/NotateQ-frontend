<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NLoadingBarProvider } from 'naive-ui'
</script>

<template>
  <n-loading-bar-provider>
    <main>
      <RouterView />
    </main>
  </n-loading-bar-provider>
</template>
