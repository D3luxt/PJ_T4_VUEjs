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
              <label for="ชื่อแบบบ้าน">ชื่อแบบบ้าน</label>
              <input
                v-model="filehome_name"
                id="filehome_name"
                name="filehome_name"
                type="text"
                placeholder="ชื่อแบบบ้าน"
              />
            </div>
            <div class="form-control">
              <label for="รายละเอียดแบบบ้าน">รายละเอียดแบบบ้าน</label>
              <textarea
                rows="7" cols="50"
                v-model="filehome_details"
                id="filehome_details"
                name="filehome_details"
                placeholder="รายละเอียดแบบบ้าน"
              >
            </textarea>
            </div>
            <div class="form-control">
              <label for="ลิ้งค์แบบบ้าน 3มิติ">ลิ้งค์แบบบ้าน 3มิติ</label>
              <input
                v-model="filehome_3d_url"
                id="filehome_3d_url"
                name="filehome_3d_url"
                type="text"
                placeholder="ลิ้งค์แบบบ้าน 3มิติ"
              />
            </div>
            <div>
              <button type="submit">{{ isUpdate ? 'แก้ไข' : 'เพิ่ม' }}</button>
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
      async fetchFilehome(filehomeId) {
        try {
          const response = await axios.get(`http://localhost:3001/filehome/${filehomeId}`);
          const filehomeData = response.data;
          
          this.filehome_name = filehomeData.filehome_name;
          this.filehome_details = filehomeData.filehome_details;
          this.filehome_3d_url = filehomeData.filehome_3d_url;
          this.selectedOption = filehomeData.planhome_id;
          this.filehome_id = filehomeData.filehome_id
        } catch (error) {
          console.error('Error fetching filehome data:', error);
        }
      },
      async uploadFilehome() {
        try {
          if (!this.currentUser) {
            console.error('User not logged in.');
            return;
          }
  
          const formData = {
            filehome_name: this.filehome_name,
            filehome_details: this.filehome_details,
            filehome_3d_url: this.filehome_3d_url,
            filehomeId: this.filehome_id,
            
          };
  
          const response = await axios.post('http://localhost:3001/fhInsert', formData);
  
          if (response.status === 201) {
            console.log('Filehome inserted successfully.');
          } else {
            console.error('Failed to insert filehome.');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      },
  
      async updateFilehome() {
        try {
          const updatedData = {
            filehome_name:this.filehome_name,
            filehome_details: this.filehome_details,
            filehome_3d_url: this.filehome_3d_url,
            planhome_id: this.selectedOption,
          };
  
          if (this.filehomeIdToUpdate) {
            const response = await axios.put(
              `http://localhost:3001/filehome/${this.filehomeIdToUpdate}`,
              updatedData
            );
  
            if (response.status === 200) {
              console.log('Filehome updated successfully.');
              // Fetch the updated data again
              this.fetchFilehome(this.filehomeIdToUpdate);
            } else {
              console.error('Failed to update filehome.');
            }
          }
        } catch (error) {
          console.error('Error updating filehome:', error);
        }
      },
    },
    mounted() {
      const filehomeIdToUpdate = this.$route.params.filehome_id;
      if (filehomeIdToUpdate) {
        this.isUpdate = true;
        this.filehomeIdToUpdate = filehomeIdToUpdate;
        this.fetchFilehome(filehomeIdToUpdate);
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