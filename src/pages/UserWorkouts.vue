

<script setup>
import { onMounted, ref } from 'vue'
import { Notyf } from 'notyf'
import api from '../api'

const notyf = new Notyf()

const workouts = ref([])
const loading = ref(true)
const actionId = ref(null)

function normalizeWorkouts(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.workouts)) return data.workouts
  return []
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

async function fetchWorkouts() {
  loading.value = true

  try {
    const response = await api.get('/workouts/getMyWorkouts')
    workouts.value = normalizeWorkouts(response)
  } catch (error) {
    console.error(error)
    notyf.error(error.message || 'Could not load workouts.')
  } finally {
    loading.value = false
  }
}

async function completeWorkout(id) {
  actionId.value = id

  try {
    await api.patch(`/workouts/completeWorkoutStatus/${id}`)
    notyf.success('Workout marked as completed')
    await fetchWorkouts()
  } catch (error) {
    console.error(error)
    notyf.error(error.message || 'Could not complete workout.')
  } finally {
    actionId.value = null
  }
}

async function deleteWorkout(id) {
  const confirmed = window.confirm('Delete this workout? This cannot be undone.')
  if (!confirmed) return

  actionId.value = id

  try {
    await api.delete(`/workouts/deleteWorkout/${id}`)
    notyf.success('Workout deleted successfully')
    await fetchWorkouts()
  } catch (error) {
    console.error(error)
    notyf.error(error.message || 'Could not delete workout.')
  } finally {
    actionId.value = null
  }
}

onMounted(fetchWorkouts)
</script>

<template>
  <div class="container">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <h1 class="h3 mb-1">My Workouts</h1>
        <p class="text-secondary mb-0">Add, update, complete, or delete your workouts</p>
      </div>
      <RouterLink class="btn btn-primary" :to="{ name: 'AddWorkout' }">
        <i class="bi bi-plus-lg me-1"></i>Add Workout
      </RouterLink>
    </div>

    <div class="card page-card">
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="workouts.length === 0" class="text-center py-5 px-3">
          <i class="bi bi-clipboard2-pulse display-5 text-primary d-block mb-3"></i>
          <h2 class="h5 mb-2">No workouts yet</h2>
          <p class="text-secondary mb-3">Create your first workout to get started.</p>
          <RouterLink class="btn btn-outline-primary" :to="{ name: 'AddWorkout' }">
            Add Workout
          </RouterLink>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Duration</th>
                <th scope="col">Status</th>
                <th scope="col">Date Added</th>
                <th scope="col" class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="workout in workouts" :key="workout._id">
                <td class="fw-semibold">{{ workout.name }}</td>
                <td>{{ workout.duration }}</td>
                <td>
                  <span
                    class="badge workout-status-badge"
                    :class="workout.status === 'completed' ? 'text-bg-primary' : 'text-bg-warning'"
                  >
                    {{ workout.status || 'pending' }}
                  </span>
                </td>
                <td>{{ formatDate(workout.dateAdded) }}</td>
                <td class="text-end">
                  <div class="btn-group btn-group-sm" role="group" aria-label="Workout actions">
                    <button
                      v-if="workout.status !== 'completed'"
                      class="btn btn-outline-primary"
                      type="button"
                      title="Mark complete"
                      :disabled="actionId === workout._id"
                      @click="completeWorkout(workout._id)"
                    >
                      <i class="bi bi-check2-circle"></i>
                    </button>
                    <RouterLink
                      class="btn btn-outline-primary"
                      title="Edit"
                      :to="{ name: 'EditWorkout', params: { id: workout._id } }"
                    >
                      <i class="bi bi-pencil"></i>
                    </RouterLink>
                    <button
                      class="btn btn-outline-danger"
                      type="button"
                      title="Delete"
                      :disabled="actionId === workout._id"
                      @click="deleteWorkout(workout._id)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>