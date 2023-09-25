<template>
  <section class="w-full h-screen">
    <div class="text-center grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
      <div class="col-start-1 ">
        <div class="pt-5 flex justify-center"><img :src="defaultImageURL" style="width: 75%;height: 75%;"
            alt="Varinthorn Logo" /></div>
      </div>
      <div class="col-start-2">
        <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">เพิ่มพนักงาน</div>
        <form @submit.prevent="confirmUpdate">
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
      TNU: '',
      EmailU: "",
      UNAMEU: "",
      FNU: '',
      PWU: "",
      CPWU: "",
      passwordsMatch: true, // Add this line to define the passwordsMatch property

    };
  },
  // ...

  methods: {

    checkPasswords() {
      this.passwordsMatch = this.PWU === this.CPWU;
    },
    confirmUpdate() {
      if (!this.passwordsMatch) {
        return;
      }
      this.$swal.fire({
        title: 'ยืนยันการเพิ่มข้อมูลพนักงาน',
        text: "ยืนยันการเพิ่มข้อมูลพนักงาน",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          this.submitForm()
          this.$swal.fire(
            'เพิ่มเรียบร้อย!',
            'เพิ่มเรียบร้อย',
            'success'
          )
        }
      })
    },
    async submitForm() {
      try {
        if (!this.currentEmployee) {
          console.error('User not logged in.');
          return;
        }
        const token = localStorage.getItem('accessToken');
        console.log('Token:', token);
        const formData = new FormData(this.$refs.uploadForm);

        const data = {
          email: this.EmailU,
          user: this.UNAMEU,
          fname: this.FNU,
          password: this.PWU,
        };

        const response = await axios.post('http://localhost:3001/registerEmployee', data, {
        });

        if (response.status === 201) {
          console.log('Employee inserted successfully.');
          this.$router.replace("/Account");
          // Handle the success case if needed
        } else {
          console.error('Failed to insert Employee.');
          // Handle the error case if needed
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle the error case if needed
      }
    },
  },
  // ...

};
</script>
  
  