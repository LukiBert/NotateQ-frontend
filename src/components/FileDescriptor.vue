<script setup lang="ts">
import { MdFolderOpen } from '@vicons/ionicons4'
import { NIcon, NCard } from 'naive-ui'
import { useRouter } from 'vue-router'
import { joinCategoryNames, type FileData } from '@/constants'
import { computed } from 'vue'

const { file } = defineProps<{
  file: FileData
}>()

const router = useRouter()

function navToFilePage() {
  router.push({ name: 'filePage', params: { id: file.id } })
}

const categoryNames = computed(() => {
  return joinCategoryNames(file.categories)
})
</script>

<template>
  <div class="file-wrapper">
    <n-card hoverable class="responsive-card" @click="navToFilePage">
      <div class="custom-card">
        <n-icon size="32" :component="MdFolderOpen" class="icon" />

        <div class="card-content">
          <h3 class="card-title">{{ file.title }}</h3>

          <div class="card-description">
            <span class="left-info">{{ categoryNames }}</span>
            <div class="right-info">
              <span class="rating-info">
                Średnia: {{ file.rating.toFixed(1) }} ({{ file.rating_count }} ocen)
              </span>
              <span class="size-info">{{ file.downloads }} pobrań</span>
            </div>
          </div>

          <h5 class="card-author">{{ file.author }}</h5>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.file-wrapper {
  padding: 0.5rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
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

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.card-description {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin: 4px 0;
  font-size: 14px;
}

.left-info {
  flex: 1;
}

.right-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.size-info {
  font-size: 13px;
  color: #888;
}

.rating-info {
  font-size: 13px;
  color: #666;
}

.card-author {
  font-size: 13px;
  margin: 0;
}

/* Tablet */
@media (min-width: 768px) {
  .file-wrapper {
    max-width: 700px;
  }

  .card-title {
    font-size: 18px;
  }

  .card-description {
    font-size: 15px;
  }

  .size-info,
  .card-author {
    font-size: 14px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .file-wrapper {
    max-width: 900px;
  }

  .icon {
    font-size: 36px;
  }

  .card-title {
    font-size: 20px;
  }

  .card-description {
    font-size: 16px;
  }

  .size-info,
  .card-author {
    font-size: 15px;
  }
}
</style>
