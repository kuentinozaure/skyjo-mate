<template>
  <div class="container">
    <!-- Inject the pages -->
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin: 8px 16px;
}
</style>
