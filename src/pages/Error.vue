<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card page-card text-center">
          <div class="card-body p-5">
            <div class="display-3 text-primary mb-3">404</div>
            <h1 class="h3 mb-2">Page not found</h1>
            <p class="text-secondary mb-4">
              The page you are looking for does not exist or may have moved.
            </p>
            <RouterLink class="btn btn-primary" :to="{ name: 'Workouts' }">
              Back to Workouts
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
