<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import api from '../api'

const notyf = new Notyf()
const router = useRouter()

const name = ref('')
const duration = ref('')
const saving = ref(false)

async function addWorkout() {
  saving.value = true

  try {
    await api.post('/workouts/addWorkout', {
      name: name.value.trim(),
      duration: duration.value.trim(),
    })
    notyf.success('Workout added successfully')
    router.push({ name: 'Workouts' })
  } catch (error) {
    console.error(error)
    notyf.error(error.message || 'Could not save workout.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-7 col-lg-5">
        <div class="card page-card">
          <div class="card-body p-4 p-md-5">
            <div class="mb-4">
              <h1 class="h3 mb-1">Add Workout</h1>
              <p class="text-secondary mb-0">Create a new workout to track</p>
            </div>

            <form @submit.prevent="addWorkout">
              <div class="mb-3">
                <label for="workoutName" class="form-label">Name</label>
                <input
                  id="workoutName"
                  v-model="name"
                  type="text"
                  class="form-control"
                  placeholder="Sample Workout"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="workoutDuration" class="form-label">Duration</label>
                <input
                  id="workoutDuration"
                  v-model="duration"
                  type="text"
                  class="form-control"
                  placeholder="30 mins"
                  required
                />
              </div>

              <div class="d-flex gap-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="saving || !name.trim() || !duration.trim()"
                >
                  <span
                    v-if="saving"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Add Workout
                </button>
                <RouterLink class="btn btn-outline-secondary" :to="{ name: 'Workouts' }">
                  Cancel
                </RouterLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>