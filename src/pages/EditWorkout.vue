<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import api from '../api'

const notyf = new Notyf()
const route = useRoute()
const router = useRouter()

const name = ref('')
const duration = ref('')
const loading = ref(true)
const saving = ref(false)

function normalizeWorkouts(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.workouts)) return data.workouts
  return []
}

async function loadWorkout() {
  loading.value = true

  try {
    const response = await api.get('/workouts/getMyWorkouts')
    const workout = normalizeWorkouts(response).find((item) => item._id === route.params.id)

    if (!workout) {
      notyf.error('Workout not found.')
      router.replace({ name: 'Workouts' })
      return
    }

    name.value = workout.name || ''
    duration.value = workout.duration || ''
  } catch (error) {
    console.error(error)
    notyf.error(error.message || 'Could not load workout.')
    router.replace({ name: 'Workouts' })
  } finally {
    loading.value = false
  }
}
async function updateWorkout() {
  saving.value = true

  try {
    await api.patch(`/workouts/updateWorkout/${route.params.id}`, {
      name: name.value.trim(),
      duration: duration.value.trim(),
    })
    notyf.success('Workout updated successfully')
    router.push({ name: 'Workouts' })
  } catch (error) {
    console.error(error)
    notyf.error(error.message || 'Could not save workout.')
  } finally {
    saving.value = false
  }
}

onMounted(loadWorkout)
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-7 col-lg-5">
        <div class="card page-card">
          <div class="card-body p-4 p-md-5">
            <div class="mb-4">
              <h1 class="h3 mb-1">Update Workout</h1>
              <p class="text-secondary mb-0">Edit your workout details</p>
            </div>

            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <form v-else @submit.prevent="updateWorkout">
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
                  Save Changes
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