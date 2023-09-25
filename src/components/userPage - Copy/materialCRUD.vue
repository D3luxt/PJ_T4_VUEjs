<template>
    วัสดุ<button class="ADDButton"><router-link to="/mtInsert">เพิ่ม</router-link></button><br>
    <div class="table-container">
        <table class="table-fixed">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>รายละเอียด</th>
                    <th>หน่วยนับ</th>
                    <th>ราคาเกรด A</th>
                    <th>ราคาเกรด B</th>
                    <th>ราคาเกรด C</th>
                    <th>แก้ไข</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in material_data" :key="item.mat_id">
                    <td>{{ item.mat_id }}</td>
                    <td>{{ item.mat_name }}</td>
                    <td>{{ item.mat_details }}</td>
                    <td>{{ item.mat_unit }}</td>
                    <td>{{ item.mat_gradeA }}</td>
                    <td>{{ item.mat_gradeB }}</td>
                    <td>{{ item.mat_gradeC }}</td>
                    <td><button class="EDITButton"><router-link :to="{ name: 'mtUpdate', params: { mat_id: item.mat_id } }">
                            แก้ไข
                        </router-link>
                    </button>
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
            material_data: [],

        };
    },
    methods: {
        confirmAlert(item) {
            if (confirm("ต้องการลบหรือไม่?")) {
                this.deleteItem(item);
            }
        },
        fetchfilehome_data() {
            axios.get('http://localhost:3001/material')
                .then(response => {
                    this.material_data = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        deleteItem(item) {
            axios.delete(`http://localhost:3001/material/${item.mat_id}`)
                .then(response => {
                    // Remove the deleted item from the array
                    this.material_data = this.material_data.filter(data => data.mat_id !== item.mat_id);
                    console.log('Item deleted:', item.mat_id);
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