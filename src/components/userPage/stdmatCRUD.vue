<template>
    ไฟล์แบบบ้าน<button class="ADDButton"><router-link to="/">เพิ่ม</router-link></button><br>
    เลือกแบบบ้าน<select v-model="selectedOption" id="filehome_id" name="filehome_id">
        <option v-for="option in options" :value="option.filehome_id" :key="option.filehome_id">{{ option.label }}</option>
    </select>
    <div class="table-container">
        <table class="table-fixed">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>รหัสบ้านที่ใช้วัสดุ</th>
                    <th>NAME</th>
                    <th>จำนวน</th>
                    <th>บ้านอ้างอิง</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in filteredStdMaterialData" :key="item.std_mat_id">
                    <td>{{ item.std_mat_id }}</td>
                    <td>{{ item.filehome_id }}</td>
                    <td>{{ item.std_mat_name }}</td>
                    <td>{{ item.std_mat_quantity }}</td>
                    <td>{{ item.filehome_id }}</td>
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
    watch: {
        selectedOption(newVal) {
            if (newVal === '') {
                this.filteredStdMaterialData = this.std_material_data;
            } else {
                this.filteredStdMaterialData = this.std_material_data.filter(
                    item => item.filehome_id === newVal // Corrected field name
                );
            }
        },
    },
    data() {
        return {
            selectedOption: '', // Define selectedOption in the data() section
            std_material_data: [],
            filteredStdMaterialData: [],
        };
    },
    computed: {
        options() {
            // Extract unique filehome_id and label from std_material_data for select options
            return Array.from(
                new Set(this.std_material_data.map(item => item.filehome_id))
            ).map(filehome_id => ({
                filehome_id,
                label: `บ้านที่ใช้วัสดุรหัส ${filehome_id}`, // You can customize the label as needed
            }));
        },
    },
    methods: {
        fetchstd_material_data() {
            axios.get('http://localhost:3001/std_material')
                .then(response => {
                    this.std_material_data = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        deleteItem(item) {
            axios.delete(`http://localhost:3001/std_material/${item.std_mat_id}`)
                .then(response => {
                    // Remove the deleted item from the array
                    this.std_material_data = this.std_material_data.filter(data => data.std_mat_id !== item.std_mat_id);
                    console.log('Item deleted:', item.std_mat_id);
                })
                .catch(error => {
                    console.error(error);
                });
        },

    },

    mounted() {
        this.fetchstd_material_data();
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