<template>
    <div class="table-container">
        <table class="table-fixed">
            <thead>
                <tr>
                    <th colspan="7">ใบสัญญา</th>
                </tr>
                <tr>
                    <th>รหัสใบสัญญา</th>
                    <th>รหัสว่าจ้าง</th>
                    <th>รหัสพนักงาน</th>
                    <th>วันเริ่มก่อสร้าง</th>
                    <th>วันสิ้นสุด</th>
                    <th>จำนวนงวด</th>
                    <th>ระยะเวลาก่อสร้าง</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in contract_data" :key="item.ct_id">
                    <td>{{ item.ct_id }}</td>
                    <td>{{ item.hire_id }}</td>
                    <td>{{ item.em_id }}</td>
                    <td>{{ item.ct_date_s }}</td>
                    <td>{{ item.ct_date_e }}</td>
                    <td>{{ item.ct_quantity }}</td>
                    <td>{{ item.ct_period }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    components: {
    },
    data() {
        return {
            selectedComponent: 'home', // Default selected component
        };
    },
    data() {
        return {
            contract_data: [],
        };
    },
    methods: {
        
        getLogoURL(filename) {
            return `http://localhost:3001/images/${filename}`;
        },
        fetchcontract_data() {
            axios.get('http://localhost:3001/contract')
                .then(response => {
                    this.contract_data = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },

    mounted() {
        this.fetchcontract_data();
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