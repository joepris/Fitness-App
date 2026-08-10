<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Notyf } from 'notyf'
import api from '../api'
import { useUserStore } from '@/stores/user'

const notyf = new Notyf()
const userStore = useUserStore()

const loading = ref(true)
const error = ref('')
const profile = reactive({
  id: null,
  email: null,
  isAdmin: false,
})

async function loadProfile() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/users/details')
    const details = response.user ?? response

    profile.id = details._id
    profile.email = details.email
    profile.isAdmin = Boolean(details.isAdmin)

    userStore.setUser({
      id: details._id,
      email: details.email,
      isAdmin: details.isAdmin,
    })
  } catch (err) {
    console.error(err)
    error.value = err.message || 'Could not load profile.'
    notyf.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-7">
        <div class="card page-card">
          <div class="card-body p-4 p-md-5">
            <div class="d-flex align-items-center gap-3 mb-4">
              <div
                class="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                style="width: 4rem; height: 4rem"
              >
                <i class="bi bi-person-fill fs-2"></i>
              </div>
              <div>
                <h1 class="h3 mb-1">Your Profile</h1>
                <p class="text-secondary mb-0">Account details from the Fitness API</p>
              </div>
            </div>

            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else-if="error" class="alert alert-danger mb-0" role="alert">
              {{ error }}
            </div>

            <div v-else class="list-group list-group-flush">
              <div class="list-group-item px-0 d-flex justify-content-between">
                <span class="text-secondary">Email</span>
                <span class="fw-semibold">{{ profile.email || '—' }}</span>
              </div>
              <div class="list-group-item px-0 d-flex justify-content-between">
                <span class="text-secondary">User ID</span>
                <span class="fw-semibold text-break ms-3">{{ profile.id || '—' }}</span>
              </div>
              <div class="list-group-item px-0 d-flex justify-content-between">
                <span class="text-secondary">Role</span>
                <span class="badge" :class="profile.isAdmin ? 'text-bg-warning' : 'text-bg-primary'">
                  {{ profile.isAdmin ? 'Admin' : 'Member' }}
                </span>
              </div>
            </div>

            <div class="mt-4 d-flex gap-2">
              <RouterLink class="btn btn-primary" :to="{ name: 'Workouts' }">
                <i class="bi bi-lightning-charge me-1"></i>Go to Workouts
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>