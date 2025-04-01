<script setup lang="ts">
import { MdFolderOpen, MdDownload } from '@vicons/ionicons4'
import {
  NLayout,
  NLayoutContent,
  NLayoutFooter,
  NLayoutHeader,
  NLayoutSider,
  NFlex,
  NIcon,
  NCard,
  NGrid,
  NGi,
  NButton,
} from 'naive-ui'

function clickMsg() {
  console.log('Clicked')
}
</script>

<template>
  <div class="wrapper">
    <n-card hoverable>
      <div class="custom-card">
        <n-icon size="32" :component="MdFolderOpen" />

        <div class="card-content">
          <h3 class="title">Home</h3>
          <h5 class="description">
            This is a card with an icon on the left.
            <span style="float: right">4.5MB</span>
          </h5>
          <h5>4 stron</h5>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 0.5rem;
  width: 100%;
  max-width: 500px;
}
.custom-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-content {
  flex: 1;
}
.title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}
</style>
