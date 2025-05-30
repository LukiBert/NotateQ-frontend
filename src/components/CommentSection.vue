<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NButton, NInput, NCard, NTime } from 'naive-ui'
import { fetchComments, postComment, type Comment } from '@/constants'

const props = defineProps<{
  fileId: number
}>()

const comments = ref<Comment[]>([])
const newComment = ref('')

async function handleAddComment() {
  if (!localStorage.getItem('access')) {
    alert('Musisz być zalogowany, aby dodać komentarz.')
    return
  }

  if (!newComment.value.trim()) {
    alert('Komentarz nie może być pusty.')
    return
  }

  try {
    await postComment(props.fileId, newComment.value)
    newComment.value = ''
    comments.value = await fetchComments(props.fileId)
  } catch (err) {
    alert('Błąd podczas dodawania komentarza')
    console.error('Błąd podczas dodawania komentarza:', err)
  }
}

onMounted(async () => {
  comments.value = await fetchComments(props.fileId)
})
</script>

<template>
  <div class="comments-wrapper">
    <div class="comments-form">
      <n-input
        v-model:value="newComment"
        type="textarea"
        placeholder="Napisz komentarz..."
        maxlength="100"
        show-count
      />
      <n-button type="primary" style="margin-top: 0.5rem" @click="handleAddComment">
        Dodaj komentarz
      </n-button>
    </div>

    <div v-if="comments.length === 0">Brak komentarzy. Bądź pierwszym!</div>

    <n-card
      v-for="comment in comments"
      :key="comment.id"
      class="comment"
      :title="comment.author_username"
      size="small"
      :segmented="{ content: true, footer: 'soft' }"
    >
      <template #header-extra>
        <n-time :time="new Date(comment.created_at)" format="yyyy-MM-dd" />
      </template>
      {{ comment.content }}
    </n-card>
  </div>
</template>

<style scoped>
.comments-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  max-width: 300px;
}

.comments-form {
  width: 100%;
  margin-bottom: 1.5rem;
}

.comment {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem;
  background-color: #fafafa;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #555;
}

.comment-body {
  font-size: 1rem;
  color: #333;
}

@media (min-width: 500px) {
  .comments-wrapper {
    max-width: 420px;
  }
}

@media (min-width: 768px) {
  .comments-wrapper {
    max-width: 700px;
  }
}
</style>
