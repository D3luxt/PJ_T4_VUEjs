<template>
    <section class="w-full h-screen">
        <div class="text-center grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
            <div class="col-start-1">
                <iframe :src="pdfURL" class="pdf-iframe"></iframe>
            </div>
            <div class="col-start-2">
                <div class="pt-5 text-4xl underline underline-offset-8 decoration-red-500">
                    {{ 'ประเมินค่าแรง' }}
                </div>
                <form @submit.prevent="updateAppraise()">
                    รหัสการประเมินราคา {{ this.ap_id }}<br>
                    รหัสการว่าจ้าง {{ this.hire_id }}
                    <div class="form-control">
                        <label for="ประเมินค่าแรง">ประเมินค่าแรง</label>
                        <input v-model="ap_wage" id="ap_wage" name="ap_wage" type="number" placeholder="ประเมินค่าแรง" />
                    </div>

                    <div>
                        <button type="submit">ทำการประเมิน</button>
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
            ap_wage: '',
            ap_id: '',
            em_id: '',
            ap_date: '',
            hire_id: '',
            pdfURL:'',
            isUpdate: false,
            appraiseIdToUpdate: null,
        };
    },
    methods: {
        async fetchAppraise(ap_id) {
            try {
                console.log('Fetching appraise data for ID:', ap_id);
                const response = await axios.get(`http://localhost:3001/appraise/${ap_id}`);
                const appraiseData = response.data;
                console.log('Fetched appraise data:', appraiseData);

                
                this.ap_id = appraiseData.ap_id;
                this.ap_wage = appraiseData.ap_wage;
                this.ap_date = appraiseData.ap_date;
                this.em_id = appraiseData.em_id;
                this.hire_id = appraiseData.hire_id;
                this.pdfURL = appraiseData.ap_pdf ? `http://localhost:3001/get_apppdf/${appraiseData.ap_pdf}` : null;
                console.log(appraiseData);
            } catch (error) {
                console.error('Error fetching appraise data:', error);
            }
        },

        async updateAppraise() {
            try {
                const updatedData = {
                    ap_wage: this.ap_wage,
                    em_id: this.currentEmployee.em_id,
                };

                if (this.ap_id) { // Corrected the condition to use this.ap_id
                    const response = await axios.put(
                        `http://localhost:3001/appraise/${this.ap_id}`, // Corrected the endpoint URL
                        updatedData
                    );

                    if (response.status === 200) {
                        console.log('Appraise updated successfully.');
                        // Fetch the updated data again
                        this.fetchAppraise(this.ap_id);
                    } else {
                        console.error('Failed to update appraise.');
                    }
                }
            } catch (error) {
                console.error('Error updating appraise:', error);
            }
        }
    },
    mounted() {
        const appraiseIdToUpdate = this.$route.params.ap_id; // Corrected the variable name
        console.log(appraiseIdToUpdate);
        this.fetchAppraise(appraiseIdToUpdate);
    },
};
</script>
  
<style>
.pdf-iframe {
  /* Set the height and width to increase the size of the iframe */
  height: 600px;
  width: 700px;
}

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




