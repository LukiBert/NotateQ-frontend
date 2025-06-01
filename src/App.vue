<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NMessageProvider } from 'naive-ui'
</script>

<template>
  <n-message-provider>
    <main>
      <RouterView />
    </main>
  </n-message-provider>
</template>
