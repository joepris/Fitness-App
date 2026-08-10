<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import { useUserStore } from '@/stores/user'

const notyf = new Notyf()
const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  userStore.unsetUser()
  notyf.success('Logged out successfully')
  router.replace({ name: 'Login' })
})
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card auth-card text-center">
          <div class="card-body p-5">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Logging out...</span>
            </div>
            <h1 class="h4 mb-2">Signing you out</h1>
            <p class="text-secondary mb-0">Clearing your session...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>