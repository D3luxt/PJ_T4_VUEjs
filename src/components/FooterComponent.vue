<template>
  <footer class="footer bg-neutral-500">
    <div class="text-center">
      <img class="inline" :src="defaultImageURL" style="width: 50px; height: 50px;" />
      {{ footertext }}
    </div>
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
  data() {
    return {
      defaultImageURL: 'http://localhost:3001/images/varinthorncc.png',
    };
  },
};
</script>

<style>
/* FOOTER */
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #333; /* You can change this to the desired background color */
  padding: 10px; /* Adjust the padding as needed */
  color: #fff; /* You can change this to the desired text color */
  font-size: 14px; /* Adjust the font size as needed */
}
</style>
