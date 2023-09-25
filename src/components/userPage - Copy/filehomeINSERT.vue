<template>
  <section class="w-full h-screen">
    <div class="text-center grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
      <div class="col-start-1 ">
        <div class="pt-20"><img :src="defaultImageURL" class="h-100 mr-100" alt="Varinthorn Logo" /></div>
      </div>
      <div class="col-start-2">
        <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">เพิ่มแบบบ้าน</div>
        <form @submit.prevent="uploadFile">
          <div class="form-control">
            <label for="ชื่อแบบบ้าน">ชื่อแบบบ้าน</label>
            <input v-model="filehome_name" id="filehome_name" name="filehome_name" type="text"
              placeholder="ชื่อแบบบ้าน" />
          </div>
          <div class="form-control">
            <label for="รายละเอียดแบบบ้าน">รายละเอียดแบบบ้าน</label>
            <textarea v-model="filehome_details" id="filehome_details" name="filehome_details" rows="10"
                cols="50" v-bind:required="true"></textarea>

          </div>
          <div class="form-control">
            <label for="ลิ้งค์แบบบ้าน 3มิติ">ลิ้งค์แบบบ้าน 3มิติ</label>
            <input v-model="filehome_3d_url" id="filehome_3d_url" name="filehome_3d_url" type="text"
              placeholder="ลิ้งค์แบบบ้าน 3มิติ" />
          </div>
          <div class="form-control">
            <label for="ราคาเริ่มต้น">ราคาเริ่มต้น</label>
            <input v-model="filehome_price" id="filehome_price" name="filehome_price" type="number"
              placeholder="ราคาเริ่มต้น" />
          </div>
          <div class="form-control">
            <label for="filehomeIMG">ภาพตัวอย่างบ้าน</label>
            <input id="filehomeIMG" name="filehomeIMG" type="file" ref="fileInput" accept=".png,.jpg,.jpeg"
              @change="onFileSelected" />
          </div>

          <div>
            <button type="submit" >เพิ่ม</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>



<script>
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['currentUser']),
  },

  data() {
    return {
      defaultImageURL: 'http://localhost:3001/images/varinthorncc.png',
      selectedFile: null,
      selectedOption: '', // Holds the selected option value
      options: [],
      filehome_3d_url: "",
      filehome_details: "",
      filehomeIMG: null,
      filehome_name: "", // Change the default value to null
    };
  },
  methods: {
    onFileSelected(event) {
      this.filehomeIMG = event.target.files[0]; // Update the selected file
      console.log('Selected File:', this.filehomeIMG); // Add this line to check the selectedFile value
    },

    async uploadFile() {
      try {
        console.log('Selected File:', this.filehomeIMG);

        if (!this.filehomeIMG) {
          console.error('No file selected.'); // Handle the case when no file is selected
          return;
        }
        
        const formData = new FormData();
        formData.append('filehomeIMG', this.filehomeIMG); // Use 'filehomeIMG' as the key to match the backend
        formData.append('filehome_details', this.filehome_details); // Add the filehome_details variable to the formData object
        formData.append('filehome_3d_url', this.filehome_3d_url);
        formData.append('planhome_id', this.selectedOption);
        formData.append('filehome_name', this.filehome_name);
        formData.append('filehome_price', this.filehome_price);

        const response = await axios.post('http://localhost:3001/fhInsert', formData);

        if (response.status === 201) {
          console.log('Filehome inserted successfully.');
          this.$router.push({ path: '/'})
        } else {
          console.error('Failed to insert filehome.');
          // Handle the error case if needed
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle the error case if needed
      }
    },

    fetchOptions() {
      axios
        .get('http://localhost:3001/planhome')
        .then(response => {
          console.log(response.data); // Log the API response data for debugging
          // Assuming your response contains an array of objects from the planhome table
          // Modify the response data to match the required format for the dropdown options
          this.options = response.data.map(item => ({
            value: item.planhome_id, // Assuming planhome_id is the primary key column
            label: item.planhome_pdf, // Use the appropriate column for the display label
          }));
        })
        .catch(error => {
          console.error(error);
        });
    },
  },
  mounted() {
    console.log("Component mounted!"); // Log for debugging
    // Fetch the options when the component is mounted
    this.fetchOptions();
  },
};
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