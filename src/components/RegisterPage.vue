<template>
  <section class="w-full h-screen">
    <div class="text-center grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
      <div class="col-start-1 ">
        <div class="pt-5 flex justify-center"><img :src="defaultImageURL" style="width: 75%;height: 75%;"
            alt="Varinthorn Logo" /></div>
      </div>
      <div class="col-start-2">
        <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">สมัครสมาชิก</div>
        <form @submit.prevent="submitForm">
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
            <input id="TN" name="TN" type="tel" v-model.trim="TNU" placeholder="0000000000" maxlength="10" />
          </div>

          <div class="form-control">
            <label for="PW">รหัสผ่าน</label>
            <input id="PW" name="PW" type="password" v-model.trim="PWU" @input="checkPasswords" placeholder="Password"
              :class="{ 'required': !isPasswordValid, 'valid': isPasswordValid }" />
            <span v-if="!isPasswordValid" class="error-message">รหัสผ่านต้องมีความยาว 8 ตัวขึ้นไปและประกอบด้วย 1 ตัวอักษรพิเศษ และต้องตรงกับยืนยันรหัสผ่าน</span>
          </div>

          <div class="form-control">
            <label for="CPW">ยืนยันรหัสผ่าน</label>
            <input id="CPW" name="CPW" type="password" v-model.trim="CPWU" @input="checkPasswords"
              placeholder="Confirm Password" :class="{ 'required': !isPasswordValid, 'valid': isPasswordValid }" />
          </div>

          <div class="pt-2">
            <button :disabled="!isPasswordValid" @click.prevent="confirmUpdate">สมัครสมาชิก</button>
          </div>

          <div class="pt-5">
            <router-link :to="{ path: '/login' }">เป็นสมาชิกแล้ว? เข้าสู่ระบบ</router-link>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      defaultImageURL: 'http://localhost:3001/images/varinthorncc.png',
      TNU: '',
      FNU: '',
      EmailU: "",
      UNAMEU: "",
      PWU: "",
      CPWU: "",
      isPasswordValid: false

    };
  },
  // ...

  methods: {
    checkPasswords() {
      const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-=|]/.test(this.PWU);
      this.passwordsMatch = this.PWU === this.CPWU;
      this.isPasswordValid = this.PWU.length >= 8 && hasSymbol && this.passwordsMatch;
    },
    confirmUpdate() {
      if (!this.passwordsMatch) {
        return;
      }
      this.$swal.fire({
        title: 'ยืนยันการสมัครสมาชิก',
        text: "ยืนยันการสมัครสมาชิก",
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
            'สมัครเรียบร้อย!',
            'สมัครเรียบร้อย',
            'success'
          )
        }
      })
    },
    async submitForm() {
      try {
        const response = await fetch("http://localhost:3001/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.EmailU,
            user: this.UNAMEU,
            password: this.PWU,
            fullname: this.FNU,
            telenum: this.TNU,
          }),
        });

        if (response.ok) {
          // Registration successful
          console.log("Registration successful");
          // Reset the form
          this.EmailU = "";
          this.UNAMEU = "";
          this.PWU = "";
          this.CPW = "";
          window.location.href = "http://localhost:5173/login";
        } else {
          // Registration failed
          console.error("Registration failed");
          // You can handle the error response here:
          // If the response contains JSON data, you can parse and display it
          try {
            const responseData = await response.json();
            console.error("Error response:", responseData);
          } catch (error) {
            // If the response is not in JSON format, log the response text
            console.error("Error response text:", await response.text());
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  // ...

};
</script>
  
  