<template>
    <div class="table-container">
        <table class="table-fixed">
            <thead>
                <tr>
                    <th colspan="7">ค่าคงที่</th>
                </tr>
                <tr>
                    <th>ชื่อบริษัท (EN)</th>
                    <th>ชื่อบริษัท (TH)</th>
                    <th>EMAIL</th>
                    <th>เบอร์โทรศัพท์</th>
                    <th>ที่อยู่</th>
                    <th>LOGO</th>
                    <th>แก้ไข</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in company_data" :key="item.com_id">
                    <td>{{ item.com_name_en }}</td>
                    <td>{{ item.com_name_thai }}</td>
                    <td>{{ item.com_email }}</td>
                    <td>{{ item.com_tel }}</td>
                    <td>{{ item.com_address }}</td>
                    <td>
                        <img :src="getLogoURL(item.com_logo)" alt="Company Logo" class="logo-image" />    
                    </td>
                    <td>
                        <router-link :to="{ name: 'cmUpdate', params: { com_id: item.com_id } }"><i class="fa-regular fa-pen-to-square fa-2xl" style="color: #bd8a00;"></i></router-link>             
                    </td>
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
            company_data: [],
        };
    },
    methods: {
        
        getLogoURL(filename) {
            return `http://localhost:3001/images/${filename}`;
        },
        fetchcompany_data() {
            axios.get('http://localhost:3001/company')
                .then(response => {
                    this.company_data = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },

    mounted() {
        this.fetchcompany_data();
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