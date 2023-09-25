<template>
    <section class="w-full h-screen">
      <div class="text-center grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
        <div class="col-start-1">
          <div v-if="isDataFetched" class="pt-20">
            <img :src="getImageUrl(JSON.parse(filehome_imgs)[0])" style="width: 600px; height: 300px;">
          </div>
        </div>
        <div class="col-start-2">
          <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">
            {{ isUpdate ? 'แก้ไขแบบบ้าน' : 'เพิ่มแบบบ้าน' }}
          </div>
          <form @submit.prevent="isUpdate ? confirmUpdate() : uploadFilehome()">
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
            <label for="ราคาเริ่มต้น">ราคาเริ่มต้น</label>
            <input v-model="filehome_price" id="filehome_price" name="filehome_price" type="number"
              placeholder="ราคาเริ่มต้น" />
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
        isDataFetched: false,
        filehome_price:'',
        isUpdate: false,
        filehomeIdToUpdate: null,
      };
    },
    methods: {
      confirmUpdate() {
            this.$swal.fire({
                title: 'ยืนยันการแก้ไขข้อมูลแบบบ้าน',
                text: "ยืนยันการแก้ไขข้อมูลแบบบ้าน",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.updateFilehome()
                    this.$swal.fire(
                        'แก้ไขเรียบร้อย!',
                        'แก้ไขเรียบร้อย',
                        'success'
                    )
                }
            })
        },
      async fetchFilehome(filehomeId) {
        try {
          const response = await axios.get(`http://localhost:3001/filehome/${filehomeId}`);
          const filehomeData = response.data;
          
          this.filehome_name = filehomeData.filehome_name;
          this.filehome_details = filehomeData.filehome_details;
          this.filehome_3d_url = filehomeData.filehome_3d_url;
          this.selectedOption = filehomeData.planhome_id;
          this.filehome_id = filehomeData.filehome_id;
          this.filehome_imgs = filehomeData.filehome_imgs;
          this.filehome_price = filehomeData.filehome_price;
          this.isDataFetched = true; // Set the flag to true when data is fetched

        } catch (error) {
          console.error('Error fetching filehome data:', error);
          this.isDataFetched = true; // Set the flag to true even if there's an error to avoid being stuck in loading state

        }
      },
      getImageUrl(filename) {
      // Assuming your Node.js server is running on localhost:3001
      return `http://localhost:3001/images/${filename}`;
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
            filehome_price:this.filehome_price,
          };
  
          const response = await axios.post('http://localhost:3001/fhInsert', formData);
  
          if (response.status === 201) {
            console.log('Filehome inserted successfully.');
            this.$router.replace("/Account");
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
            filehome_id:this.$route.params.filehome_id,
            filehome_name:this.filehome_name,
            filehome_details: this.filehome_details,
            filehome_3d_url: this.filehome_3d_url,
            filehome_price: this.filehome_price,

          };
  
          if (this.filehomeIdToUpdate) {
            const response = await axios.put(
              `http://localhost:3001/filehome/${this.filehomeIdToUpdate}`,
              updatedData
            );
  
            if (response.status === 200) {
              console.log('Filehome updated successfully.');
              this.$router.replace("/Account");
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