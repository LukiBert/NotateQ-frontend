<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// query params
const status = route.query.status;
const fileId = route.query.file;

if (status === "success") {
  // użytkownik powinien już mieć premium (webhook!)
  router.push(`/file/${fileId}`);
} else {
  // niepowodzenie — wracamy też na stronę pliku
  router.push(`/file/${fileId}`);
}
</script>

<template>
  <div>Trwa przekierowywanie...</div>
</template>
