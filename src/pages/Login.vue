<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import api from '../api'
import { useUserStore } from '@/stores/user'

const notyf = new Notyf()
const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

const isActive = computed(() => email.value !== '' && password.value !== '')

async function authenticate() {
  loading.value = true

  try {
    const response = await api.post('/users/login', {
      email: email.value,
      password: password.value,
    })

    if (!response?.access) {
      notyf.error('Login failed. Try again.')
      return
    }

    localStorage.setItem('token', response.access)
    await retrieveUserDetails()
    notyf.success('Successful Login')
    router.push({ name: 'Workouts' })
  } catch (error) {
    console.error(error)
    const message = error.message || ''

    if (
      message.toLowerCase().includes('email and password do not match') ||
      message.toLowerCase().includes('incorrect email or password')
    ) {
      notyf.error('Incorrect Credentials. Try Again')
    } else if (
      message.toLowerCase().includes('no email found') ||
      message.toLowerCase().includes('user not found')
    ) {
      notyf.error('User Not Found. Try Again.')
    } else {
      notyf.error(message || 'Login failed. Try again.')
    }
  } finally {
    loading.value = false
    email.value = ''
    password.value = ''
  }
}

async function retrieveUserDetails() {
  const response = await api.get('/users/details')
  const details = response.user ?? response

  userStore.setUser({
    id: details._id,
    email: details.email,
    isAdmin: details.isAdmin,
  })
}
</script>

<template>
  <div class="container">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-7 col-lg-5">
        <div class="card auth-card">
          <div class="card-body p-4 p-md-5">
            <div class="text-center mb-4">
              <h1 class="h3 mb-1">Welcome!</h1>
              <p class="text-secondary mb-0">Sign in to manage your workouts</p>
            </div>

            <form @submit.prevent="authenticate">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="email@mail.com"
                  required
                  autocomplete="email"
                />
              </div>

              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="password"
                  required
                  autocomplete="current-password"
                />
              </div>

              <button
                type="submit"
                class="btn w-100"
                :class="isActive ? 'btn-primary' : 'btn-secondary'"
                :disabled="!isActive || loading"
              >
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Login
              </button>
            </form>

            <p class="text-center text-secondary mt-4 mb-0">
              No account yet?
              <RouterLink to="/register" class="link-primary fw-semibold">Register</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>