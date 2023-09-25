<template>
    <section class="w-full h-screen">
        <div class="text-center grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
            <div class="col-start-1 ">
                <div class="pt-20"><img :src="defaultImageURL" class="h-100 mr-100" alt="Varinthorn Logo" /></div>
            </div>
            <div class="col-start-2">
                <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">เพิ่มแบบบ้าน</div>
                <form ref="uploadForm" @submit.prevent="confirmAlert()">
                    <div class="form-control">
                        <label for="ชื่อวัสดุ">ชื่อวัสดุ</label>
                        <input v-model="mat_name" id="mat_name" name="mat_name" type="text" placeholder="ชื่อวัสดุ" />
                    </div>
                    <div class="form-control">
                        <label for="รายละเอียดวัสดุ">รายละเอียดวัสดุ</label>
                        <input v-model="mat_details" id="mat_details" name="mat_details" type="text"
                            placeholder="รายละเอียดวัสดุ" />
                    </div>
                    <div class="form-control">
                        <label for="หน่วยนับ">หน่วยนับ</label>
                        <input v-model="mat_unit" id="mat_unit" name="mat_unit" type="text" placeholder="หน่วยนับ" />
                    </div>
                    <div class="form-control">
                        <label for="ราคาเกรด A">ราคาเกรด A</label>
                        <input v-model="mat_gradeA" id="mat_gradeA" name="mat_gradeA" type="text"
                            placeholder="ราคาเกรด A" />
                    </div>
                    <div class="form-control">
                        <label for="ราคาเกรด B">ราคาเกรด B</label>
                        <input v-model="mat_gradeB" id="mat_gradeB" name="mat_gradeB" type="text"
                            placeholder="ราคาเกรด B" />
                    </div>
                    <div class="form-control">
                        <label for="ราคาเกรด C">ราคาเกรด C</label>
                        <input v-model="mat_gradeC" id="mat_gradeC" name="mat_gradeC" type="text"
                            placeholder="ราคาเกรด C" />
                    </div>

                    <div>
                        <button type="submit">เพิ่ม</button>
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
            mat_name: "",
            mat_details: "",
            mat_unit: "",
            mat_gradeA: "",
            mat_gradeB: "",
            mat_gradeC: "", // Change the default value to null
        };
    },
    methods: {
        confirmAlert() {
            if (confirm("Are you sure you want to upload this file?")) {
                // Proceed with form submission if confirmed
                this.uploadFile();
            }
        },
        async uploadFile() {
            try {
                if (!this.currentEmployee) {
                    console.error('User not logged in.');
                    return;
                }
                const token = localStorage.getItem('accessToken');
                console.log('Token:', token);
                const formData = new FormData(this.$refs.uploadForm);

                const data = {
                    matName: this.mat_name,
                    matDetails: this.mat_details,
                    matUnit: this.mat_unit,
                    matgradeA: this.mat_gradeA,
                    matgradeB: this.mat_gradeB,
                    matgradeC: this.mat_gradeC,
                };

                const response = await axios.post('http://localhost:3001/matINSERT', data, {
                });

                if (response.status === 201) {
                    console.log('Filehome inserted successfully.');
                    this.$router.replace("/Account");
                    // Handle the success case if needed
                } else {
                    console.error('Failed to insert filehome.');
                    // Handle the error case if needed
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                // Handle the error case if needed
            }
        }


    },
    mounted() {
        console.log("Component mounted!"); // Log for debugging
        // Fetch the options when the component is mounted
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