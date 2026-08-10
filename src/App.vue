<script setup>
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user'
import api from './api'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const userStore = useUserStore()

async function restoreSession() {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await api.get('/users/details')
    const details = response.user ?? response

    if (details?._id) {
      userStore.setUser({
        id: details._id,
        email: details.email,
        isAdmin: details.isAdmin,
      })
    } else {
      userStore.unsetUser()
    }
  } catch (error) {
    console.error('Token validation failed:', error)
    userStore.unsetUser()
  }
}

onMounted(() => {
  restoreSession()
})

watch(
  () => userStore.user,
  (newUser) => {
    console.log(newUser)
    console.log(localStorage)
  },
  { deep: true }
)
</script>

<template>
  <div class="app-shell min-vh-100 d-flex flex-column">
    <Navbar />
    <main class="flex-grow-1 py-4">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>