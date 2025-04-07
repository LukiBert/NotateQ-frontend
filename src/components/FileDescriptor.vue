<script setup lang="ts">
import { MdFolderOpen } from '@vicons/ionicons4'
import { NIcon, NCard } from 'naive-ui'

function clickMsg() {
  console.log('Clicked')
}
</script>

<template>
  <div class="wrapper">
    <n-card hoverable class="responsive-card" @click="clickMsg">
      <div class="custom-card">
        <n-icon size="32" :component="MdFolderOpen" class="icon" />

        <div class="card-content">
          <h3 class="title">Home</h3>
          <h5 class="description">
            This is a card with an icon on the left.
            <span class="size-info">4.5MB</span>
          </h5>
          <h5 class="pages">4 stron</h5>
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
  margin: 0 auto;
  transition: max-width 0.3s ease;
}

.responsive-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}
.responsive-card:hover {
  transform: scale(1.02);
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

.description {
  margin: 4px 0;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.size-info {
  font-size: 13px;
  color: #888;
}

.pages {
  font-size: 13px;
  margin: 0;
}

/* Tablet */
@media (min-width: 768px) {
  .wrapper {
    max-width: 700px;
  }

  .title {
    font-size: 18px;
  }

  .description {
    font-size: 15px;
  }

  .size-info,
  .pages {
    font-size: 14px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .wrapper {
    max-width: 900px;
  }

  .icon {
    font-size: 36px;
  }

  .title {
    font-size: 20px;
  }

  .description {
    font-size: 16px;
  }

  .size-info,
  .pages {
    font-size: 15px;
  }
}
</style>
