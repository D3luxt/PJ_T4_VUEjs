<template>
    <div>
      <FirstContentComponent />
      <SecondContentComponent />
    </div>
  </template>
  
  <script>
  import FirstContentComponent from './FirstContentComponent.vue'
  import SecondContentComponent from './SecondContentComponent.vue'
  
  export default {
    name: 'mainpageCombine',
    components: {
      FirstContentComponent,
      SecondContentComponent
    }
  }
  </script>