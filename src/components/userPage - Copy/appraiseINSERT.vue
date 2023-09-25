<template>
  <section class="w-full h-screen">
    <div class="grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
      <div class="col-start-1 ">
        <div class="pt-5 text-4xl text-center underline underline-offset-8 decoration-red-500">รายละเอียดการว่าจ้าง</div>
        <form @submit.prevent="uploadFile">
          <div class="form-control">
            <img :src="getImageUrl(filehomeData.filehome_imgs)"
              style="width: 600px; height: 300px; border: 2px solid #000; border-radius: 8px; ">
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
            <label>วัสดุที่ใช้ในบ้าน</label>
            <div v-for="item in stdData" :key="item.std_mat_id">
              {{ item.std_mat_name }} x {{ item.std_mat_quantity }}
            </div>
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

          <div class="form-control">
            <label for="ค่ารับเหมา">ค่ารับเหมา</label>
            <input v-model="ap_wage" id="ap_wage" name="ap_wage" type="number" placeholder="ค่ารับเหมา" />
          </div>

          <div>
            <button @click="confirmAppraise" type="submit">ยืนยันการประเมินราคา</button>
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
          this.generatePdf(this.ap_wage); // Pass the ap_wage value as an argument
          this.$router.push({ path: '/Account'})
        }
      })
    },
    async fetchHire(hire_id) {
      const hireId = this.$route.params.hire_id;
      console.log('Fetching hire data for hire_id:', hireId);
      try {
        const response = await axios.get(`http://localhost:3001/hire/${hireId}`);
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
        this.stdData = response.data; // Assign the fetched data to filehomeData
        console.log('Fetched stdData data:', this.stdData);
        this.fetchMaterial();
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
    async fetchMaterial() {
      try {
        // Create an array of promises for fetching material data
        const materialPromises = this.stdData.map(async (item) => {
          const mat_name = item.std_mat_name;
          console.log('Fetching mat data for mat:', mat_name);

          const response = await axios.get(`http://localhost:3001/material/${mat_name}`);
          console.log('Response from /material/:mat_name:', response.data);
          return response.data; // Return the material data
        });

        // Wait for all promises to resolve and get the material data
        const materialDataArray = await Promise.all(materialPromises);

        // Assuming you want to store the material data in the matData array
        this.matData = materialDataArray;
        console.log('Fetching Mat Data Array', this.matData);
      } catch (error) {
        console.error('Error fetching material data:', error);
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
    async generatePdf(ap_wage) {
      try {
        // Assuming you have the data you want to send in the following variables:
        const EmName = this.currentEmployee.em_name;
        const EmId = this.currentEmployee.em_id;
        const hireData = this.hireData;
        const userData = this.userData;
        const filehomeData = this.filehomeData;
        const stdData = this.stdData;
        const matData = this.matData; // Include matData in the data to be sent

        // Send a POST request with the data in the request body
        const response = await axios.post('http://localhost:3001/generatePdfWithText', {
          EmName: EmName,
          EmId: EmId,
          hireData: hireData,
          userData: userData,
          filehomeData: filehomeData,
          stdData: stdData,
          matData: matData,
          ap_wage: ap_wage, // Include the ap_wage value in the request body
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
  border-radius: 15px; /* Reduced border radius */
}

button:hover,
button:active {
  border-color: #291700;
  background-color: #291700;
}
</style>