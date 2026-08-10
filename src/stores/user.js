import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref({
    id: null,
    email: null,
    isAdmin: false,
  })

  function setUser(userData) {
    user.value.id = userData.id ?? null
    user.value.email = userData.email ?? null
    user.value.isAdmin = Boolean(userData.isAdmin)
  }

  function unsetUser() {
    user.value.id = null
    user.value.email = null
    user.value.isAdmin = false
    localStorage.clear()
  }

  return { user, setUser, unsetUser }
})