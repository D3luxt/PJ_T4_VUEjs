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
          <form @submit.prevent="isUpdate ? updateemployee() : uploademployee()">
            <div class="form-control">
              <label for="รายละเอียดแบบบ้าน">รายละเอียดแบบบ้าน</label>
              <input
                v-model="employee_details"
                id="employee_details"
                name="employee_details"
                type="text"
                placeholder="รายละเอียดแบบบ้าน"
              />
            </div>
            <div class="form-control">
              <label for="ลิ้งค์แบบบ้าน 3มิติ">ลิ้งค์แบบบ้าน 3มิติ</label>
              <input
                v-model="employee_3d_url"
                id="employee_3d_url"
                name="employee_3d_url"
                type="text"
                placeholder="ลิ้งค์แบบบ้าน 3มิติ"
              />
            </div>
            <div class="form-control">
              <label for="planhome_Id">ไฟล์แบบบ้านอ้างอิง</label>
              <select v-model="selectedOption" id="planhomeIdfk" name="planhomeIdfk">
                <option v-for="option in options" :value="option.value" :key="option.value">
                  {{ option.label }}
                </option>
              </select>
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
        employee_3d_url: '',
        employee_details: '',
        isUpdate: false,
        employeeIdToUpdate: null,
      };
    },
    methods: {
      async fetchemployee(employeeId) {
        try {
          const response = await axios.get(`http://localhost:3001/employee/${employeeId}`);
          const employeeData = response.data;
  
          this.employee_details = employeeData.employee_details;
          this.employee_3d_url = employeeData.employee_3d_url;
          this.selectedOption = employeeData.planhome_id;
        } catch (error) {
          console.error('Error fetching employee data:', error);
        }
      },
      async fetchOptions() {
        axios
          .get('http://localhost:3001/planhome')
          .then((response) => {
            this.options = response.data.map((item) => ({
              value: item.planhome_id,
              label: item.planhome_pdf,
            }));
          })
          .catch((error) => {
            console.error(error);
          });
      },
      async uploademployee() {
        try {
          if (!this.currentUser) {
            console.error('User not logged in.');
            return;
          }
  
          const formData = {
            employee_details: this.employee_details,
            employee_3d_url: this.employee_3d_url,
            planhome_id: this.selectedOption,
          };
  
          const response = await axios.post('http://localhost:3001/fhInsert', formData);
  
          if (response.status === 201) {
            console.log('employee inserted successfully.');
          } else {
            console.error('Failed to insert employee.');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      },
  
      async updateemployee() {
        try {
          const updatedData = {
            employee_details: this.employee_details,
            employee_3d_url: this.employee_3d_url,
            planhome_id: this.selectedOption,
          };
  
          if (this.employeeIdToUpdate) {
            const response = await axios.put(
              `http://localhost:3001/employee/${this.employeeIdToUpdate}`,
              updatedData
            );
  
            if (response.status === 200) {
              console.log('employee updated successfully.');
              // Fetch the updated data again
              this.fetchemployee(this.employeeIdToUpdate);
            } else {
              console.error('Failed to update employee.');
            }
          }
        } catch (error) {
          console.error('Error updating employee:', error);
        }
      },
    },
    mounted() {
      const employeeIdToUpdate = this.$route.params.employee_id;
      if (employeeIdToUpdate) {
        this.isUpdate = true;
        this.employeeIdToUpdate = employeeIdToUpdate;
        this.fetchemployee(employeeIdToUpdate);
      }
  
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