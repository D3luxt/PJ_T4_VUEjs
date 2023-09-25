<template>
    <section class="w-full h-screen">
      <div class="text-center grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
        <div class="col-start-1">
          <div class="pt-20">
            <img :src="defaultImageURL" class="h-100 mr-100" alt="Varinthorn Logo" />
          </div>
        </div>
        <div class="col-start-2">
          <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">
            {{ isUpdate ? 'แก้ไขแบบบ้าน' : 'เพิ่มแบบบ้าน' }}
          </div>
          <form @submit.prevent="isUpdate ? updateFilehome() : uploadFilehome()">
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
            <label for="ชื่อไฟล์แบบบ้าน">ชื่อไฟล์แบบบ้าน</label>
            <input v-model="planhome_details" id="planhome_details" name="planhome_details" type="text"
              placeholder="ชื่อไฟล์แบบบ้าน" />
          </div>

          <div class="form-control">
            <label for="สเกลของแบบบ้าน">สเกลของแบบบ้าน</label>
            <input v-model="planhome_scale" id="planhome_scale" name="planhome_scale" type="text"
              placeholder="สเกลของแบบบ้าน" />
          </div>

          <div>
            <button type="submit" @click="uploadFile">เพิ่ม</button>
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
        selectedOption: '',
        options: [],
        filehome_3d_url: '',
        filehome_details: '',
        filehome_name:'',
        filehome_id:'',
        isUpdate: false,
        filehomeIdToUpdate: null,
      };
    },
    methods: {
      async fetchPlanhome(filehomeId) {
        try {
          const response = await axios.get(`http://localhost:3001/planhome/${filehomeId}`);
          const planhomeData = response.data;
          
          this.planhome_details = planhomeData.planhome_details;
          this.planhome_scale = planhomeData.planhome_scale;
          this.selectedOption = planhomeData.filehome_id;
        } catch (error) {
          console.error('Error fetching planhome data:', error);
        }
      },
      async uploadPlanhome() {
        try {
          if (!this.currentUser) {
            console.error('User not logged in.');
            return;
          }
  
          const formData = {
            planhome_details: this.planhome_details,
            planhome_scale: this.planhome_scale,
            filehome_id: this.selectedOption,            
          };
  
          if (this.planhhomeIdToUpdate) {
            const response = await axios.put(
              `http://localhost:3001/planhome/${this.planhhomeIdToUpdate}`,
              formData
            );
  
            if (response.status === 200) {
              console.log('planhome updated successfully.');
              // Fetch the updated data again
              this.fetchPlanhome(this.planhhomeIdToUpdate);
            } else {
              console.error('Failed to update planhome.');
            }
          }
        } catch (error) {
          console.error('Error updating planhome:', error);
        }
      },
  
      async updatePlanhome() {
        try {
          const updatedData = {
            planhome_details: this.planhome_details,
            planhome_scale: this.planhome_scale,
            filehome_id: this.selectedOption,  
          };
  
          if (this.planhomeIdToUpdate) {
            const response = await axios.put(
              `http://localhost:3001/planhome/${this.planhomeIdToUpdate}`,
              updatedData
            );
  
            if (response.status === 200) {
              console.log('Planhome updated successfully.');
              // Fetch the updated data again
              this.fetchPlanhome(this.planhomeIdToUpdate);
            } else {
              console.error('Failed to update Planhome.');
            }
          }
        } catch (error) {
          console.error('Error updating filehome:', error);
        }
      },
    },
    mounted() {
      const planhomeIdToUpdate = this.$route.params.filehome_id;
      if (planhomeIdToUpdate) {
        this.isUpdate = true;
        this.planhomeIdToUpdate = planhomeIdToUpdate;
        this.fetchPlanhome(planhomeIdToUpdate);
      }
  
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