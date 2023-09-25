<template>
    <div class="table-container">
        <table class="table-fixed">
            <thead>
                <tr>
                    <th colspan="5">ข้อมูลลูกค้า</th>
                </tr>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>ชื่อ</th>
                    <th>ชื่อผู้ใช้</th>
                    <th>เบอร์โทรศัพท์</th>

                    <!-- <th>แก้ไข</th> -->

                </tr>
            </thead>
            <tbody>
                <tr v-for="item in user_data" :key="item.u_id">
                    <td>{{ item.u_id }}</td>
                    <td>{{ item.u_email }}</td>
                    <td>{{ item.u_name }}</td>
                    <td>{{ item.u_username }}</td>
                    <td>{{ item.u_phone }}</td>

                    <!-- <td>
                        <router-link :to="{ name: 'ctUpdate', params: { u_id: item.u_id } }"><i class="fa-regular fa-pen-to-square fa-2xl" style="color: #bd8a00;"></i></router-link>             
                    </td> -->

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
            user_data: [],
        };
    },
    methods: {
        fetchfilehome_data() {
            axios.get('http://localhost:3001/user')
                .then(response => {
                    this.user_data = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },

    mounted() {
        this.fetchfilehome_data();
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