<script setup lang="ts">
import axios from 'axios'
import { NButton } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { API_URL } from '@/constants'
import { myId, isLoggedIn } from '@/constants/authState'
import SearchBar from '@/components/SearchBar.vue'
import FileList from '@/components/FileList.vue'
import NavBar from '@/components/NavBar.vue'

const props = defineProps<{ id?: string }>()

const router = useRouter()
const route = useRoute()

const userName = ref('')
const userId = ref<number | null>(null)
const userAvatarUrl = ref('')
const documentsShared = ref(0)

const searchInput = ref('')

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

function receiveEmit(phrase: string) {
  searchInput.value = phrase

  console.log('Szukasz w profilu:', phrase)
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
  }
}

watch(() => route.params.id, fetchProfile, { immediate: true })
</script>

<template>
  <NavBar />
  <div class="profile-wrapper">
    <!-- INFO O UŻYTKOWNIKU -->
    <div class="user-info-card">
      <img :src="userAvatarUrl" alt="Avatar" class="avatar" />
      <div class="user-details">
        <h2>{{ userName }}</h2>
        <p>{{ documentsShared }} udostępnionych dokumentów</p>
      </div>
      <n-button
        v-if="isOwnProfile && isLoggedIn"
        @click="logout"
        type="error"
        style="margin-left: auto"
      >
        Wyloguj się
      </n-button>
    </div>

    <!-- SEARCHBAR + LISTA -->
    <div class="search-card">
      <SearchBar mode="dynamic" @search-phrase="receiveEmit" />
      <p v-if="searchInput">🔍 Szukasz: "{{ searchInput }}"</p>

      <!-- Gotowy komponent z listą -->
      <FileList
        v-if="userId !== null"
        :filters="{ author: userId, title: searchInput }"
        empty-message="Brak plików spełniających kryteria"
      />
    </div>
  </div>
</template>

<style scoped>
.profile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem 1rem;
  gap: 1.5rem;
  margin-left: 25rem;
}

/* Górny prostokąt */
.user-info-card {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 1300px;
  min-height: 160px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-right: 1.5rem;
}

.user-details {
  align-self: flex-start;
}

.user-details h2 {
  margin: 0;
  font-size: 2rem;
}

.user-details p {
  margin: 0.25rem 0 0;
  color: #666;
}

/* Dolny prostokąt z SearchBarem */
.search-card {
  width: 100%;
  max-width: 1300px;
  background-color: #fafafa;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
