<template>
    ยืนยันการประเมินราคา<br>
    <div class="table-container">
        <table class="table-fixed">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>ราคาค่าแรง</th>
                    <th>เอกสารการประเมินราคา</th>
                    <th>ยืนยันการประเมินราคา</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in appraise_data" :key="item.ap_id">
                    <td>{{ item.ap_id }}</td>
                    <td>{{ item.ap_wage }}</td>
                    <td>
                        <a :href="getPDFFileURL(item.ap_pdf)" target="_blank">ดาวน์โหลด</a>
                    </td>

                    <td>
                        <button :disabled="getHireStatus(item.hire_id) !== 'ประเมินเสร็จสิ้น'" @click="openshowApp(item)">
                            {{ 'สถานะ : ' +getHireStatus(item.hire_id) || 'ทำการประเมิน' }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- Custom confirmation modal -->
    <div v-if="showConfirmation" class="confirmation-modal">
        <div class="confirmation-content">
            <div>ยืนยันการประเมินราคาหรือไม่? รหัสการว่าจ้าง</div>
            <div class="buttons">
                <button @click="closeDialog">ปิดหน้าต่าง</button>
                <button @click="cancelAppraisal">ยกเลิกการประเมินราคา</button>
                <button @click="confirmAppraisal">ยืนยันการประเมินราคา</button>
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
        filteredAppraiseData() {
            return this.appraise_data.filter(appraiseItem => {
                const matchingHire = this.hire_data.find(hireItem => appraiseItem.hire_id.toString() === hireItem.hire_id.toString());
                return matchingHire && this.currentUser.u_id === matchingHire.user_id && hire_data.hire_status === 'การประเมินเสร็จสิ้น';
            });
        },
    },
    components: {},
    data() {
        return {
            currentItemToConfirm: null, // Add this line to initialize the currentItemToConfirm property
            showConfirmation: false,
            selectedComponent: 'home', // Default selected component
            appraise_data: [],
            hire_data: [],
        };
    },
    methods: {
        openshowApp(item) {
            this.currentItemToConfirm = item;
            this.showConfirmation = true;
        },

        closeDialog() {
            this.showConfirmation = false;
        },

        // Method to cancel the appraisal
        cancelAppraisal() {
            this.showConfirmation = false;
            this.updateHireStatus("ยกเลิกการประเมิน");
        },

        // Method to confirm the appraisal
        confirmAppraisal() {
            this.showConfirmation = false;
            this.updateHireStatus("ยืนยันการว่าจ้าง");
        },

        // Method to update the hire_status
        updateHireStatus(newStatus) {
            const hireId = this.currentItemToConfirm.hire_id;
            // Make the API call to update the hire_status
            axios
                .put(`http://localhost:3001/hirestatus/${hireId}`, { hire_status: newStatus })
                .then(response => {
                    // Handle the response (optional)
                    console.log(`hire_status updated to: ${newStatus}`);
                    // If you want to update the frontend data, call fetchhire_data again
                    this.fetchhire_data();
                })
                .catch(error => {
                    console.error(error);
                });
        },
        getHireStatus(hireId) {
            const matchingHire = this.hire_data.find(
                hireItem =>
                    hireItem.hire_id.toString() === hireId.toString() &&
                    hireItem.user_id.toString() === this.currentUser.u_id.toString()
            );
            return matchingHire ? matchingHire.hire_status : null;
        },
        getPDFFileURL(filename) {
            // Modify the base URL according to your server's URL
            return `http://localhost:3001/get_apppdf/${filename}`;
        },
        confirmAlert(item) {
            if (confirm('ต้องการยืนยันราคาหรือไม่?')) {
                this.confirmAppraise(item);
            }
        },
        fetchappraise_data() {
            axios
                .get('http://localhost:3001/appraise')
                .then(response => {
                    this.appraise_data = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        fetchhire_data() {
            axios
                .get('http://localhost:3001/hire') 
                .then(response => {
                    this.hire_data = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },
    mounted() {
        this.fetchappraise_data();
        this.fetchhire_data();
    },
};
</script>

<style>
.confirmation-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.confirmation-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
}

.buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
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
