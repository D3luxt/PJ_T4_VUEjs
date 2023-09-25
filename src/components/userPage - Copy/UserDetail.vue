<template>
    <div class="text-center grid grid-cols-2 gap-4 justify-center flex flex-col pr-20 pl-20">
        <div class="col-start-1 ">
            <div v-if="isEmployee" class="col-start-2 ">
                <div class="pt-20">ยินดีต้อนรับ : {{ currentEmployee.em_id }}</div>
                <div>ชื่อ : {{ currentEmployee.em_name }}</div>
            </div>
            <div v-else class="col-start-2 ">
                <div class="pt-20">ยินดีต้อนรับ : {{ currentUser.u_id }}</div>
                <div>ชื่อ : {{ currentUser.u_name }}</div>
            </div>
        </div>
        <div v-if="isEmployee" class="col-start-2 ">

            <div name="editdata" class="text-center grid grid-cols-3 gap-4 justify-center flex flex-col pr-20 pl-20">
                <div class="buttons-container">
                    <button class="fixed-size-button" @click="selectedComponent = 'filehomeCRUD'">แบบบ้าน</button>
                    <button class="fixed-size-button" @click="selectedComponent = 'contractMAKER3'">ทำสัญญา</button>
                    <button class="fixed-size-button" @click="selectedComponent = 'materialCRUD'">วัสดุมาตรฐาน</button>
                    <button class="fixed-size-button" @click="selectedComponent = 'planhomeCRUD'">ไฟล์แบบบ้าน</button>
                    <button class="fixed-size-button" @click="selectedComponent = 'employeeCRUD'">ข้อมูลพนักงาน</button>
                    <!-- <button class="fixed-size-button" @click="selectedComponent = 'stdmatCRUD'">วัสดุของแบบบ้าน</button> -->
                    <button class="fixed-size-button" @click="selectedComponent = 'hireCRUD'">การว่าจ้าง</button>
                </div>
            </div>
        </div>
        <div v-else class="col-start-2 ">
            <div class="text-center grid grid-cols-3 gap-4 justify-center flex flex-col pr-20 pl-20">
                <div class="buttons-container">
                    <button class="fixed-size-button"
                        @click="selectedComponent = 'userAppraiseCRUD'">ยืนยันการประเมินราคา</button>
                    <!-- <button class="fixed-size-button"
                        @click="selectedComponent = 'userAppraiseShow'">ดูการประเมินราคา</button> -->
                </div>
            </div>
        </div>
    </div>
    <hr class="horizontal-line">
    <div class="text-center grid gap-4 justify-center flex flex-col pr-20 pl-20">
        <component :is="selectedComponent"></component>
    </div>
</template>
  
<script>
import filehomeCRUD from './filehomeCRUD.vue';
import planhomeCRUD from './planhomeCRUD.vue';
import materialCRUD from './materialCRUD.vue';
import hireCRUD from './hireCRUD.vue';
import employeeCRUD from './employeeCRUD.vue';
import stdmatCRUD from './stdmatCRUD.vue';
import userAppraiseCRUD from './userAppraiseCRUD.vue';
import userAppraiseShow from './userAppraiseShow.vue';
import contactMAKER4 from './contactMAKER4.vue';
import contractMAKER3 from './contractMAKER3.vue';
import { mapState } from 'vuex';


export default {
    computed: {
        ...mapState(['currentEmployee', 'currentUser']),
        isEmployee() {
            // Assuming you have a getter function to retrieve the current user's role
            return !!this.$store.getters.getCurrentEmployee;
        },
    },

    components: {
        filehomeCRUD,
        planhomeCRUD,
        materialCRUD,
        hireCRUD,
        employeeCRUD,
        userAppraiseCRUD,
        stdmatCRUD,
        userAppraiseShow,
        contactMAKER4,
        contractMAKER3,
    },
    data() {
        return {
            selectedComponent: 'home', // Default selected component
        };
    },
    mounted() {
        console.log('currentEmployee:', this.currentEmployee);
        console.log('em_id:', this.currentEmployee?.em_id);
    }
};
</script>
  
<style>

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

.buttons-container {
    /* Use CSS grid layout to arrange buttons in a Sudoku-like grid */
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 3 columns with equal width */
    gap: 10px;
    /* Gap between buttons */
    justify-items: center;
    /* Center buttons horizontally */
    align-items: center;
    /* Center buttons vertically */
}

/* Style for the buttons (you can add your custom button styles here) */
.buttons-container button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #704900;
    color: white;
    border: none;
    cursor: pointer;
}

.fixed-size-button {
    /* Set fixed width and height for the buttons */
    width: 200px;
    height: 50px;
    /* Add additional styles to customize the buttons */
    padding: 10px;
    font-size: 14px;
    background-color: #704900;
    color: white;
    border: none;
    cursor: pointer;
    /* Add text truncation to prevent long text from overflowing */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}</style>