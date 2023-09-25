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
        <form @submit.prevent="isUpdate ? updateemployee() : uploademployee()">
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
            <label for="TN">เบอร์โทรศัพท์</label>
            <input id="TN" name="TN" type="tel" v-model.trim="TNU" placeholder="000" />
          </div>

          <div class="form-control">
            <label for="PW">รหัสผ่าน</label>
            <input id="PW" name="PW" type="password" v-model.trim="PWU" placeholder="Password" />
          </div>
          <div class="form-control">
            <label for="CPW">ยืนยันรหัสผ่าน</label>
            <input id="CPW" name="CPW" type="password" v-model.trim="CPWU" placeholder="Confirmed Password" />
          </div>
          <div>
            <button type="submit" :disabled="!passwordsMatch">{{ isUpdate ? 'แก้ไข' : 'เพิ่ม' }}</button>
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
      TNU: '',
      isUpdate: false,
      employeeIdToUpdate: null,
      passwordsMatch: true, // Add this line to define the passwordsMatch property

    };
  },
  methods: {
    async fetchuser(u_id) {
      try {
        const response = await axios.get(`http://localhost:3001/user/${u_id}`);
        const userData = response.data;

        this.EmailU= userData.u_email;
        this.UNAMEU= userData.u_username;
        this.FNU= userData.u_name;
        // this.PWU= userData.u_password,
        this.TNU= userData.u_phone;

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
          TNU: this.TNU,
        };

        if (this.userIdToUpdate) {
          const response = await axios.put(
            `http://localhost:3001/user/${this.userIdToUpdate}`,
            updatedData
          );

          if (response.status === 200) {
            console.log('user updated successfully.');
            // Fetch the updated data again
            this.fetchuser(this.userIdToUpdate);
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
    const userIdToUpdate = this.$route.params.u_id;
    if (userIdToUpdate) {
      this.isUpdate = true;
      this.userIdToUpdate = userIdToUpdate;
      this.fetchuser(userIdToUpdate);
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