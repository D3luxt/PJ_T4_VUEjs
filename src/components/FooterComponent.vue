<template>
  <footer class="bg-neutral-500">
    <div class="text-center"><img class="inline" :src='imageurl' style="width: 50px;height: 50px;" />
      {{ footertext }}</div>
  </footer>
</template>

<script>
export default {
  props: {

    footertext: {
      type: String,
      required: true,
      default: '',
    },
    imageurl: {
      type: String,
      required: true,
      default: '',
    },
  },
}

</script>


