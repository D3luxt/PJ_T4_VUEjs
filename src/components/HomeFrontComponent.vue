<template>
  <section class="w-full h-screen bg-center bg-cover bg-white text-center align-middle">
    <div class="text-center flex justify-between pr-20 pl-20">
  <div class="text-4xl font-bold underline underline-offset-8 decoration-red-500">แบบบ้านยอดนิยม</div>
  <div class="flex items-center">
    <span class="mr-4" style="min-width: 120px;">กรองราคาบ้าน</span>
    <input v-model="priceFilter" type="number" placeholder="ป้อนราคาบ้านที่ต้องการ">
  </div>
</div>
    <div class="text-center grid grid-cols-3 gap-4 justify-center flex flex-col pr-20 pl-20 pt-10">
      <router-link v-for="item in filteredFilehomeData" :key="item.filehome_id"
        :to="{ name: 'homelist', params: { filehome_id: item.filehome_id }, query: { rowData: JSON.stringify(item) } }">
        <div class="rounded-lg  drop-shadow-2xl">
          <div class="relative w-[4005x]">
            <!-- Use the image URL directly as src -->
            <img :src="getImageUrl(JSON.parse(item.filehome_imgs)[0])" style="width: 600px; height: 300px;">
          </div>
          <div class=" left-0 right-0 px-4 py-2 bg-gray-800 opacity-70">
              <h3 class="text-xl text-white font-bold">
                {{ item.filehome_name }}</h3>
            </div>
        </div>
        
      </router-link>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    filehome_data: [],
    priceFilter: null, // Add the price filter data property

  }),

  created() {
    this.fetchfilehome_data();
  },

  methods: {
    fetchfilehome_data() {
      axios.get('http://localhost:3001/filehome')
        .then(response => {
          this.filehome_data = response.data;
          console.log(this.filehome_data); // Log the data to the console
        })
        .catch(error => {
          console.error(error);
        });
    },
    getImageUrl(filename) {
      // Assuming your Node.js server is running on localhost:3001
      return `http://localhost:3001/images/${filename}`;
    },
  },
  computed: {
    filteredFilehomeData() {
      if (!this.priceFilter) {
        return this.filehome_data; // If no filter is set, return the original data
      } else {
        // If there's a filter, filter the filehome_data based on the filehome_price
        const maxPrice = parseInt(this.priceFilter);
        return this.filehome_data.filter((item) => {
          return parseInt(item.filehome_price) <= maxPrice;
        });
      }
    },
  },
};
</script>