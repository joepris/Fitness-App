<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
    <div class="container">
      <RouterLink class="navbar-brand fw-semibold" to="/">
        <i class="bi bi-heart-pulse me-2"></i>FitTrack
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
          <template v-if="userStore.user.id">
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'Workouts' }">
                <i class="bi bi-lightning-charge me-1"></i>Workouts
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'Profile' }">
                <i class="bi bi-person-circle me-1"></i>Profile
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'Logout' }">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
              </RouterLink>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'Login' }">Login</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'Register' }">
                Register
              </RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>
