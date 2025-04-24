<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const category = route.query.category as string | undefined
</script>

<template>{{ category }}</template>
