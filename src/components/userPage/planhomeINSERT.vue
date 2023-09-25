<template>
  <section class="w-full h-screen">
    <div class="text-center grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
      <div class="col-start-1">
        <div class="pt-20"><img :src="defaultImageURL" class="h-100 mr-100" alt="Varinthorn Logo" /></div>
      </div>
      <div class="col-start-2">
        <form @submit.prevent="">
          <div class="form-control">
            <label for="pdfFile">ไฟล์แบบบ้าน (PDF)</label>
            <input id="pdfFile" name="pdfFile" type="file" ref="fileInput" accept=".pdf" @change="onFileSelected" />
          </div>

          <div class="form-control">
            <label for="planhome_Id">อิงแบบบ้านอ้างอิง</label>
            <select v-model="selectedOption" id="planhomeIdfk" name="planhomeIdfk">
              <option v-for="option in options" :value="option.value" :key="option.value">{{ option.label }}</option>
            </select>
          </div>

          <div class="form-control">
            <label for="รายละเอียดไฟล์อ">รายละเอียดไฟล์</label>
            <input v-model="planhome_details" id="planhome_details" name="planhome_details" type="text"
              placeholder="รายละเอียดไฟล์" />
          </div>

          <div class="form-control">
            <label for="สเกลของแบบบ้าน">สเกลของแบบบ้าน</label>
            <input v-model="planhome_scale" id="planhome_scale" name="planhome_scale" type="text"
              placeholder="สเกลของแบบบ้าน" />
          </div>

          <div>
            <button type="submit" @click="confirmUpdate">เพิ่ม</button>
          </div>

        </form>
      </div>
    </div>
  </section>
</template>
  
<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  mounted() {
    console.log('Current User:', this.currentUser);
    this.fetchOptions();
  },
  computed: {
    ...mapState(['currentUser']), // Map the currentUser state from the Vuex store to this component
  },
  data() {
    return {
      defaultImageURL: 'http://localhost:3001/images/varinthorncc.png',
      usePdffileFolder: true,
      selectedFile: null,
      selectedOption: '', // Holds the selected option value
      options: [],
      planhome_details: '',
      planhome_scale: '',
    };
  },
  methods: {
    confirmUpdate() {
            this.$swal.fire({
                title: 'ยืนยันการเพิ่มข้อมูลแบบบ้าน',
                text: "ยืนยันการเพิ่มข้อมูลแบบบ้าน",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.uploadFile()
                    this.$swal.fire(
                        'เพิ่มเรียบร้อย!',
                        'เพิ่มเรียบร้อย',
                        'success'
                    )
                }
            })
        },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      this.pdfFile = event.target.files[0];
      console.log('Selected File:', this.selectedFile); // Add this line to check the selectedFile value
    },
    fetchOptions() {
      axios
        .get('http://localhost:3001/filehome')
        .then(response => {
          console.log(response.data); // Log the API response data for debugging
          // Assuming your response contains an array of objects from the planhome table
          // Modify the response data to match the required format for the dropdown options
          this.options = response.data.map(item => ({
            value: item.filehome_id, // Assuming planhome_id is the primary key column
            label: item.filehome_id, // Use the appropriate column for the display label
          }));
        })
        .catch(error => {
          console.error(error);
        });
    },
    async uploadFile() {
      try {
        console.log('Selected File:', this.selectedFile);

        if (!this.selectedFile) {
          console.error('No file selected.'); // Handle the case when no file is selected
          return;
        }

        const formData = new FormData();
        formData.append('pdfFile', this.selectedFile);
        formData.append('filehomeId', this.selectedOption);
        formData.append('planhomeDetails', this.planhome_details);
        formData.append('planhomeScale', this.planhome_scale);
        formData.append('usePdffileFolder', true); // Change this to 'true'

        const response = await axios.post('http://localhost:3001/phINSERTPDF', formData);

        console.log('File uploaded successfully.');
        this.$router.replace("/Account");
        // Handle the response as needed
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle the error as needed
      }
    },
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