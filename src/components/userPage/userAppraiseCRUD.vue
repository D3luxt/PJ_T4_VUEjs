<template>
    <div class="table-container">
        <table class="table-fixed">
            <thead>
                <tr>
                    <th colspan="4">ยืนยันการประเมินราคา</th>
                </tr>
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
                        <button @click="openshowApp(item)">
                            {{ 'ทำการประเมิน' }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- Custom confirmation modal -->
</template> 

<script>
import { mapState } from 'vuex';
import axios from 'axios';


export default {
    computed: {
        ...mapState(['currentUser']),
    },
    components: {},
    data() {
        return {
            currentItemToConfirm: null,
            showConfirmation: false,
            selectedComponent: 'home', // Default selected component
            appraise_data: [],
            appraise_data1: [],
            hire_data: [],
        };
    },
    methods: {
        openshowApp(item) {
            this.$swal.fire({
                title: 'ยืนยันการประเมินราคา',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'ยืนยันราคา',
                denyButtonText: `ปฏิเสธราคา`,
                cancelButtonText: `ปิดหน้าต่าง`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    this.confirmAppraisal(item)
                    this.$swal.fire('ทำการยืนยันการประเมินราคา!', '', 'success')
                } else if (result.isDenied) {
                    this.cancelAppraisal(item)
                    this.$swal.fire('ยกเลิกการยืนยันราคา', '', 'info')
                }
            })
        },

        closeDialog() {
            this.showConfirmation = false;
        },

        // Method to cancel the appraisal
        cancelAppraisal(item) {
            this.showConfirmation = false;
            this.updateHireStatus(item, "ยกเลิกการประเมิน");
        },

        // Method to confirm the appraisal
        confirmAppraisal(item) {
            this.showConfirmation = false;
            this.updateHireStatus(item, "ยืนยันการว่าจ้าง");
        },

        // Method to update the hire_status
        updateHireStatus(item, newStatus) {
            const hireId = item.hire_id;
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
        fetchappraise_data(hire_data) {
            axios
                .get('http://localhost:3001/appraise')
                .then(response => {
                    // Filter appraise_data based on hire_data's hire_id
                    this.appraise_data = response.data.filter(item => {
                        return hire_data.some(hireItem => hireItem.hire_id === item.hire_id && hireItem.hire_status == "ส่งคำร้องสำเร็จ");
                    });

                })
                .catch(error => {
                    console.error(error);
                });
        },

        fetchhire_data() {
            const currentUserUId = this.currentUser.u_id;
            axios
                .get('http://localhost:3001/hire')
                .then(response => {
                    this.hire_data = response.data.filter(item => item.user_id === currentUserUId);
                    this.fetchappraise_data(this.hire_data); // Pass hire_data to fetchappraise_data
                })
                .catch(error => {
                    console.error(error);
                });
        }

    },
    mounted() {
        this.fetchhire_data(); // Add this line to fetch the hire data
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
    border-radius: 15px;
    /* Reduced border radius */
}

button:hover,
button:active {
    border-color: #291700;
    background-color: #291700;
}
</style>
