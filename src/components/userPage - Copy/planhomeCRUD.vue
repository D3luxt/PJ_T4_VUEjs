<template>
    ไฟล์แบบบ้าน<button class="ADDButton"><router-link to="/phINSERT">เพิ่ม</router-link></button><br>
    <div class="table-container">
        <table class="table-fixed">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>ชื่อไฟล์ PDF</th>
                    <th>รายละเอียดไฟล์แบบบ้าน</th>
                    <th>สเกล</th>
                    <th>บ้านที่อ้างอิง</th>
                    <th>แก้ไข</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in planhome" :key="item.planhome_id">
                    <td>{{ item.planhome_id }}</td>
                    <td>{{ item.planhome_pdf }}</td>
                    <td>{{ item.planhome_details }}</td>
                    <td>{{ item.planhome_scale }}</td>
                    <td>{{ item.filehome_id }}</td>
                    <td><button class="EDITButton">แก้ไข</button>
                        <button class="DELETEButton" @click="confirmAlert(item)">ลบ</button>
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
            planhome: [],
        };
    },
    methods: {
        confirmAlert(item) {
            if (confirm("ต้องการลบหรือไม่?")) {
                this.deleteItem(item);
            }
        },
        fetchplanhome_data() {
            axios.get('http://localhost:3001/planhome')
                .then(response => {
                    this.planhome = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        deleteItem(item) {
            axios.delete(`http://localhost:3001/planhome/${item.planhome_id}`)
                .then(response => {
                    // Remove the deleted item from the array
                    this.planhome = this.planhome.filter(data => data.planhome_id !== item.planhome_id);
                    console.log('Item deleted:', item.planhome_id);
                })
                .catch(error => {
                    console.error(error);
                });
        },

    },

    mounted() {
        this.fetchplanhome_data();
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