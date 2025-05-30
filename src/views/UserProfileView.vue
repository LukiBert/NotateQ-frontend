<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import FileList from '@/components/FileList.vue'
import NavBar from '@/components/NavBar.vue'
import UserProfile from '@/components/UserProfile.vue'

const props = defineProps<{ id?: string }>()

const searchInput = ref('')

const userId = computed<number>(() => {
  const storageId = Number(localStorage.getItem('myId'))
  const routeId = Number(props.id)

  console.log(`UPView says display id=${routeId ? routeId : storageId}`)
  return routeId ? routeId : storageId
})

function receiveEmit(phrase: string) {
  searchInput.value = phrase

  console.log('Szukasz w profilu:', phrase)
}
</script>

<template>
  <NavBar />
  <!-- INFO O UŻYTKOWNIKU -->
  <UserProfile :id="userId" />

  <!-- SEARCHBAR + LISTA -->
  <SearchBar mode="dynamic" @search-phrase="receiveEmit" />
  <p v-if="searchInput">🔍 Szukasz: "{{ searchInput }}"</p>

  <!-- Gotowy komponent z listą -->
  <FileList
    v-if="userId !== null"
    :filters="{ author: userId, title: searchInput }"
    empty-message="Brak plików spełniających kryteria"
  />
</template>
