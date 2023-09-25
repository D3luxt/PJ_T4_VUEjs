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
          {{ isUpdate ? 'แก้ไขพนักงาน' : 'เพิ่มพนักงาน' }}
        </div>
        <form @submit.prevent="isUpdate ? confirmUpdate() : uploademployee()">
          <div class="form-control">
            <label for="EMAIL">อีเมลล์</label>
            <input id="EMAIL" name="EMAIL" type="email" v-model.trim="EmailU" placeholder="exam@ple.com" />
          </div>
          <div class="form-control">
            <label for="UNAME">ชื่อผู้ใช้</label>
            <input id="UNAME" name="UNAME" type="text" v-model.trim="UNAMEU" placeholder="Username" />
          </div>

          <div class="form-control">
            <label for="FN">ชื่อ-นามสกุล</label>
            <input id="FN" name="FN" type="text" v-model.trim="FNU" placeholder="ชื่อ - นามสกุล" />
          </div>

          <div class="form-control">
            <label for="PW">รหัสผ่าน</label>
            <input id="PW" name="PW" type="password" v-model.trim="PWU" @input="checkPasswords" placeholder="Password" />
          </div>
          <div class="form-control">
            <label for="CPW">ยืนยันรหัสผ่าน</label>
            <input id="CPW" name="CPW" type="password" v-model.trim="CPWU" @input="checkPasswords"
              placeholder="Confirmed Password" />
            <span v-if="!passwordsMatch" class="error-message">รหัสผ่านไม่ตรงกัน</span>
          </div>

          <div class="pt-2">
            <button :disabled="!passwordsMatch" @click.prevent="confirmUpdate">เพิ่มพนักงาน</button>
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
    ...mapState(['currentEmployee']),
  },
  data() {
    return {
      defaultImageURL: 'http://localhost:3001/images/varinthorncc.png',
      selectedOption: '',
      options: [],
      EmailU: '',
      UNAMEU: '',
      FNU: '',
      PWU: '',
      CPWU: '',
      isUpdate: false,
      employeeIdToUpdate: null,
      passwordsMatch: true, // Add this line to define the passwordsMatch property

    };
  },
  methods: {
    checkPasswords() {
      this.passwordsMatch = this.PWU === this.CPWU;
    },
    confirmUpdate() {
      if (!this.passwordsMatch) {
        return;
      }
      this.$swal.fire({
        title: 'ยืนยันการแก้ไขข้อมูลพนักงาน',
        text: "ยืนยันการแก้ไขข้อมูลพนักงาน",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateemployee()
          this.$swal.fire(
            'แก้ไขเรียบร้อย!',
            'แก้ไขเรียบร้อย',
            'success'
          )
        }
      })
    },
    async fetchemployee(em_id) {
      try {
        const response = await axios.get(`http://localhost:3001/employee/${em_id}`);
        const employeeData = response.data;

        this.EmailU = employeeData.em_email;
        this.UNAMEU = employeeData.em_username;
        this.FNU = employeeData.em_name;

      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    },
    async uploademployee() {
      try {

        const formData = {
          EmailU: this.EmailU,
          UNAMEU: this.UNAMEU,
          FNU: this.FNU,
          PWU: this.PWU,
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
          EmailU: this.EmailU,
          UNAMEU: this.UNAMEU,
          FNU: this.FNU,
          PWU: this.PWU,
        };

        if (this.employeeIdToUpdate) {
          const response = await axios.put(
            `http://localhost:3001/employee/${this.employeeIdToUpdate}`,
            updatedData
          );

          if (response.status === 200) {
            console.log('employee updated successfully.');
            this.$router.replace("/Account");

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
    const employeeIdToUpdate = this.$route.params.em_id;
    if (employeeIdToUpdate) {
      this.isUpdate = true;
      this.employeeIdToUpdate = employeeIdToUpdate;
      this.fetchemployee(employeeIdToUpdate);
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