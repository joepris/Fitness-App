<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import api from '../api'

const notyf = new Notyf()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)

const isActive = computed(() => email.value !== '' && password.value.length >= 8)

async function register() {
  loading.value = true

  try {
    const response = await api.post('/users/register', {
      email: email.value,
      password: password.value,
    })

    notyf.success(response.message || 'Registered successfully')
    router.push({ name: 'Login' })
  } catch (error) {
    console.error(error)
    notyf.error(error.message || 'Registration failed. Try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container flex-grow-1 d-flex align-items-center">
    <div class="row justify-content-center w-100">
      <div class="col-md-7 col-lg-5">
        <div class="card auth-card">
          <div class="card-body p-4 p-md-5">
            <div class="text-center mb-4">
              <h1 class="h3 mb-1">Create account</h1>
              <p class="text-secondary mb-0">Start tracking your workouts today</p>
            </div>

            <form @submit.prevent="register">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="you@mail.com"
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
                  placeholder="At least 8 characters"
                  minlength="8"
                  required
                  autocomplete="new-password"
                />
                <div class="form-text">Use at least 8 characters.</div>
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
                Register
              </button>
            </form>

            <p class="text-center text-secondary mt-4 mb-0">
              Already registered?
              <RouterLink to="/login" class="link-primary fw-semibold">Login</RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>