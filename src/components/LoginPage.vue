<template>
  <section class="w-full h-screen">
    <div class="text-center grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
      <div class="col-start-1">
        <div class="pt-5 flex justify-center"><img :src="defaultImageURL"  style="width: 75%;height: 75%;" alt="Varinthorn Logo" /></div>
      </div>
      <div class="col-start-2">
        <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">เข้าสู่ระบบ</div>
        <form @submit.prevent="submitForm">
          <div class="form-control">
            <label for="EMAIL">อีเมลล์</label>
            <input id="EMAIL" name="EMAIL" type="email" v-model.trim="EmailU" placeholder="exam@ple.com" />
          </div>
          <div class="form-control">
            <label for="PW">รหัสผ่าน</label>
            <input id="PW" name="PW" type="password" v-model.trim="PWU" placeholder="Password" />
          </div>
          <div class="pt-2">
            <button v-on:click="login">ล็อคอิน</button>
          </div>

          <div class="pt-5">
            <router-link :to="{ path: '/register'}">ยังไม่เป็นสมาชิก? สมัครสมาชิก</router-link>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

    
<script>
import jwt_decode from 'jwt-decode';

export default {

  data() {
    return {
      defaultImageURL: 'http://localhost:3001/images/varinthorncc.png',
      EmailU: '',
      PWU: '',
    };
  },
  methods: {
    passIncorrect() {
      this.$swal.fire('Login ล้มเหลว',
        'ไม่มีชื่อผู้ใช้ หรือ รหัสผ่านผิด',
        'question');
    },
    passCorrect() {
      let timerInterval
      this.$swal.fire({
        title: 'Login สำเร็จ',
        html: 'กำลังเปลี่ยนหน้าต่างภายใน <b></b>',
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          this.$swal.showLoading()
          const b = this.$swal.getHtmlContainer().querySelector('b')
          timerInterval = setInterval(() => {
            b.textContent = this.$swal.getTimerLeft()
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === this.$swal.DismissReason.timer) {
          location.reload()
        }
      })
    },
    async login() {
      try {
        const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.EmailU,
            password: this.PWU,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Login Data:', data); // Add this line to check the response data

          // Check if the response contains the "accessToken" property
          if (data.accessToken) {
            // Decode the token to extract user information
            const decodedToken = jwt_decode(data.accessToken);
            console.log('Decoded Token:', decodedToken); // Add this line to check the decoded token

            // Check if the decoded token contains the "employee" role
            if (decodedToken.role === 'employee') {
              // Set the current user in the Vuex store
              this.$store.dispatch('setCurrentEmployee', decodedToken.employee);
              console.log('Employee is logged in:', decodedToken.employee);
            }

            // Store the token in local storage or a cookie for future use
            localStorage.setItem('accessToken', data.accessToken);
            this.passCorrect()
            // Redirect or perform any other action after successful login
          }
        } else if (response.status === 404) {
          this.passIncorrect()
          // Handle the case when the user does not exist
        } else {
          this.passIncorrect()
          // Handle the case when the password is incorrect
        }

        this.EmailU = '';
        this.PWU = '';
      } catch (error) {
        console.error(error);
      }
    },
  }

}


</script>