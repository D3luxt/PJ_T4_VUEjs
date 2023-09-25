<template>
  <section class="w-full h-screen">
    <div class="text-center grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
      <div class="col-start-1" v-if="pdfURL">
        <iframe :src="pdfURL" class="pdf-iframe"></iframe>
      </div>
      <div class="col-start-2">
        <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">
          {{ isUpdate ? 'แก้ไขแบบบ้าน ' + this.$route.params.planhome_id : 'เพิ่มแบบบ้าน' }}
        </div>
        <form @submit.prevent="isUpdate ? updatePlanhome() : uploadFilehome()">

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
      filehome_name: '',
      filehome_id: '',
      planhome_pdf: '',
      isUpdate: false,
      planhome_details: '',
      planhome_scale: '',
      planhomeIdToUpdate: null,
      pdfURL: null,
      showPDFURL: true,
    };
  },
  methods: {
    async fetchPlanhome(planhomeIdToUpdate) {
      try {
        console.log('Fetching planhome data for ID:', planhomeIdToUpdate);
        const response = await axios.get(`http://localhost:3001/planhomefetch/${planhomeIdToUpdate}`);
        console.log('API Response:', response.data);

        const planhomeData = response.data;
        console.log('Fetched planhome data:', planhomeData);
        console.log('planhome Id :', planhomeIdToUpdate);

        this.planhome_details = planhomeData.planhome_details;
        this.planhome_scale = planhomeData.planhome_scale;
        this.pdfURL = planhomeData.planhome_pdf ? `http://localhost:3001/get_pdf/${planhomeData.planhome_pdf}` : null;

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

        if (this.planhomeIdToUpdate) {
          const response = await axios.put(
            `http://localhost:3001/planhomefetch/${this.planhomeIdToUpdate}`,
            formData
          );

          if (response.status === 200) {
            console.log('planhome updated successfully.');
            // Fetch the updated data again
            this.fetchPlanhome(this.planhomeIdToUpdate);
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
            `http://localhost:3001/planhomefetch/${this.planhomeIdToUpdate}`,
            updatedData
          );

          if (response.status === 200) {
            console.log('Planhome updated successfully.');
            this.$router.replace("/Account");
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
    const planhomeIdToUpdate = this.$route.params.planhome_id;
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
  border-radius: 15px;
  /* Reduced border radius */
}

button:hover,
button:active {
  border-color: #291700;
  background-color: #291700;
}
</style>