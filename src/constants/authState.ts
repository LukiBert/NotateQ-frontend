import { ref } from 'vue'

export const isLoggedIn = ref(!!localStorage.getItem('access'))
export const myId = ref<number | null>(null)
