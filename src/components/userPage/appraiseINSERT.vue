<template>
  <section class="w-full h-screen">
    <div class="grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
      <div class="col-start-1 ">
        <div class="pt-5 text-4xl text-center underline underline-offset-8 decoration-red-500">รายละเอียดการว่าจ้าง</div>
        <form @submit.prevent="uploadFile">
          <div class="form-control">
            <div v-if="!filehomeData || !isValidJSON(filehomeData.filehome_imgs)">
              Loading....
            </div>
            <div v-else>
              <img :src="getImageUrl(JSON.parse(filehomeData.filehome_imgs)[0])"
                style="width: 600px; height: 300px; border: 2px solid #000; border-radius: 8px;">
            </div>
          </div>
          <div class="form-control">
            <label>รหัสการว่าจ้าง :</label> {{ hireData.hire_id }}
          </div>

          <div>
            <label>ชื่อผู้ส่งคำร้อง :</label> {{ userData.u_name }}
          </div>


          <div class="form-control">
            <label>ชื่อแบบบ้าน :</label> {{ filehomeData.filehome_name }}
          </div>
          <div class="form-control">
            <label>รหัสแบบบ้าน :</label> {{ hireData.filehome_id }}
          </div>
          <div class="form-control">
            <label>ราคาเริ่มต้น :</label> {{ filehomeData.filehome_price }}
          </div>
          <div class="form-control">
            <label> รายละเอียดแบบบ้าน :</label> {{ filehomeData.filehome_details }}
          </div>
          <div class="form-control">
            <label>สถานที่ก่อสร้าง :</label> {{ hireData.hire_location }}
          </div>
          <div class="form-control">
            <label>เกรดวัสดุ :</label> {{ hireData.hire_grade }}
          </div>



          <div v-if="stdData.length > 0">
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
                <tr v-for="item in stdData" :key="item.std_mat_id">
                  <td>{{ item.std_mat_name }}</td>
                  <td>{{ item.std_mat_quantity }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <!-- Show a message or loading indicator when stdData is not yet available -->
            Loading...
          </div>


          <div class="flex justify-end">
            <button @click="downloadPdf" class="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded ml-4"
              style="margin-right: 10px;">
              ดาวน์โหลด PDF ที่เกี่ยวข้อง
            </button>
          </div>
        </form>
      </div>
      <div class="text-center col-start-2">
        <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">ทำการประเมินราคา</div>

        <form @submit.prevent="uploadFile">

          <!-- Render additional input fields dynamically -->
          <div v-for="(value, index) in apWagesDes" :key="index" class="form-control">
            <div class="input-group"><input v-model="apWagesDes[index]" :name="'ap_wage_des_' + (index + 1)" type="text"
                placeholder="รายละเอียด" /></div>
            <div class="input-group"><input v-model="apWages[index]" :name="'ap_wage_' + (index + 1)" type="number"
                placeholder="จำนวนเงิน" /></div>
            <!-- Button to remove this input field -->
          </div>

          <div>
            <button @click="confirmAppraise" type="submit">ยืนยันการประเมินราคา</button><button
              @click="addApWageField">เพิ่มกล่องข้อความ</button><button @click="removeApWageField(index)">ลบ</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
  
  
  
<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { PDFDocument, rgb } from 'pdf-lib';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autotable plugin for tabular data
import NotoSansThaiRegular from '../userPage/NotoSansThai-Regular.ttf'



export default {
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  computed: {
    ...mapState(['currentEmployee']),
  },

  data() {
    return {
      defaultImageURL: 'http://localhost:3001/images/varinthorncc.png',
      selectedFile: null,
      selectedOption: '',
      options: [],
      stdData: [],
      userData: [],
      u_name: "",
      u_id: "",
      ap_wage: "",
      ap_wage_des: "", // Store the first value
      apWages: [],
      apWagesDes: [], // Store additional values
      hire_grade: "",
      hire_id: this.$route.params.hire_id,
      hire_data: "",
      hireData: [],
      materialData: "",
      filehomeData: [],
      matData: [], // Add filehomeData property and initialize it as an empty array
      filehome_details: "",
    };
  },
  methods: {
    addApWageField() {
      this.apWagesDes.push(""); // Add an empty string to the array
    },
    removeApWageField(index) {
      this.apWagesDes.splice(index, 1); // Remove the value at the specified index
    },
    isValidJSON(jsonString) {
      try {
        JSON.parse(jsonString);
        return true;
      } catch (error) {
        return false;
      }
    },
    getImageUrl(filename) {
      return `http://localhost:3001/images/${filename}`;
    },
    confirmAppraise() {
      this.$swal.fire({
        title: 'ยืนยัน',
        text: 'ยืนยันการประเมินราคา',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          this.generatePdf(this.apWagesDes, this.apWages);
          this.$router.replace("/Account");
          // this.$router.push({ path: '/Account' })
        }
      })
    },
    async fetchHire(hire_id) {
      const hireId = this.$route.params.hire_id;
      console.log('Fetching hire data for hire_id:', hireId);
      try {
        const response = await axios.get(`http://localhost:3001/hirehid/${hireId}`);
        this.hireData = response.data; // Assign response.data to hireData property
        console.log(this.hireData);
        this.fetchFilehome();
        this.fetchStdMat();
        this.fetchUData();
      } catch (error) {
        console.error('Error fetching hire data:', error);
      }
    },
    async fetchFilehome() {
      const filehome_id = this.hireData.filehome_id; // Access hireData using this.hireData
      console.log('Fetching filehome data for filehome_id:', filehome_id);

      try {
        const response = await axios.get(`http://localhost:3001/filehome/${filehome_id}`);
        this.filehomeData = response.data; // Assign the fetched data to filehomeData
        console.log('Fetched filehome data:', this.filehomeData);


      } catch (error) {
        console.error('Error fetching filehome data:', error);
      }
    },
    async fetchStdMat() {
      const filehome_id = this.hireData.filehome_id; // Access hireData using this.hireData
      console.log('Fetching filehome data for filehome_id:', filehome_id);

      try {
        const response = await axios.get(`http://localhost:3001/stdMaterial/${filehome_id}`);
        this.stdData = response.data; // Assign the fetched data to stdData
        console.log('Fetched stdData data:', this.stdData);

        // Check if hireData has the hire_grade property
        if ('hire_grade' in this.hireData) {
          // Fetch the material data for the hire_grade from hireData
          const hire_grade = this.hireData.hire_grade;
          const materialDataForGrade = await this.fetchMaterial(hire_grade);

          // Store the material data for the hire_grade in the matData object
          this.matData = {
            [hire_grade]: materialDataForGrade,
          };
          console.log(`Fetched material data for hire_grade ${hire_grade}:`, materialDataForGrade);

        } else {
          // If hireData does not have the hire_grade property, handle the case accordingly
          console.warn('hireData does not contain the hire_grade property.');
          // You can provide a default value or display an error message if needed.
        }
      } catch (error) {
        console.error('Error fetching stdData data:', error);
      }
    },
    async fetchUData() {
      const u_id = this.hireData.user_id; // Access hireData using this.hireData
      console.log('Fetching user data for u_id:', u_id);

      try {
        const response = await axios.get(`http://localhost:3001/user/${u_id}`);
        this.userData = response.data; // Assign the fetched data to filehomeData
        console.log('Fetched user data:', this.userData);

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async fetchMaterial(hire_grade) {
      try {
        const response = await axios.get('http://localhost:3001/material');
        const materialData = response.data;

        const mat_grade_column = `mat_grade${hire_grade}`;
        const filteredData = materialData.map((material) => ({
          mat_grade: material[mat_grade_column],
          mat_id: material.mat_id,
          mat_unit: material.mat_unit,
          mat_details: material.mat_details,
        }));

        console.log(`Fetched material data for hire_grade ${hire_grade} from ${mat_grade_column}:`, filteredData);

        return filteredData;
      } catch (error) {
        console.error('Error fetching material data:', error);
        throw error;
      }
    },
    async downloadPdf() {
      try {
        // Fetch all planhome data
        const response = await axios.get('http://localhost:3001/planhome');
        const planhomeData = response.data;

        // Filter out the rows with the matching filehome_id
        const matchingRows = planhomeData.filter((planhome) => planhome.filehome_id === this.hireData.filehome_id);

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
    async generatePdf(apWagesDes, apWages) {
      try {
        // Assuming you have the data you want to send in the following variables:
        const EmName = this.currentEmployee.em_name;
        const EmId = this.currentEmployee.em_id;
        const hireData = this.hireData;
        const userData = this.userData;
        const filehomeData = this.filehomeData;
        const stdData = this.stdData;

        // Fetch the matData based on the hire_grade
        const hire_grade = hireData.hire_grade; // Assuming hire_grade is stored in hireData
        const matData = await this.fetchMaterial(hire_grade);

        // Send a POST request with the data in the request body
        const response = await axios.post('http://localhost:3001/generatePdfWithText', {
          EmName: EmName,
          EmId: EmId,
          hireData: hireData,
          userData: userData,
          filehomeData: filehomeData,
          stdData: stdData,
          matData: matData, // Include the fetched matData in the request body
          ap_wages_des: apWagesDes, // Send the apWagesDes array
          ap_wages: apWages,
        });

        console.log('Success generating PDF:', response.data);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    },

  },
  mounted() {
    console.log("Component mounted!");
    this.hire_id = this.$route.params.hire_id;
    this.fetchHire();
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

.form-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-group {
  flex: 1;
  margin-right: 10px;
  /* Add spacing between the input boxes */
}
</style>