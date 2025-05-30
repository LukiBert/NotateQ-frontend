<script setup lang="ts">
import axios from 'axios'
import { NButton, NIcon, NText } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { API_URL } from '@/constants'
import { myId, isLoggedIn } from '@/constants/authState'
import { MdLogOut } from '@vicons/ionicons4'
import { UserFollow } from '@vicons/carbon'

const props = defineProps<{ id?: number }>()

const router = useRouter()
const route = useRoute()

const isFollowing = ref(false)
const followId = ref<number | null>(null)

const userName = ref('')
const userId = ref<number | null>(null)
const userAvatarUrl = ref('')
const documentsShared = ref(0)

myId.value = Number(localStorage.getItem('myId'))

const isOwnProfile = computed(() => {
  return userId.value === myId.value
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
    console.log(`props.id=${props.id}`)
    if (props.id) {
      // publiczny profil innego użytkownika
      response = await axios.get(`${API_URL}api/users/${props.id}/`)
      console.log(`### Profile Fetch ${JSON.stringify(response.data)}`)
      documentsShared.value = response.data.files?.length ?? 0
    } else {
      // profil zalogowanego użytkownika
      response = await axios.get(`${API_URL}api/profile/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      })
      console.log(`### Profile Fetch`, response)

      documentsShared.value = response.data.file_count
      console.log(`### documentsShared=${JSON.stringify(response.data.file_count)}`)
    }

    userName.value = response.data.username
    userId.value = response.data.id
    userAvatarUrl.value = `https://api.dicebear.com/7.x/thumbs/svg?seed=${response.data.username}`

    console.log(`userId=${userId.value}`)
  } catch (err: any) {
    router.push({ name: 'notFound' })
    console.error('Błąd podczas pobierania profilu:', err)
  }
}

async function checkFollowingStatus() {
  console.log(`Checking following status....`)
  if (!isLoggedIn.value || isOwnProfile.value || !userId.value) {
    console.log(`XXX ${userId.value} ${!isLoggedIn.value || isOwnProfile.value || !userId.value}`)
    return
  }

  try {
    console.log(`Before my-following...`)
    const response = await axios.get(`${API_URL}api/follows/my-following/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    })
    const found = response.data.find((f: any) => f.followed === userId.value)
    isFollowing.value = !!found
    followId.value = found?.id ?? null
    console.log(`After my-following`)
  } catch (err) {
    console.error('Błąd sprawdzania obserwacji:', err)
  } finally {
    console.log(`Checked following status = ${isFollowing.value}`)
  }
}

async function toggleFollow() {
  if (!isLoggedIn.value || !userId.value) return

  console.log(`BEFORE isFollowing=${isFollowing.value}, followId=${followId.value}`)
  try {
    if (isFollowing.value && followId.value !== null) {
      await axios.delete(`${API_URL}api/follows/${followId.value}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      })
      isFollowing.value = false
      followId.value = null
    } else {
      const res = await axios.post(
        `${API_URL}api/follows/`,
        {
          followed: userId.value,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
        },
      )
      isFollowing.value = true
      followId.value = res.data.id
    }
  } catch (err) {
    console.error('Błąd podczas (od)obserwowania:', err)
  } finally {
    console.log(`AFTER isFollowing=${isFollowing.value}, followId=${followId.value}`)
  }
}

watch(
  () => route.params.id,
  async () => {
    await fetchProfile()
    await checkFollowingStatus()
  },
  { immediate: true },
)
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
      <template v-if="isOwnProfile">
        <n-button @click="logout" type="error" style="margin-left: auto">
          <template #icon>
            <n-icon size="24"><MdLogOut /></n-icon>
          </template>
          <p class="button-text">Wyloguj się</p>
        </n-button>
      </template>
      <template v-else-if="isLoggedIn">
        <n-button @click="toggleFollow" type="primary" style="margin-left: auto">
          <template #icon>
            <n-icon size="24"><UserFollow /></n-icon>
          </template>
          <p class="button-text">{{ isFollowing ? 'Przestań obserwować' : 'Obserwuj' }}</p>
        </n-button>
      </template>
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
