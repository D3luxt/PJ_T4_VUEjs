<template>
  <section :style="sectionStyle" class="w-full h-screen bg-center bg-cover">
    <div class="text-center grid grid-cols-3 gap-4 justify-center flex flex-col pr-20 pl-20 ">
      <div class="col-start-2 pt-60 text-4xl font-bold text-white"> {{ company_data.length > 0 ?
        company_data[0].com_name_en : '' }}</div>
      <div class="col-start-2 bg-slate-100 rounded-lg bg-opacity-80">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>

    </div>
  </section>
</template>
  
<script>
import axios from 'axios';


export default {
  data() {
    return {
      backgroundImageURL: 'http://localhost:3001/images/main_bg.jpg', // Replace the URL with your actual image URL.
      company_data: [],

    };
  },
  computed: {
    sectionStyle() {
      return {
        backgroundImage: `url(${this.backgroundImageURL})`,
      };
    },
  },
  methods: {
    fetchcompany_data() {
      axios.get('http://localhost:3001/company')
        .then(response => {
          this.company_data = response.data;
          console.log(this.company_data);
        })
        .catch(error => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.fetchcompany_data()
  },
};
</script>