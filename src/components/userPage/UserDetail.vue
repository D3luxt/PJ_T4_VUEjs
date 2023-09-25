<template>
    <div class="text-center grid grid-cols-3 gap-4 justify-center flex flex-col pr-20 pl-20">
        <div class="col-start-1 border flex justify-center items-center">
            <div v-if="isEmployee">
                <div>ยินดีต้อนรับ : {{ currentEmployee.em_id }}</div>
                <div>พนักงาน : {{ currentEmployee.em_name }}</div>
            </div>
            <div v-else>
                <div>ยินดีต้อนรับ : {{ currentUser.u_id }}</div>
                <div>ลูกค้า : {{ currentUser.u_name }}</div>
            </div>
        </div>

        <div class="col-start-2 col-span-2 border">
            DASHBOARD
            <div v-if="isEmployee">
                <div class="pt-20">ยินดีต้อนรับ : {{ currentEmployee.em_id }}</div>
                <div>ชื่อ : {{ currentEmployee.em_name }}</div>
            </div>
            <div v-else>
                <div class="pt-20">ยินดีต้อนรับ : {{ currentUser.u_id }}</div>
                <div>ชื่อ : {{ currentUser.u_name }}</div>
            </div>
        </div>
    </div>
    <br>
    <!-- <hr class="horizontal-line"> -->
    <div class="text-center grid grid-cols-3 gap-4 justify-center flex flex-col pr-20 pl-20">
        <div class="border">
            <div name="editdata" class="">
                <div v-if="isEmployee">
                    <button style="margin-bottom: 10px;" class="fixed-size-button w-full"
                        @click="selectedComponent = 'employeeCRUD'">ข้อมูลพนักงาน</button>
                    <button style="margin-bottom: 10px;" class="fixed-size-button w-full"
                        @click="selectedComponent = 'customerCRUD'">ข้อมูลลูกค้า</button>

                    <hr style="border: 1px solid #ccc; margin: 10px 0;">

                    <button style="margin-bottom: 10px;" class="fixed-size-button w-full"
                        @click="selectedComponent = 'companyCRUD'">ค่าคงที่ของระบบ</button>
                    <button style="margin-bottom: 10px;" class="fixed-size-button w-full"
                        @click="selectedComponent = 'filehomeCRUD'">แบบบ้าน</button>
                    <button style="margin-bottom: 10px;" class="fixed-size-button w-full"
                        @click="selectedComponent = 'planhomeCRUD'">ไฟล์แบบบ้าน</button>
                    <button style="margin-bottom: 10px;" class="fixed-size-button w-full"
                        @click="selectedComponent = 'materialCRUD'">วัสดุมาตรฐาน</button>

                    <hr style="border: 1px solid #ccc; margin: 10px 0;">

                    <button style="margin-bottom: 10px;" class="fixed-size-button w-full"
                        @click="selectedComponent = 'hireCRUD'">การว่าจ้าง</button>

                    <button style="margin-bottom: 10px;" class="fixed-size-button w-full"
                        @click="selectedComponent = 'contractMAKER3'">ทำสัญญา</button>

                    <button style="margin-bottom: 10px;" class="fixed-size-button w-full"
                        @click="selectedComponent = 'contractCRUD'">สัญญาที่สำเร็จ</button>






                </div>
                <div v-else>
                    <button style="margin-bottom: 10px;" class="fixed-size-button w-full"
                        @click="selectedComponent = 'userAppraiseCRUD'">ยืนยันการประเมินราคา</button>
                    <button style="margin-bottom: 10px;" class="fixed-size-button w-full"
                        @click="selectedComponent = 'userhireCRUD'">การว่าจ้าง</button>
                </div>
            </div>
        </div>
        <div class="col-start-2 col-span-2 border">
            <component :is="selectedComponent"></component>
        </div>
    </div>
</template>
  
<script>
import userhireCRUD from './userhireCRUD.vue';
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
import customerCRUD from './customerCRUD.vue';
import companyCRUD from './companyCRUD.vue';
import contractCRUD from './contractCRUD.vue';
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
        userhireCRUD,
        contractCRUD,
        companyCRUD,
        filehomeCRUD,
        planhomeCRUD,
        customerCRUD,
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
.grid-container {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 10px;
}

.border {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 10px;
}

button {
    font: inherit;
    border: 1px solid rgb(69, 69, 69);
    background-color: rgb(69, 69, 69);
    color: white;
    cursor: pointer;
    padding: 0.75rem 2rem;
    border-radius: 15px;
    /* Reduced border radius */
}

button:hover,
button:active {
    border-color: rgb(34, 34, 34);
    background-color: rgb(34, 34, 34);
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
    background-color: rgb(69, 69, 69);
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
    background-color: rgb(69, 69, 69);
    color: white;
    border: none;
    cursor: pointer;
    /* Add text truncation to prevent long text from overflowing */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>