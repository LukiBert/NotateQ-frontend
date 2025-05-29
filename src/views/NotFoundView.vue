<script setup lang="ts">
import { NResult } from 'naive-ui'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <NavBar />
  <n-result status="404" title="404 Not Found" description="Życie mnie mnie."></n-result>
</template>

<style scoped>
.n-result {
  padding: 1rem;
}
</style>
