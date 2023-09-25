<template>
  <div class="grid grid-cols-2 gap-4 flex flex-col pr-20 pl-20">
    <div class="col-start-1">
      <img :src="getImageUrl(JSON.parse(rowData.filehome_imgs)[0])"
        style="width: 600px; height: 300px; border: 2px solid #000; border-radius: 8px; ">
      <div class="mt-4">
        <div v-if="isEmployee">
          <div class="col-start-1 text-center text-4xl font-bold underline underline-offset-8 decoration-red-500">
            สำหรับพนักงาน</div>
          <button @click="toggleForm" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            style="margin-right: 30px;">
            เพิ่มหรือแก้ไขวัสดุที่เกี่ยวข้อง
          </button>

          <button @click="togglePlanhomeForm"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
            เพิ่มและดูไฟล์ PDF ที่เกี่ยวข้อง
          </button>

        </div>
      </div>


      <div v-if="showPlanhomeForm" class="bg-white p-8 rounded-lg mt-4">
        <form>
          <div class="table-container">
            <table class="table-fixed">
              <thead>
                <tr>
                  <th>รายละเอียดไฟล์</th>
                  <th>สเกล</th>
                  <th>ดาวน์โหลด</th>
                  <th>EDIT</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in planhomeData" :key="item.planhome_id">
                  <td>{{ item.planhome_details }}</td>
                  <td>{{ item.planhome_scale }}</td>
                  <td>
                    <i class="fa-solid fa-download fa-2xl" style="color: #00c220;" @click="downloadplanhomePdf(item.planhome_pdf)"></i>
                  </td>
                  <td>
                    <i class="fa-solid fa-trash-can fa-2xl" style="color: #ff0000;" @click="confirmPDFdelete(item)"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-end mt-4">
            <button @click.prevent="togglePlanhomeForm"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              ปิด
            </button>
            <button @click.prevent="showModal = !showModal"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
              เพิ่มไฟล์
            </button>
          </div>
        </form>
      </div>

      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h2>เพิ่มไฟล์</h2>
          <form @submit.prevent="">
            <div class="form-control">
              <label for="pdfFile">ไฟล์แบบบ้าน (PDF)</label>
              <input id="pdfFile" name="pdfFile" type="file" ref="fileInput" accept=".pdf" @change="onFileSelected" />
            </div>

            <div class="form-control">
              <label for="รายละเอียดไฟล์อ">รายละเอียดไฟล์</label>
              <input v-model="planhome_details" id="planhome_details" name="planhome_details" type="text"
                placeholder="รายละเอียดไฟล์" />
            </div>

            <div class="form-control">
              <label for="สเกลของแบบบ้าน">สเกลของแบบบ้าน</label>
              <input v-model="planhome_scale" id="planhome_scale" name="planhome_scale" type="text"
                placeholder="สเกลของแบบบ้าน" />
            </div>

            <div>
              <div class="flex justify-end">
                <button @click="showModal = false" style="margin-right: 30px;">ปิด</button>
                <button type="submit" @click="confirmAddPdf(item)">เพิ่ม</button>
              </div>

            </div>

          </form>
        </div>
      </div>

      <div v-if="showForm" class="bg-white p-8 rounded-lg mt-4">
        <form>
          <div v-for="item in paginatedStdMat" :key="item.mat_id" class="flex items-center">
            <label class="flex-1">{{ item.mat_name }}</label>

            <input v-if="item.hasMat" type="number" placeholder="จำนวน" style="width: 7em; height: 2em;"
              :id="'matunit_' + item.mat_id + '_input'" :name="'matunit_' + item.mat_id + '_input'"
              v-model="item.matQuantity">

            <div class="checkbox-group ml-2">
              <input type="checkbox" :id="'matname_' + item.mat_id + '_have'" :name="'matname_' + item.mat_id"
                v-model="item.hasMat">
            </div>
          </div>

          <div class="pagination flex justify-between mt-4">
            <div>
              <button :disabled="currentPage === 1" @click.prevent="prevPage"
                class="bg-green-600 hover:bg-green-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"> &lt;
              </button>
              <button :disabled="currentPage === totalPages" @click.prevent="nextPage"
                class="bg-green-600 hover:bg-green-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"> >
              </button>
            </div>
            <div class="flex">
              <button @click.prevent="toggleForm"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                ปิด
              </button>
              <button @click.prevent="stdMatconfirm"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
                เพิ่มวัสดุ
              </button>
            </div>
          </div>

        </form>
      </div>


    </div>
    <div class="col-start-2 border">

      <p class="text-2xl">
      <div class="col-start-1 text-4xl font-bold underline underline-offset-8 decoration-red-500">{{ rowData.filehome_name
      }}</div>
      </p>
      <p class="text-m" style="padding-top: 10px;">รหัสบ้าน : {{ rowData.filehome_id }}</p>
      <hr style="border: 1px solid #ccc; margin: 10px 0;">
      <h1 style="padding-top: 5px;">รายละเอียด : {{ rowData.filehome_details }}</h1>
      <p class="text-m" style="padding-top: 10px;">ราคาเริ่มต้น : {{ rowData.filehome_price.toLocaleString() }}</p>

      <div v-if="stdMatData.length > 0" >
      <hr style="border: 1px solid #ccc; margin: 10px 0;">
      <table class="table-fixed">
            <thead>
                <tr>
                    <th colspan="2">วัสดุที่ใช้</th>
                </tr>
                <tr>
                    <th>ชื่อวัสดุ</th>
                    <th>จำนวน</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="dataItem in stdMatData" :key="dataItem.std_mat_id">
                    <td>{{ dataItem.std_mat_name }}</td>
                    <td>{{ dataItem.std_mat_quantity }}</td>
                </tr>
            </tbody>
        </table>
      </div>

      <div>
        <hr style="border: 1px solid #ccc; margin: 10px 0;">

        <button v-if="isUser && stdMatData.length > 0" @click="toggleAppraise"
          class="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded mt-4">
          <!-- <button @click="toggleAppraise" class="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded mt-4"> -->
          ส่งคำร้องว่าจ้าง
        </button>


        <button @click="togglePlanhomeFormforUser"
        class="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded ml-4">
            ดาวน์โหลด PDF แบบบ้าน
          </button>




        <!-- <div v-if="showPlanhomeForm" class="bg-white p-8 rounded-lg mt-4">
        <form>
          <div class="table-container">
            <table class="table-fixed">
              <thead>
                <tr>
                  <th>รายละเอียดไฟล์</th>
                  <th>สเกล</th>
                  <th>EDIT</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in planhomeData" :key="item.planhome_id">
                  <td>{{ item.planhome_details }}</td>
                  <td>{{ item.planhome_scale }}</td>
                  <td>
                    <i class="fa-solid fa-trash-can fa-2xl" style="color: #ff0000;" @click="confirmPDFdelete(item)"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-end mt-4">
            <button @click.prevent="togglePlanhomeForm"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              ปิด
            </button>
            <button @click.prevent="showModal = !showModal"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
              เพิ่มไฟล์
            </button>
          </div>
        </form>
      </div> -->





        <a :href="rowData.filehome_3d_url" target="_blank">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            โมเดล 3 มิติ
          </button>
        </a>
      </div>


      <!-- The different form section -->
      <div v-if="showPlanhomeFormforUser" class="bg-white p-8 rounded-lg mt-4">
        <form>
          <div class="table-container">
            <table class="table-fixed">
              <thead>
                <tr>
                  <th>รายละเอียดไฟล์</th>
                  <th>สเกล</th>
                  <th>ดาวน์โหลด</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in planhomeData" :key="item.planhome_id">
                  <td>{{ item.planhome_details }}</td>
                  <td>{{ item.planhome_scale }}</td>
                  <td>
                    <i class="fa-solid fa-download fa-2xl" style="color: #00c220;" @click="downloadplanhomePdf(item.planhome_pdf)"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-end mt-4">
            <button @click.prevent="togglePlanhomeFormforUser"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              ปิด
            </button>
          </div>
        </form>
      </div>


      <div v-if="showAppraise" class="bg-white p-8 rounded-lg mt-4">
        <form>

            <!-- <h2 class="text-xl font-bold">เลือกจำนวนงวดงาน</h2>
            <div class="radio-container">
              <input type="radio" id="3period" name="hire_period" value="3" v-model="formData.hire_period">
              <label for="3period">3 งวด</label><br>
              <input type="radio" id="6period" name="hire_period" value="6" v-model="formData.hire_period">
              <label for="6period">6 งวด</label><br>
              <input type="radio" id="9period" name="hire_period" value="9" v-model="formData.hire_period">
              <label for="9period">9 งวด</label><br>
              <input type="radio" id="12period" name="hire_period" value="12" v-model="formData.hire_period">
              <label for="12period">12 งวด</label><br><br>
            </div> -->

            <h2 class="text-xl font-bold">เลือกเกรดวัสดุบ้าน</h2>
            <div class="radio-container">
              <input type="radio" id="gradeA" name="home_grade" value="A" v-model="formData.home_grade">
              <label for="gradeA">เกรด A</label><br>
              <input type="radio" id="gradeB" name="home_grade" value="B" v-model="formData.home_grade">
              <label for="gradeB">เกรด B</label><br>
              <input type="radio" id="gradeC" name="home_grade" value="C" v-model="formData.home_grade">
              <label for="gradeC">เกรด C</label><br><br>
            </div>

            สถานที่สร้าง
            <textarea v-model="formData.building_location" id="building_location" name="building_location" rows="4"
              cols="50" v-bind:required="true"></textarea>
            <div v-if="showAppraiseError" class="text-red-500 mt-2">กรุณากรอกสถานที่สร้าง</div>

            <div class="flex justify-end mt-4">
              <button @click="submitAppraise"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
                ทำการประเมิน
              </button>
              <button @click="toggleAppraise" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Close
              </button>
            </div>




        </form>
      </div>


    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  computed: {
    ...mapState(['currentUser']),
    pdfURL() {
      return `http://localhost:3001/get_pdf/${this.rowData.filehome_id}`;
    },
    isEmployee() {
      // Assuming you have a getter function to retrieve the current user's role
      return !!this.$store.getters.getCurrentEmployee;
    },
    isUser() {
      // Assuming you have a getter function to retrieve the current user's role
      return !!this.$store.getters.getCurrentUser;
    },
    totalPages() {
      return Math.ceil(this.std_mat.length / this.itemsPerPage);
    },
    paginatedStdMat() {
      const startIdx = (this.currentPage - 1) * this.itemsPerPage;
      const endIdx = startIdx + this.itemsPerPage;
      return this.std_mat.slice(startIdx, endIdx);
    },
    isChecked() {
      return (item) => {
        const stdMat = this.stdMatData.find((dataItem) => dataItem.std_mat_name === item.mat_name);
        if (stdMat) {
          // If stdMat exists, populate the input with std_mat_quantity from std_material
          item.matQuantity = stdMat.std_mat_quantity;
          return true; // Return true to set the checkbox as checked
        } else {
          // If stdMat does not exist, set a default value (e.g., 0) for the input
          item.matQuantity = 0;
          return false; // Return false to set the checkbox as unchecked
        }
      };
    },
  },
  mounted() {
    console.log('Current User:', this.currentUser);

  },
  data: () => ({
    showModal: false,
    itemsPerPage: 5,
    filehome_imgs: {},
    showForm: false,
    planhomeData: [],
    showAppraise: false,
    showPlanhomeFormforUser: false,
    showPlanhomeForm: false,
    stdmatSelect: '',
    materials: [],
    showAppraiseError: false,
    std_mat: [],
    formData: {
      matGrade: '',
      build_location: '',
    },
    rowData: '',
    stdMatData: [],
    differentFormVisible: false,
    differentFormStdMatData: [],
    pdfData: null, // Add this line to declare the pdfData property and initialize it as null
    pages: [], // Initialize with an empty array
    currentPage: 1, // Initialize with the default value (e.g., 1)
    numPages: 0, // Initialize with the default value (e.g., 0)    
  }),

  created() {

    if (this.$route.query.rowData) {
      try {
        this.rowData = JSON.parse(this.$route.query.rowData);
        this.filehome_imgs = this.rowData.filehome_imgs;
        this.fetchMaterials();
        this.fetchStdMaterialsData();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.warn("Query parameter 'rowData' is missing or empty. Setting default rowData.");
      this.rowData = {
        filehome_id: 'default_id',
        filehome_details: 'Default details',
        filehome_imgs: 'varinthorncc.png',
      };
      this.filehome_imgs = 'varinthorncc.png';
    }
  },

  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      this.pdfFile = event.target.files[0];
      console.log('Selected File:', this.selectedFile); // Add this line to check the selectedFile value
    },
    confirmAddPdf(item) {
      this.$swal.fire({
        title: 'ยืนยัน',
        text: "ยืนยันการเพิ่มไฟล์ PDF หรือไม่",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ยืนยัน'
      }).then((result) => {
        if (result.isConfirmed) {
          this.uploadFile(item)
          this.$swal.fire(
            'ทำการเพิ่ม',
            'ทำการเพิ่มไฟล์เสร็จสิ้น',
            'success'
          )
        }
      })
    },
    async uploadFile() {
      try {
        console.log('Selected File:', this.selectedFile);

        if (!this.selectedFile) {
          console.error('No file selected.'); // Handle the case when no file is selected
          return;
        }

        const formData = new FormData();
        formData.append('pdfFile', this.selectedFile);
        formData.append('filehomeId', this.rowData.filehome_id);
        formData.append('planhomeDetails', this.planhome_details);
        formData.append('planhomeScale', this.planhome_scale);
        formData.append('usePdffileFolder', true); // Change this to 'true'

        const response = await axios.post('http://localhost:3001/phINSERTPDF', formData);

        console.log('File uploaded successfully.');
        location.reload()

        // Handle the response as needed
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle the error as needed
      }
    },
    confirmPDFadd(item) {
      this.$swal.fire({
        title: 'ยืนยันการลบ',
        text: "ต้องการลบไฟล์หรือไม่",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deletePDF(item)
          this.$swal.fire(
            'ยืนยัน',
            'ทำการลบไฟล์แล้ว',
            'success'
          )
        }
      })
    },
    confirmPDFdelete(item) {
      this.$swal.fire({
        title: 'ยืนยันการลบ',
        text: "ต้องการลบไฟล์หรือไม่",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          this.deletePDF(item)
          this.$swal.fire(
            'ยืนยัน',
            'ทำการลบไฟล์แล้ว',
            'success'
          )
        }
      })
    },
    deletePDF(item) {
      axios.delete(`http://localhost:3001/planhome/${item.planhome_id}`)
        .then(response => {
          // Remove the deleted item from the array
          this.planhome = this.planhome.filter(data => data.planhome_id !== item.planhome_id);
          console.log('Item deleted:', item.planhome_id);
        })
        .catch(error => {
          console.error(error);
          location.reload()
        });
    },
    stdMatconfirm() {
      const swalWithBootstrapButtons = this.$swal.mixin({
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: true
      })

      swalWithBootstrapButtons.fire({
        text: "ยืนยันการเพิ่มวัสดุหรือไม่",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'ยืนยัน',
            'ยืนยันการเพิ่มวัสดุแล้ว',
            'success'
          ),
            this.submitForm()
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === this.$swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'ยกเลิก',
            'ยกเลิกการเพิ่มวัสดุแล้ว',
            'error'
          )
        }
      })
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    closeDifferentForm() {
      // Set differentFormVisible to false to hide the form
      this.differentFormVisible = false;
    },
    async toggleForm() {
      console.log('toggleForm called');

      try {
        const response = await axios.get(`http://localhost:3001/std_material/${this.rowData.filehome_id}`);
        const stdMatData = response.data;

        this.std_mat.forEach(item => {
          const stdMat = stdMatData.find((dataItem) => dataItem.std_mat_name === item.mat_name);
          if (stdMat) {
            item.hasMat = true; // Set hasMat to true for checked materials
            item.matQuantity = stdMat.std_mat_quantity; // Populate the input with std_mat_quantity
          } else {
            item.hasMat = false; // Set hasMat to false for unchecked materials
            item.matQuantity = 0; // Set a default value for the input
          }
        });

        // Toggle the form visibility
        this.showForm = !this.showForm;
      } catch (error) {
        console.error('Error fetching std_material data:', error);
      }
    },
    toggleAppraise() {
      this.showAppraise = !this.showAppraise;
      console.log(this.stdMatData)
    },
    togglePlanhomeForm() {
      this.showPlanhomeForm = !this.showPlanhomeForm;
      if (this.showPlanhomeForm) {
        this.fetchPlanhomeData();
      }
    },
    togglePlanhomeFormforUser() {
      this.showPlanhomeFormforUser = !this.showPlanhomeFormforUser;
      if (this.showPlanhomeFormforUser) {
        this.fetchPlanhomeData();
      }
    },
    getImageUrl(filename) {
      return `http://localhost:3001/images/${filename}`;
    },
    async fetchMaterials() {
      try {
        const response = await axios.get(`http://localhost:3001/material`);
        this.std_mat = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPlanhomeData() {
      try {
        const response = await axios.get(`http://localhost:3001/planhome/${this.rowData.filehome_id}`);
        this.planhomeData = response.data;
      } catch (error) {
        console.error('Error fetching planhome data:', error);
      }
    },
    async fetchStdMaterialsData() {
      try {
        const response = await axios.get(`http://localhost:3001/std_material/${this.rowData.filehome_id}`);
        this.stdMatData = response.data;
        console.log('Fetched std_material data:', this.stdMatData);
      } catch (error) {
        console.error('Error fetching std_material data:', error);
      }
    },
    async submitForm() {

      try {
        await this.deleteOldData(this.rowData.filehome_id);

        const selectedData = this.std_mat.filter(item => item.hasMat);
        const matData = selectedData.map(item => ({
          matId: this.rowData.filehome_id,
          stdmatId: item.mat_id,
          stdmatName: item.mat_name,
          stdmatQuantity: item.matQuantity,
        }));
        const response = await axios.post('http://localhost:3001/stdmatINSERT', matData);
        console.log(matData);
        location.reload()

      } catch (error) {
        console.error('Error submitting form data:', error);
      }
    },

    async deleteOldData(filehomeId) {
      try {
        await axios.delete(`http://localhost:3001/stdmaterial/${filehomeId}`);
        console.log('Deleted old data for filehome_id:', filehomeId);
      } catch (error) {
        console.error('Error deleting old data:', error);
      }
    },
    async submitAppraise() {
      event.preventDefault();
      try {
        if (!this.formData.building_location) {
          this.showAppraiseError = true; // Show the error message
          return; // Prevent form submission
        }
        this.showAppraiseError = false; // Hide the error message


        this.$swal.fire({
          title: 'ยืนยันการส่งคำร้อง',
          text: "ยืนยันการส่งคำร้องหรือไม่",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ยืนยัน',
          cancelButtonText: 'ยกเลิก',
        }).then((result) => {
          if (result.isConfirmed) {
            try {
              // Prepare the data to be sent to the /hireinsert endpoint
              const hireData = {
                home_grade: this.formData.home_grade,
                building_location: this.formData.building_location,
                period: this.formData.hire_period,
                filehome_id: this.rowData.filehome_id,
                uId: this.currentUser.u_id,
              };
              console.log(hireData); // <-- Make sure this data is correct and complete

              // Send the data directly without nesting it under a 'hireData' property
              const response = axios.post('http://localhost:3001/hireinsert', hireData);

              console.log('Successfully submitted data:', response.data);
              this.$router.replace('/Account');
            } catch (error) {
              console.error('Error submitting data:', error);
            }
          }
        })


      } catch (error) {
        console.error('Error submitting data:', error);
      }
    },



    async downloadPdf() {
      try {
        // Fetch all planhome data
        const response = await axios.get('http://localhost:3001/planhome');
        const planhomeData = response.data;

        // Filter out the rows with the matching filehome_id
        const matchingRows = planhomeData.filter((planhome) => planhome.filehome_id === this.rowData.filehome_id);

        // Iterate through the matching rows and download each associated PDF
        for (const planhome of matchingRows) {
          const pdfResponse = await axios.get(`http://localhost:3001/get_pdf/${planhome.planhome_pdf}`, {
            responseType: 'arraybuffer',
          });

          // Create a blob with the PDF data
          const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });

          // Generate a temporary URL for the blob
          const pdfUrl = URL.createObjectURL(pdfBlob);

          // Create an anchor element to trigger the download
          const downloadLink = document.createElement('a');
          downloadLink.href = pdfUrl;
          downloadLink.download = `${planhome.planhome_pdf}.pdf`; // Set the desired filename for the download

          // Simulate a click on the anchor element to trigger the download
          downloadLink.click();

          // Clean up by revoking the object URL
          URL.revokeObjectURL(pdfUrl);
        }
      } catch (error) {
        console.error('Error downloading PDF:', error);
      }
    },

    async downloadplanhomePdf(planhome_pdf) {
      try {

        const pdfResponse = await axios.get(`http://localhost:3001/get_pdf/${planhome_pdf}`, {
          responseType: 'arraybuffer',
        });

        // Create a blob with the PDF data
        const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });

        // Generate a temporary URL for the blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Create an anchor element to trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = `${planhome_pdf}.pdf`; // Set the desired filename for the download

        // Simulate a click on the anchor element to trigger the download
        downloadLink.click();

        // Clean up by revoking the object URL
        URL.revokeObjectURL(pdfUrl);
      }


      catch (error) {
        console.error('Error downloading PDF:', error);
      }

    },
  },
};
</script>

<style>
td {
  text-align: center;
}

input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 40px;
  height: 16px;
  border: 2px solid #ccc;
  border-radius: 3px;
  outline: none;
  margin-right: 5px;
  vertical-align: middle;
  cursor: pointer;
}

/* Add custom styles for the checked state of the checkbox */
input[type="checkbox"]:checked {
  background-color: #0076bb;
  border: 2px solid #0076bb;
}

/* Add custom styles for radio buttons */
input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-radius: 50%;
  /* Make it round */
  outline: none;
  margin-right: 5px;
  vertical-align: middle;
  cursor: pointer;
  position: relative;
}

/* Add custom styles for the checked state of the radio button */
input[type="radio"]:checked::before {
  content: "";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 8px;
  height: 8px;
  background-color: #0076bb;
  border-radius: 50%;
}

/* Style the container to keep radio buttons in the same row using flex */
.radio-container {
  display: flex;
  align-items: center;
}

/* Add spacing between radio buttons and labels */
.radio-container label {
  margin-right: 15px;
}



/* Add custom styles for the label (optional) */
label {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

/* Optional: Style for the modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Optional: Style for the modal */
.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

/* Optional: Style for the close button */
.modal button {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.border {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
}
</style>
