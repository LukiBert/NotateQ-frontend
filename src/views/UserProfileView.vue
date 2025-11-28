<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NText, NIcon, NFlex, useMessage, NPopover, NModal, NDialogProvider } from 'naive-ui'
import { MdTrash, MdLogOut } from '@vicons/ionicons4'
import { UserFollow } from '@vicons/carbon'
import API from '@/constants/api'
import { myId, isLoggedIn } from '@/constants/authState'
import SearchBar from '@/components/SearchBar.vue'
import FileList from '@/components/FileList.vue'
import NavBar from '@/components/NavBar.vue'

const props = defineProps<{ id?: string }>()

const followersCount = ref(0)
const followingCount = ref(0)

const showFollowersModal = ref(false)
const showFollowingModal = ref(false)

const followersList = ref<any[]>([])
const followingList = ref<any[]>([])



const message = useMessage()

const route = useRoute()
const router = useRouter()

const userId = ref<number | null>(null)
const userName = ref('')
const userAvatarUrl = ref('')
const documentsShared = ref(0)

myId.value = Number(localStorage.getItem('myId'))

const isFollowing = ref(false)
const followId = ref<number | null>(null)

const searchInput = ref('')

const isOwnProfile = computed(() => {
  return userId.value !== null && myId.value !== null && userId.value === myId.value
})

function receiveEmit(phrase: string) {
  searchInput.value = phrase

  console.log('Szukasz w profilu:', phrase)
}

function logout() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  isLoggedIn.value = false
  localStorage.removeItem('myId')
  myId.value = null
  router.push({ name: 'home' })
  message.success('Pomyślnie wylogowano')
}

async function fetchProfile() {
  try {
    let response
    if (props.id) {
      // publiczny profil innego użytkownika
      response = await API.get(`api/users/${props.id}/`)
      documentsShared.value = response.data.files?.length ?? 0
    } else {
      // profil zalogowanego użytkownika
      response = await API.get(`api/profile/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      })
      documentsShared.value = response.data.file_count
    }

    userName.value = response.data.username
    userId.value = response.data.id
    userAvatarUrl.value = `https://api.dicebear.com/7.x/thumbs/svg?seed=${response.data.username}`
  } catch (err) {
    router.push({ name: 'notFound' })
    console.error('Błąd podczas pobierania profilu:', err)
  }
}

async function checkFollowingStatus() {
  if (!isLoggedIn.value || isOwnProfile.value || !userId.value) return
  try {
    const response = await API.get(`api/follows/my-following/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    })
    const found = response.data.find((f: any) => f.followed === userId.value)
    isFollowing.value = !!found
    followId.value = found?.id ?? null
  } catch (err) {
    console.error('Błąd sprawdzania obserwacji:', err)
  }
}

async function toggleFollow() {
  if (!isLoggedIn.value || !userId.value) return

  try {
    if (isFollowing.value && followId.value !== null) {
      await API.delete(`api/follows/${followId.value}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      })
      isFollowing.value = false
      followId.value = null

      message.success(`Usunięto obserwację użytkownika: ${userName.value}`)
    } else {
      const res = await API.post(
        `api/follows/`,
        {
          followed: userId.value,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
        },
      )
      isFollowing.value = true
      followId.value = res.data.id

      message.success(`Obserwujesz użytkownika: ${userName.value}`)
    }
  } catch (err) {
    console.error('Błąd podczas (od)obserwowania:', err)
  }
}

async function loadFollowers() {
  if (!userId.value) return
  try {
    const res = await API.get(`/api/follows/user/${userId.value}/followers/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    })
    followersList.value = res.data
    followersCount.value = res.data.length
  } catch (e) {
    console.error("Błąd followers:", e)
  }
}

async function loadFollowing() {
  if (!userId.value) return
  try {
    const res = await API.get(`/api/follows/user/${userId.value}/following/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    })
    followingList.value = res.data
    followingCount.value = res.data.length
  } catch (e) {
    console.error("Błąd following:", e)
  }
}




async function loadProfileAndFollowStatus() {
  await fetchProfile()
  await checkFollowingStatus()
  await loadFollowers()
  await loadFollowing()

}


onMounted(loadProfileAndFollowStatus)
watch(() => route.params.id, () => {
  showFollowersModal.value = false
  showFollowingModal.value = false
  loadProfileAndFollowStatus()
})

</script>

<template>
  <NavBar />
  <!-- INFO O UŻYTKOWNIKU -->
  <div class="profile-wrapper">
    <div class="user-info-card">
      <img :src="userAvatarUrl" alt="Avatar" class="avatar" />
      <div class="user-details">
        <h2>{{ userName }}</h2>
        <p>
          Udostępnionych dokumentów: <n-text strong>{{ documentsShared }}</n-text>
        </p>
        <div class="follow-stats">
  <!-- OBSERWOWANYCH -->
          <n-popover trigger="hover">
            <template #trigger>
              <n-button
                tag="a"
                text
                @click="showFollowingModal = true"
                type="primary"
              >
                Obserwuje:&nbsp;<b>{{ followingCount }}</b>
              </n-button>
            </template>
            <span>Zobacz listę obserwowanych użytkowników</span>
          </n-popover>

          <!-- OBSERWUJĄCYCH -->
          <n-popover trigger="hover">
            <template #trigger>
              <n-button
                tag="a"
                text
                @click="showFollowersModal = true"
                type="primary"
              >
                Obserwujących:&nbsp;<b>{{ followersCount }}</b>
              </n-button>
            </template>
            <span>Zobacz listę obserwujących użytkowników</span>
          </n-popover>
        </div>


      </div>
      <n-button v-if="isOwnProfile" @click="logout" type="error" style="margin-left: auto">
        <template #icon>
          <n-icon size="24"><MdLogOut /></n-icon>
        </template>
        <p class="button-text">Wyloguj się</p>
      </n-button>
      <n-button
        v-else-if="isLoggedIn"
        @click="toggleFollow"
        type="primary"
        style="margin-left: auto"
      >
        <template #icon>
          <n-icon size="24">
            <MdTrash v-if="isFollowing" />
            <UserFollow v-else />
          </n-icon>
        </template>
        <p class="button-text">{{ isFollowing ? 'Przestań obserwować' : 'Obserwuj' }}</p>
      </n-button>
    </div>
  </div>

  <!-- SEARCHBAR + LISTA -->
  <SearchBar mode="dynamic" @search-phrase="receiveEmit" />
  <n-flex justify="center">
    <p v-if="searchInput">🔍 Szukasz: "{{ searchInput }}"</p>
  </n-flex>

  <!-- Gotowy komponent z listą -->
  <FileList
    v-if="userId !== null"
    :filters="{ author: userId, title: searchInput }"
    empty-message="Brak plików spełniających kryteria"
  />
  <n-modal v-model:show="showFollowersModal" preset="dialog" title="Obserwują:">
  <div v-if="followersList.length">
    <div
      v-for="item in followersList"
      :key="item.id"
      class="user-link"
    >
      <n-popover trigger="hover">
        <template #trigger>
          <n-button
            tag="a"
            text
            type="primary"
            class="user-link-button"
            @click="router.push({ name: 'public-profile', params: { id: item.follower } })"
          >
            {{ item.follower_username }}
          </n-button>
        </template>
        <span>Odwiedź profil użytkownika '{{ item.follower_username }}'</span>
      </n-popover>
    </div>
  </div>
  <div v-else>Brak obserwujących</div>
</n-modal>


<n-modal v-model:show="showFollowingModal" preset="dialog" title="Obserwuje:">
  <div v-if="followingList.length">
    <div
      v-for="item in followingList"
      :key="item.id"
      class="user-link"
    >
      <n-popover trigger="hover">
        <template #trigger>
          <n-button
            tag="a"
            text
            type="primary"
            class="user-link-button"
            @click="router.push({ name: 'public-profile', params: { id: item.followed } })"
          >
            {{ item.followed_username }}
          </n-button>
        </template>
        <span>Odwiedź profil użytkownika '{{ item.followed_username }}'</span>
      </n-popover>
    </div>
  </div>
  <div v-else>Nie obserwujesz nikogo</div>
</n-modal>


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
  align-items: flex-start;
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

.follow-stats {
  display: flex;
  flex-direction: row;
  margin-top: 0.75rem;
  gap: 2rem;
}

.user-link {
  padding: 6px 0;
  cursor: pointer;
}

.user-link:hover {
  color: #0077ff;
  text-decoration: underline;
}


</style>
