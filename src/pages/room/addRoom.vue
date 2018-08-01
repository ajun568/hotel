<template>
	<div class="g-container">
		<el-form ref="addRoomForm" :model="addRoomForm" :rules="addRoomRules" label-width="80px">
      <el-form-item label="房型名称" prop="room_type_name">
          <el-input v-model="addRoomForm.room_type_name" placeholder="请输入房型名称"></el-input>
      </el-form-item>
      <el-form-item label="房型状态">
      	<div class="g-flex">
      		<el-tag :type="status(addRoomForm.room_type_flag)">{{roomStatusName}}</el-tag>
      		<div class="light-btn ml2" style="height:32px;" @click="alterStatus">修改状态</div>
      		<div style="margin-left:20px;" v-if="roomStatusFlag">                
      			<el-radio-group v-model="addRoomForm.room_type_flag">
              <el-radio :label="0">{{hotelMap[0]}}</el-radio>
              <el-radio :label="1">{{hotelMap[1]}}</el-radio>
              <el-radio :label="2">{{hotelMap[2]}}</el-radio>
            </el-radio-group>
          </div>
      	</div>
      </el-form-item>
      <el-form-item label="房型价格" prop="room_type_price">
          <el-input 
          	v-model="addRoomForm.room_type_price" 
          	placeholder="请输入房型价格">
          </el-input>　元
      </el-form-item>
      <el-form-item label="房型数量" prop="room_num">
        <el-input 
        	v-model="addRoomForm.room_num" 
        	placeholder="请输入房型数量">
        </el-input>　间
       </el-form-item>
        <el-form-item label="房间概要">
          <el-form ref="detailX" :model="addRoomForm" :rules="roomRules" class="detailSetting" label-width="80px">
            <el-form-item label="房间面积" prop="room_area">
                <el-input v-model="addRoomForm.room_area" placeholder="请输入房间面积"></el-input>　m<sup>2</sup>
            </el-form-item>
            <el-form-item label="床型" prop="bed_type" class="mt2">
                <el-input v-model="addRoomForm.bed_type" placeholder="请输入床型描述，格式 1.8*2"></el-input>　m
            </el-form-item>
            <el-form-item label="早餐" prop="breakfeast" class="mt1">
                <el-radio-group v-model="addRoomForm.breakfeast">
                    <el-radio :label="0">无</el-radio>
                    <el-radio :label="1">有</el-radio>
                </el-radio-group>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="房间图片" prop="picture">
						<my-upload 
							field="img"
							@crop-success="cropSuccess"
			        @crop-upload-success="cropUploadSuccess"
			        url="troom/upload"
			        v-model="show"
							:width="100"
							:height="100"
							img-format="png"></my-upload>
						<img :src="baseUrl" v-if="baseUrl" @click="toggleShow" class="square-100">
						<img src="@/assets/upload.png" class="square-100" v-else @click="toggleShow">
        </el-form-item>
        <el-form-item>
        	<div class="light-btn" @click="saveSetting('addRoomForm')">保存设置</div>
        </el-form-item>
		</el-form>
	</div>
</template>

<script>
	import { hotelMap } from '@/map/map.js'
	import myUpload from 'vue-image-crop-upload'
	import Validator from '@/util/validator.js'
	export default {
		data() {
			return {
				hotelMap: hotelMap,
				Validator: Validator,
				addRoomForm: {
					room_type_name: '',
					room_type_flag: 0,
					room_type_price: '',
					room_num: '',
					room_area: '',
					bed_type: '',
					breakfeast: 0,
				},
				roomStatusName: hotelMap[0],
				roomStatusFlag: 0,

				show: false,
				pic: '',
				baseUrl: '',

				addRoomRules: {
					room_type_name: [
            { 
            	required: true,
            	validator: Validator.trim,
							message: '房型名称不能为空', 
							trigger: 'blur'  
						},
          ],
          room_type_price: [
            { 
            	required: true,
            	validator: Validator.float,
							message: '房型价格格式不正确', 
							trigger: 'blur'  
						},
          ],
          room_num: [
            { 
            	required: true,
            	validator: Validator.int,
							message: '房型数量格式不正确', 
							trigger: 'blur'  
						},
          ],
					picture: [
						{ 
							required: true,
							validator: (rule, value, callback) => {
		            if (this.pic) {
		                callback();
		            } else {
		                callback(new Error('请上传房间图片'));
		            }
		          }, 
		        }
	        ],
				},
				roomRules: {
          room_area: [
            { 
            	required: true,
            	validator: Validator.float,
							message: '房型价格格式不正确', 
							trigger: 'blur'  
						},
          ],
          bed_type: [
            { 
            	required: true,
            	validator: Validator.bedInfo,
							message: '床型设置不正确', 
							trigger: 'blur'  
						},
          ],		
				},

				id: '',
			}
		},
		components: {
			myUpload: myUpload,
		},
		methods: {
			getApi() {
				this.id = this.$route.query.id
				this.id 
					&&
				this.$ajax.post('troom/getRoomAll',{
					keys: '',
          status: [1,2,3],
				}).then(e => {
	        e.data.data.map(item => {
	        	if(item._id == this.id) {
	        		this.addRoomForm = item
	        		this.pic = item.pic
	        		this.baseUrl = item.pic
	        	}
	        })
	      }).catch(e => {})
			},

			status(value) {
				if(value == 0) {
					this.roomStatusName = this.hotelMap[0]
					return 'warning'
				}
				if(value == 1) {
					this.roomStatusName = this.hotelMap[1]
					return 'success'
				}
				if(value == 2) {
					this.roomStatusName = this.hotelMap[2]
					return ''
				}
			},

			alterStatus() {
				this.roomStatusFlag = !this.roomStatusFlag
			},

			toggleShow() {
				this.show = !this.show;
			},
			cropSuccess(imgDataUrl, field) {
				this.baseUrl = imgDataUrl
			},
			cropUploadSuccess(imgDataUrl, field){
				this.pic = imgDataUrl.path
			},

			saveSetting(formName) {
				this.$refs[formName].validate((valid) => {
          if (valid) {
          	this.$ajax.post('troom/roomTYinfo',{
	          	_id: this.id ? this.id : 0,
	          	room_type_name: this.addRoomForm.room_type_name,
	          	room_type_flag: this.addRoomForm.room_type_flag,
	          	room_type_price: this.addRoomForm.room_type_price,
	          	room_num: this.addRoomForm.room_num,
	          	breakfeast: this.addRoomForm.breakfeast,
	          	pic: this.pic,
	          	bed_type: this.addRoomForm.bed_type,
	          	room_area: this.addRoomForm.room_area,
	          }).then(e => {
	          	this.$message.success('设置成功')
	          	this.$router.push({name:'roomList'})
	          }).catch(e => {
	          	this.$message.error('设置失败')
	          })
          }
        })
			},
		},
		mounted() {
			this.getApi()
		},
	}
</script>

<style lang="less" scoped>
	.el-input {
		width: 200px;
	}

	.detailSetting {
    width: 370px;
    padding: 30px 45px 20px;
    background: #f1f1f1;

    	.el-input {
				width: 250px;
			}
	}
</style>