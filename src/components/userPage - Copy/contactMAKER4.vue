<template>
    <section class="w-full h-screen">
        <div class="grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
            <div name="PDFURL" v-if="showPDFURL">
                <div class="col-start-1" v-if="pdfURL">
                    <iframe :src="pdfURL" class="pdf-iframe"></iframe>
                </div>
            </div>
            <div name="FILEDATA" v-else>
                <div class="col-start-1 ">
                    <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">
                        รายละเอียดการว่าจ้าง
                    </div>
                    <form @submit.prevent="uploadFile">
                        <div class="form-control">
                            <img :src="getImageUrl(filehomeData.filehome_imgs)"
                                style="width: 600px; height: 300px; border: 2px solid #000; border-radius: 8px; ">
                        </div>
                        <div class="form-control">
                            <label>รหัสการว่าจ้าง :</label> {{ hireData.hire_id }}
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
                            Loading...
                        </div>

                        <div class="flex justify-end">
                            <button @click="downloadPdf"
                                class="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded ml-4"
                                style="margin-right: 10px;">
                                ดาวน์โหลด PDF ที่เกี่ยวข้อง
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="text-center col-start-2">
                <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">ทำสัญญาว่าจ้าง
                    {{ $route.params.hire_id }}
                </div>
                <form @submit.prevent="uploadFile">
                    <div class="form-control">
                        <label for="รหัสว่าจ้าง">รหัสว่าจ้าง</label>
                    </div>

                    <div class="form-control">
                        <label for="วันที่เริ่มต้นก่อสร้าง">วันที่เริ่มต้นก่อสร้าง</label>
                        <input v-model="ct_date_s" id="ct_date_s" name="ct_date_s" type="date"
                            placeholder="วันที่เริ่มต้นก่อสร้าง" :min="getTodayDate()" />
                    </div>

                    <div class="form-control">
                        <label for="วันสิ้นสุดการก่อสร้าง">วันสิ้นสุดการก่อสร้าง</label>
                        <input v-model="ct_date_e" id="ct_date_e" name="ct_date_e" type="date"
                            placeholder="วันสิ้นสุดการก่อสร้าง" :min="getTodayDate()" />
                    </div>

                    <div class="form-control" style="display: grid; grid-template-columns: auto auto 1fr;">
                        <label for="จำนวนงวด">จำนวนงวด</label>
                        <div>
                            <select v-model="ct_quantity" id="ct_quantity" name="ct_quantity"
                                style="width: 5em; padding: 0.5rem;">
                                <option value="6">6</option>
                                <option value="9">9</option>
                                <option value="12">12</option>
                            </select>
                        </div>
                        <div style="text-align: right;">
                            <button type="submit">ยืนยันการทำสัญญา</button>
                        </div>
                    </div>
                </form>
                <button @click="toggleFileData">โชว์ไฟล์ PDF หรือ ข้อมูลแบบบ้าน</button>
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
            selectedFile: null,
            selectedOption: '',
            options: [],
            ct_date_e: '',
            em_id: '',
            hire_id: '',
            appraiseData: [],
            hireData: [],
            filehomeData: [],
            stdData: [],
            pdfURL: null,
            showPDFURL: true,
        };
    },
    methods: {
        calculateDateDifference() {
            // Calculate and return the difference between ct_date_s and ct_date_e
            const startDate = new Date(this.ct_date_s);
            const endDate = new Date(this.ct_date_e);
            const differenceInTime = endDate.getTime() - startDate.getTime();
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);
            return differenceInDays;
        },
        async fetchStdMat() {
            const filehome_id = this.hireData.filehome_id;
            console.log('Fetching filehome data for filehome_id:', filehome_id);
            try {
                const response = await axios.get(`http://localhost:3001/stdMaterial/${filehome_id}`);
                this.stdData = response.data;
                console.log('Fetched stdData data:', this.stdData);
            } catch (error) {
                console.error('Error fetching stdData data:', error);
            }
        },
        getImageUrl(filename) {
            return `http://localhost:3001/images/${filename}`;
        },
        toggleFileData() {
            this.showPDFURL = !this.showPDFURL;
        },
        async fetchFilehome() {
            const filehome_id = this.hireData.filehome_id;
            console.log('Fetching filehome data for filehome_id:', filehome_id);
            try {
                const response = await axios.get(`http://localhost:3001/filehome/${filehome_id}`);
                this.filehomeData = response.data;
                console.log('Fetched filehome data:', this.filehomeData);
            } catch (error) {
                console.error('Error fetching filehome data:', error);
            }
        },
        async fetchHire() {
            const hire_id = this.$route.params.hire_id;
            console.log('Fetching hire data for ap_id:', hire_id);
            try {
                const response = await axios.get(`http://localhost:3001/hire/${hire_id}`);
                this.hireData = response.data;
                console.log('Fetched hire data:', this.hireData);
                this.fetchApparise();
                this.fetchFilehome();
                this.fetchStdMat();
            } catch (error) {
                console.error('Error fetching hire data:', error);
            }
        },
        async fetchApparise() {
            const hire_id = this.$route.params.hire_id;
            console.log('Fetching fetchApparise data for ap_id:', hire_id);
            try {
                const response = await axios.get(`http://localhost:3001/appraisehire/${hire_id}`);
                this.appraiseData = response.data;
                console.log('Fetched fetchApparise data:', this.appraiseData);
                this.pdfURL = this.appraiseData.ap_pdf ? `http://localhost:3001/get_apppdf/${this.appraiseData.ap_pdf}` : null;
            } catch (error) {
                console.error('Error fetching fetchApparise data:', error);
            }
        },
        getTodayDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        async uploadFile() {
            this.$swal.fire({
                title: 'ยืนยันการทำสัญญา',
                text: "ต้องการยืนยันการทำสัญญาหรือไม่",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ยืนยัน',
                cancelButtonText: 'ยกเลิก'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const token = localStorage.getItem('accessToken');
                        console.log('Token:', token);
                        const formData = new FormData(this.$refs.uploadForm);
                        const dataForInsertion = [{
                            hire_id: this.$route.params.hire_id,
                            ct_date_s: this.ct_date_s,
                            ct_date_e: this.ct_date_e,
                            ct_quantity: this.ct_quantity,
                            ct_period: this.calculateDateDifference(), // Call the method to get the result
                            em_id: this.currentEmployee.em_id,
                        }];

                        if (!this.ct_date_e) {
                            console.error('End date is empty.');
                            return;
                        }

                        const response = await axios.post('http://localhost:3001/contractinsert', dataForInsertion, {
                            // Other options...
                        });

                        if (response.status === 201) {
                            console.log('Filehome inserted successfully.');
                            const updateHireStatusResponse = await axios.put(
                                `http://localhost:3001/hirestatus/${this.$route.params.hire_id}`,
                                { hire_status: 'ทำการสร้างสัญญาเรียบร้อย' },
                            );

                            if (updateHireStatusResponse.status === 200) {
                                console.log('hire_status updated successfully.');
                            } else {
                                console.error('Failed to update hire_status.');
                            }

                            this.$router.replace("/Account");
                        } else {
                            console.error('Failed to insert filehome.');
                        }
                    } catch (error) {
                        console.error('Error uploading file:', error);
                    }
                }
            })
        },
    },
    mounted() {
        console.log("Component mounted!");
        this.fetchHire();
    },
};
</script>
  
<style scoped>
/* Styles here */
</style>
  

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

.pdf-iframe {
    /* Set the height and width to increase the size of the iframe */
    height: 600px;
    width: 700px;
}
</style>
  
    