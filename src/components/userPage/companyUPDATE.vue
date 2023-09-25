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
          {{ isUpdate ? 'แก้ไขข้อมูลพื้นฐาน' : 'เพิ่มพนักงาน' }}
        </div>
        <form @submit.prevent="isUpdate ? confirmUpdate() : uploademployee()">
          <div class="form-control">
            <label for="com_name_en">ชื่อบริษัทภาษาอังกฤษ</label>
            <input v-model="com_name_en" id="com_name_en" name="com_name_en" type="text"
              placeholder="ชื่อบริษัทภาษาอังกฤษ" />
          </div>
          <div class="form-control">
            <label for="com_name_thai">ชื่อบริษัทภาษาไทย</label>
            <input v-model="com_name_thai" id="com_name_thai" name="com_name_thai" type="text"
              placeholder="ชื่อบริษัทภาษาไทย" />
          </div>
          <div class="form-control">
            <label for="com_email">อีเมลล์</label>
            <input v-model="com_email" id="com_email" name="com_email" type="email" placeholder="exam@ple.com" />
          </div>
          <div class="form-control">
            <label for="com_tel">เบอร์โทรศัพท์</label>
            <input v-model="com_tel" id="com_tel" name="com_tel" type="tel" placeholder="เบอร์โทรศัพท์" />
          </div>

          <div class="form-control">
            <label for="com_address">ที่ตั้งบริษัท</label>
            <div class="input-container">
              <textarea rows="3" cols="50" v-model="com_address" id="com_address" name="com_address"
                placeholder="ที่ตั้งบริษัท"></textarea>
            </div>
          </div>

          <div class="form-control">
            <label for="comIMG">LOGO บริษัท</label>
            <input id="comIMG" name="comIMG" type="file" ref="fileInput" accept=".png,.jpg,.jpeg"
              @change="onFileSelected" />
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
    ...mapState(['currentEmployee']),
  },
  data() {
    return {
      defaultImageURL: 'http://localhost:3001/images/varinthorncc.png',
      selectedOption: '',
      options: [],
      com_name_en: '',
      com_name_thai: '',
      com_address: '',
      com_email: '',
      com_tel: '',
      isUpdate: false,
      comIdToUpdate: null,
      comIMG: null,

    };
  },
  methods: {
    confirmUpdate() {
      this.$swal.fire({
        title: 'ยืนยันการแก้ไขข้อมูลค่าคงที่ของระบบ',
        text: "ยืนยันการแก้ไขข้อมูลค่าคงที่ของระบบ",
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
    onFileSelected(event) {
      this.comIMG = event.target.files[0]; // Store the selected file directly
      console.log('Selected File:', this.comIMG); // Check the selected file
    },

    async fetchcompany(com_id) {
      try {
        const response = await axios.get(`http://localhost:3001/company/${com_id}`);
        const comData = response.data;

        this.com_name_en = comData.com_name_en;
        this.com_name_thai = comData.com_name_thai;
        this.com_email = comData.com_email;
        this.com_tel = comData.com_tel;
        this.com_address = comData.com_address;


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
          com_name_en: this.com_name_en,
          com_name_thai: this.com_name_thai,
          com_email: this.com_email,
          com_tel: this.com_tel,
          com_address: this.com_address,

        };

        if (this.comIdToUpdate) {
          const formData = new FormData();
          for (const key in updatedData) {
            formData.append(key, updatedData[key]);
          }

          if (this.comIMG) {
            formData.append('comIMG', this.comIMG); // Add the selected image to the form data
          }

          const response = await axios.put(
            `http://localhost:3001/company/${this.comIdToUpdate}`,
            formData
          );
          console.log('ood' + formData);
          if (response.status === 200) {
            console.log('Company updated successfully.');
            // Fetch the updated data again
            this.fetchcompany(this.comIdToUpdate);
          } else {
            console.error('Failed to update company.');
          }
        }
      } catch (error) {
        console.error('Error updating company:', error);
      }
    },
  },
  mounted() {
    const comIdToUpdate = this.$route.params.com_id;
    if (comIdToUpdate) {
      this.isUpdate = true;
      this.comIdToUpdate = comIdToUpdate;
      this.fetchcompany(comIdToUpdate);
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

.button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.input-container {
  display: flex;
  flex-direction: column;
}

.input-container label {
  margin-bottom: 5px;
}

.input-container textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}
</style>
