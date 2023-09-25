<template>
  <div>
    <UserDetail />
  </div>
</template>
  
<script>

import UserDetail from './UserDetail.vue'

export default {
  name: 'combineuserPage',
  components: {
    UserDetail,
  }
}
</script>

<style scoped>
button {
  font: inherit;
  border: 1px solid #704900; 
  background-color: #704900; 
  color: white;
  cursor: pointer;
  padding: 0.75rem 2rem;
  border-radius: 15px; /* Reduced border radius */
}

button:hover,
button:active {
  border-color: #291700;
  background-color: #291700;
}
</style>