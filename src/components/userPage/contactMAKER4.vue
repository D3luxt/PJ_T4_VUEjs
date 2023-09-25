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

                        <div class="form-control">
                            <label>จำนวนงวด :</label> {{ hireData.hire_period }}
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
                <form @submit.prevent="">


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
                    <hr style="border: 1px solid #ccc; margin: 10px 0;">
                    <h2 class="text-xl font-bold">เลือกจำนวนงวดงาน</h2>
                    <div class="radio-container">
                        <input type="radio" id="3period" name="hire_period" value="3" v-model="selectedOption" />
                        <label for="3period">3 งวด</label><br />

                        <input type="radio" id="6period" name="hire_period" value="6" v-model="selectedOption" />
                        <label for="6period">6 งวด</label><br>

                        <input type="radio" id="9period" name="hire_period" value="9" v-model="selectedOption" />
                        <label for="9period">9 งวด</label><br>

                        <input type="radio" id="12period" name="hire_period" value="12" v-model="selectedOption" />
                        <label for="12period">12 งวด</label><br><br>

                    </div>

                    <div v-for="(value, index) in work_period" :key="index" class="form-control"
                        v-if="index < selectedOption">
                        <div class="input-group">
                            <input v-model="work_period[index]" :name="'work_period_' + (index + 1)" type="text"
                                placeholder="รายละเอียดงวด" />
                        </div>
                    </div>


                    <div style="text-align: center;margin-top: 20px;">
                        <button @click="uploadFile" type="submit">ยืนยันการทำสัญญา</button>
                        <!-- <button @click="addApWageField">เพิ่มกล่องข้อความ</button>
                        <button @click="removeApWageField(index)">ลบ</button> -->

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
            options: [],
            ct_date_e: '',
            em_id: '',
            em_name: '',
            com_name_thai: '',
            com_tel: '',
            index: '',
            com_address: '',
            hire_id: '',
            appraiseData: [],
            hireData: [],
            filehomeData: [],
            company_data: [],
            stdData: [],
            pdfURL: null,
            showPDFURL: true,
            selectedOption: '', // Initialize to an empty string or the default value you prefer
            work_period: [], // Initialize as an empty array
        };
    },
    watch: {
        selectedOption: function (newOption) {
            // Update the work_period array based on the selected option
            const numberOfPeriods = parseInt(newOption); // Parse the selected option to an integer
            this.work_period = Array(numberOfPeriods).fill('');
        },
    },
    methods: {
        addApWageField() {
            this.work_period.push(""); // Add an empty string to the array
        },
        removeApWageField(index) {
            this.work_period.splice(index, 1); // Remove the value at the specified index
        },
        isValidJSON(jsonString) {
            try {
                JSON.parse(jsonString);
                return true;
            } catch (error) {
                return false;
            }
        },
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
                const response = await axios.get(`http://localhost:3001/hirehid/${hire_id}`);
                this.hireData = response.data;
                console.log('Fetched hire data:', this.hireData);
                console.log('Fetched filehome_id:', this.hireData.filehome_id);
                this.fetchApparise();
                this.fetchFilehome();
                this.fetchStdMat();
                this.fetchCustomer();
            } catch (error) {
                console.error('Error fetching hire data:', error);
            }
        },
        async fetchCustomer() {
            const user_id = this.hireData.user_id;
            console.log('Fetching fetchUser data for user_id:', user_id);
            try {
                const response = await axios.get(`http://localhost:3001/userhire/${user_id}`);
                this.userData = response.data;
                console.log('Fetched userhire data:', this.userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
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
        async fetchcompany_data() {
            try {
                const response = await axios.get(`http://localhost:3001/company`);
                console.log('Response from fetchcompany_data:', response.data); // Log the response data
                this.company_data = response.data;
                console.log('Fetched company data:', this.company_data);
            } catch (error) {
                console.error('Error fetching company data:', error);
            }
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

                        const hire_id = this.$route.params.hire_id;
                        const ct_date_s = this.ct_date_s;
                        const ct_date_e = this.ct_date_e;
                        const ct_quantity = this.hireData.hire_period;
                        const ct_period = this.calculateDateDifference(); // Call the method without passing any arguments
                        const em_name = this.currentEmployee.em_name;
                        const com_name_thai = this.company_data.com_name_thai;
                        const com_tel = this.company_data.com_tel;
                        const com_address = this.company_data.com_address;
                        const filehome_name = this.filehomeData.filehome_name;
                        const hire_location = this.hireData.hire_location;
                        const u_name = this.userData.u_name;
                        const u_phone = this.userData.u_phone;
                        const work_period = this.work_period;
                        const hire_period = this.selectedOption;
                        console.log(com_name_thai, com_address, com_tel,ct_period);

                        const response = await axios.post('http://localhost:3001/generateContractPDF', {
                            hire_id: hire_id,
                            ct_date_s: ct_date_s,
                            ct_date_e: ct_date_e,
                            hire_period: hire_period,
                            ct_quantity: ct_quantity,
                            ct_period: ct_period,
                            em_name: em_name,
                            com_name_thai: com_name_thai,
                            com_tel: com_tel,
                            com_address: com_address,
                            filehome_name: filehome_name,
                            hire_location: hire_location,
                            u_name: u_name,
                            u_phone: u_phone,
                            work_period: work_period,

                        });

                        // if (response.status === 201) {
                        //     console.log('Filehome inserted successfully.');
                        //     const updateHireStatusResponse = await axios.put(
                        //         `http://localhost:3001/hirestatus/${this.$route.params.hire_id}`,
                        //         { hire_status: 'ทำการสร้างสัญญาเรียบร้อย' },
                        //     );

                        //     if (updateHireStatusResponse.status === 200) {
                        //         console.log('hire_status updated successfully.');
                        //     } else {
                        //         console.error('Failed to update hire_status.');
                        //     }

                        //     this.$router.replace("/Account");
                        // } else {
                        //     console.error('Failed to insert filehome.');
                        // }
                    } catch (error) {
                        console.error('Error uploading file:', error);
                    }
                }
            })
        },
    },
    async mounted() {
        console.log("Component mounted!");
        try {
            await this.fetchcompany_data();
            this.fetchHire(); // Now that company data is available, you can call fetchHire.
        } catch (error) {
            console.error('Error fetching company data:', error);
        }
    }
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
  
    