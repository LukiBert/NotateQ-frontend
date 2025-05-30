<script setup lang="ts">
import axios from 'axios'
import { NButton, NIcon, NText } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { API_URL } from '@/constants'
import { myId, isLoggedIn } from '@/constants/authState'
import { MdLogOut } from '@vicons/ionicons4'

const props = defineProps<{ id?: number }>()

const router = useRouter()
const route = useRoute()

const userName = ref('')
const userId = ref<number | null>(null)
const userAvatarUrl = ref('')
const documentsShared = ref(0)

myId.value = Number(localStorage.getItem('myId'))

const isOwnProfile = computed(() => {
  return userId.value !== null && myId.value !== null && userId.value === myId.value
})

function logout() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  isLoggedIn.value = false
  localStorage.removeItem('myId')
  myId.value = null
  router.push({ name: 'home' })
}

async function fetchProfile() {
  try {
    let response
    if (props.id) {
      // publiczny profil innego użytkownika
      response = await axios.get(`${API_URL}api/users/${props.id}/`)
      documentsShared.value = response.data.files?.length ?? 0
    } else {
      // profil zalogowanego użytkownika
      response = await axios.get(`${API_URL}api/profile/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      })
      documentsShared.value = response.data.file_count
    }

    userName.value = response.data.username
    userId.value = response.data.id
    userAvatarUrl.value = `https://api.dicebear.com/7.x/thumbs/svg?seed=${response.data.username}`
  } catch (err: any) {
    router.push({ name: 'notFound' })
    console.error('Błąd podczas pobierania profilu:', err)
  } finally {
    console.log(`After profile fetch: props.id=${props.id}`)
    console.log(`localStorageGet()=${localStorage.getItem('myId')}`)
  }
}

watch(() => route.params.id, fetchProfile, { immediate: true })
</script>

<template>
  <div class="profile-wrapper">
    <div class="user-info-card">
      <img :src="userAvatarUrl" alt="Avatar" class="avatar" />
      <div class="user-details">
        <h2>{{ userName }}</h2>
        <p>
          Udostępnionych dokumentów: <n-text strong>{{ documentsShared }}</n-text>
        </p>
      </div>
      <n-button
        v-if="isOwnProfile && isLoggedIn"
        @click="logout"
        type="error"
        style="margin-left: auto"
      >
        <template #icon>
          <n-icon size="24"><MdLogOut /></n-icon>
        </template>
        <p class="button-text">Wyloguj się</p>
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.profile-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  padding: 1rem;
}

.user-info-card {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
  min-height: 160px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 1.5rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-details h2 {
  margin: 0;
  font-size: 1.5rem;
}

.user-details p {
  margin: 0.25rem 0 0;
  color: #666;
}

.button-text {
  display: none;
}

@media (min-width: 768px) {
  .user-info-card {
    max-width: 700px;
  }

  .avatar {
    width: 120px;
    height: 120px;
  }

  .button-text {
    display: block;
  }

  .user-details h2 {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .user-info-card {
    max-width: 900px;
  }
}
</style>
