<template>
    <button class="ADDButton">เพิ่ม</button><br>
    <div class="table-container">
        <table class="table-fixed">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>ชื่อ</th>
                    <th>ชื่อผู้ใช้</th>
                    <th>แก้ไข</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in employee_data" :key="item.em_id">
                    <td>{{ item.em_id }}</td>
                    <td>{{ item.em_email }}</td>
                    <td>{{ item.em_name }}</td>
                    <td>{{ item.em_username }}</td>
                    <td><button class="EDITButton">แก้ไข</button>
                        <button class="DELETEButton" @click="deleteItem(item)">ลบ</button>
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
            employee_data: [],
        };
    },
    methods: {
        deleteItem(item) {
            axios.delete(`http://localhost:3001/employee/${item.em_id}`)
                .then(response => {
                    // Remove the deleted item from the array
                    this.employee_data = this.employee_data.filter(data => data.em_id !== item.em_id);
                    console.log('Item deleted:', item.em_id);
                })
                .catch(error => {
                    console.error(error);
                });
        },
        fetchfilehome_data() {
            axios.get('http://localhost:3001/employee')
                .then(response => {
                    this.employee_data = response.data;
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