<template>
  <section class="w-full h-screen">
  <div class="text-center grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
    <div class="col-start-1 "><div class="pt-20"><img :src='imageurl' class="h-100 mr-100" alt="Varinthorn Logo" /></div></div>
    <div class="col-start-2">
      <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">สมัครสมาชิก</div>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="EMAIL">อีเมลล์</label>
          <input id="EMAIL" name="EMAIL" type="email" v-model.trim="EmailU" placeholder="exam@ple.com"/>
        </div>
        <div class="form-control">
          <label for="UNAME">ชื่อผู้ใช้</label>
          <input id="UNAME" name="UNAME" type="text" v-model.trim="UNAMEU" placeholder="Username"/>
        </div>
        <div class="form-control">
          <label for="PW">รหัสผ่าน</label>
          <input id="PW" name="PW" type="password" v-model.trim="PWU" placeholder="Password"/>
        </div>
        <div class="form-control">
          <label for="CPW">ยืนยันรหัสผ่าน</label>
          <input id="CPW" name="CPW" type="password" v-model.trim="CPWU" placeholder="Confirmed Password"/>
        </div>
        <div class="form-control">
          <label for="FName">ชื่อนามสกุล</label>
          <input id="FName" name="FName" type="text" v-model="FNAMEU" placeholder="Exam Ple"/>
        </div>

        <div>
          <button>สมัครสมาชิก</button>
        </div>
      </form>
    </div>
  </div>
</section>
</template>
  
<script>
export default {
  props:{
    imageurl: {
      type: String,
      required: true,
      default: '',
    },
  },

  data() {
    return {
      EmailU: '',
      UNAMEU: '',
      PWU: '',
      CPWU: '',
      FNAMEU: '',
    };
  },
  methods: {
    submitForm() {
      console.log('E:' + this.EmailU, '-U:' + this.UNAMEU, '-P:' + this.PWU, '-F:' + this.FNAMEU);
      this.EmailU = '';
      this.UNAMEU = '';
      this.PWU = '';
      this.CPWU = '';
      this.FNAMEU = '';
    }
  }
}


</script>
  
  
<style scoped>
form {
  margin: 2rem auto;
  max-width: 40rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 2rem;
  background-color: #ffffff;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
}

h2 {
  font-size: 1rem;
  margin: 0.5rem 0;
}

input,
select {
  display: block;
  width: 100%;
  font: inherit;
  margin-top: 0.5rem;
}

select {
  width: auto;
}

input[type='checkbox'],
input[type='radio'] {
  display: inline-block;
  width: auto;
  margin-right: 1rem;
}

input[type='checkbox']+label,
input[type='radio']+label {
  font-weight: normal;
}

button {
  font: inherit;
  border: 1px solid #0076bb;
  background-color: #0076bb;
  color: white;
  cursor: pointer;
  padding: 0.75rem 2rem;
  border-radius: 30px;
}

button:hover,
button:active {
  border-color: #002350;
  background-color: #002350;
}
</style>