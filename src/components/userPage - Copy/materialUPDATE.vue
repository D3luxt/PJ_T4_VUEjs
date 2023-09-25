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
          {{ isUpdate ? 'แก้ไขแบบบ้าน' : 'แก้ไขวัสดุ' }}{{ this.params }}
        </div>
        <form @submit.prevent="isUpdate ? updateFilehome() : uploadFilehome()">
          <div class="form-control">
            <label for="ชื่อวัสดุ">ชื่อวัสดุ</label>
            <input v-model="mat_name" id="mat_name" name="mat_name" type="text" placeholder="ชื่อวัสดุ" />
          </div>
          <div class="form-control">
            <label for="หน่วยนับวัสดุ">หน่วยนับวัสดุ</label>
            <input v-model="mat_unit" id="mat_unit" name="mat_unit" type="text" placeholder="หน่วยนับวัสดุ">
          </div>
          <div class="form-control">
            <label for="รายละเอียดวัสดุ">รายละเอียดวัสดุ</label>
            <textarea rows="7" cols="50" v-model="mat_details" id="mat_details" name="mat_details" type="text"
              placeholder="รายละเอียดวัสดุ">
            </textarea>
          </div>
          <div class="form-control">
            <label for="วัสดุราคาเกรดA">วัสดุราคาเกรด A</label>
            <input v-model="mat_gradeA" id="mat_gradeA" name="mat_gradeA" type="number" placeholder="วัสดุราคาเกรดA">
          </div>
          <div class="form-control">
            <label for="วัสดุราคาเกรดB">วัสดุราคาเกรด B </label>
            <input v-model="mat_gradeB" id="mat_gradeB" name="mat_gradeB" type="number" placeholder="วัสดุราคาเกรดB">
          </div>
          <div class="form-control">
            <label for="วัสดุราคาเกรดC">วัสดุราคาเกรด C</label>
            <input v-model="mat_gradeC" id="mat_gradeC" name="mat_gradeC" type="number"  placeholder="วัสดุราคาเกรดC">
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
      mat_id:'',
      mat_name: '',
      mat_details: '',
      mat_unit: '',
      mat_gradeA: '',
      mat_gradeB: '',
      mat_gradeC: '',
      isUpdate: false,
      materialIdToUpdate: null,
    };
  },
  methods: {
    async fetchFilehome(mat_id) {
      try {
        const response = await axios.get(`http://localhost:3001/mtUpdate/${mat_id}`);
        const materialData = response.data;

        this.mat_id = materialData.mat_id;
        this.mat_name = materialData.mat_name;
        this.mat_details = materialData.mat_details;
        this.mat_unit = materialData.mat_unit;
        this.mat_gradeA = materialData.mat_gradeA;
        this.mat_gradeB = materialData.mat_gradeB;
        this.mat_gradeC = materialData.mat_gradeC;

      } catch (error) {
        console.error('Error fetching material data:', error);
      }
    },
    async uploadFilehome() {
      try {
        if (!this.currentUser) {
          console.error('User not logged in.');
          return;
        }

        const formData = {
          matId: this.mat_id,
          matName: this.mat_name,
          matDetails: this.mat_details,
          matUnit: this.mat_unit,
          matgradeA: this.mat_gradeA,
          matgradeB: this.mat_gradeB,
          matgradeC: this.mat_gradeC,
        };

        const response = await axios.post('http://localhost:3001/matINSERT', formData);

        if (response.status === 201) {
          console.log('material inserted successfully.');
        } else {
          console.error('material to insert filehome.');
        }
      } catch (error) {
        console.error('material uploading file:', error);
      }
    },

    async updateFilehome() {
      try {
        const updatedData = {
          mat_id: this.mat_id,
          mat_name: this.mat_name,
          mat_details: this.mat_details,
          mat_unit: this.mat_unit,
          mat_gradeA: this.mat_gradeA,
          mat_gradeB: this.filehomeData.mat_gradeB,
          mat_gradeC: this.filehomeData.mat_gradeC,
        };

        if (this.materialIdToUpdate) {
          const response = await axios.put(
            `http://localhost:3001//material/${this.materialIdToUpdate}`,
            updatedData
          );

          if (response.status === 200) {
            console.log('material updated successfully.');
            // Fetch the updated data again
            this.fetchFilehome(this.materialIdToUpdate);
          } else {
            console.error('material to update filehome.');
          }
        }
      } catch (error) {
        console.error('Error updating filehome:', error);
      }
    },
  },
  mounted() {
    const materialIdToUpdate = this.$route.params.filehome_id;
    if (materialIdToUpdate) {
      this.isUpdate = true;
      this.materialIdToUpdate = materialIdToUpdate;
      this.fetchFilehome(materialIdToUpdate);
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