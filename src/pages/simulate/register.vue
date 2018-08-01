<template>
	<div class="g-container">
		<el-form :model="userRegister" :rules="registerRules" ref="userRegister" label-width="80px">
			<el-form-item label="用户名" prop="userName">
				<el-input v-model="userRegister.userName" placeholder="请输入用户名"></el-input>
			</el-form-item>
			<el-form-item label="头像" prop="picture">
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
      <el-form-item label="国籍">
      	<el-radio-group v-model="userRegister.nationality">
			    <el-radio :label="0">中国</el-radio>
			    <el-radio :label="1">其他</el-radio>
			  </el-radio-group>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
      	<el-input v-model="userRegister.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <div v-show="!userRegister.nationality">
      	<el-form label-width="80px" :model="chinaUserRegister" :rules="chinaRules" ref="chinaUserRegister">
	      	<el-form-item label="身份证" prop="idCard">
	      		<el-input v-model="chinaUserRegister.idCard" placeholder="请输入身份证"></el-input>
	      	</el-form-item>
      	</el-form>
      </div>
      <div v-show="userRegister.nationality">
      	<el-form label-width="80px" :model="otherUserRegister" :rules="otherRules" ref="otherUserRegister">
	      	<el-form-item label="护照" prop="passport">
	      		<el-input v-model="otherUserRegister.passport" placeholder="请输入护照"></el-input>
	      	</el-form-item>
	      	<el-form-item label="国家" prop="country">
	      		<el-input v-model="otherUserRegister.country" placeholder="请输入国家"></el-input>
	      	</el-form-item>
	      	<el-form-item label="入境日期" prop="time">
	      		<el-date-picker
				      v-model="otherUserRegister.time"
				      type="date"
				      :picker-options="pickerOptions"
				      placeholder="选择日期">
				    </el-date-picker>
	      	</el-form-item>
	      	<el-form-item label="居留事由" prop="toBe">
	      		<el-input v-model="otherUserRegister.toBe" placeholder="请输入居留事由"></el-input>
	      	</el-form-item>
	      	<el-form-item label="职务身份" prop="job">
	      		<el-input v-model="otherUserRegister.job" placeholder="请输入职务身份"></el-input>
	      	</el-form-item>
      	</el-form>
      </div>
      <el-form-item>
      	<div class="light-btn" @click="toRegister('userRegister','chinaUserRegister','otherUserRegister')">保存设置</div>
      </el-form-item>
		</el-form>
	</div>
</template>

<script>
	import myUpload from 'vue-image-crop-upload'
	import Validator from '@/util/validator.js'
	export default {
		data() {
			return {
				Validator: Validator,
				userRegister: {
					userName: '',
					nationality: 0,
					name: '',
				},
				chinaUserRegister: {
					idCard: '',
				},
				otherUserRegister: {
					passport: '',
					country: '',
					time: '',
					toBe: '',
					job: '',
				},
				pickerOptions: {
					disabledDate(time) {
		        return time.getTime() >= Date.now();
		      }
				},

				registerRules: {
					userName: [
            { 
            	required: true,
            	validator: Validator.trim,
							message: '用户名不能为空', 
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
		                callback(new Error('请上传头像'));
		            }
		          }, 
		        }
	        ],
	        name: [
            { 
            	required: true,
            	validator: Validator.trim,
							message: '姓名不能为空', 
							trigger: 'blur'  
						},
          ],
				},
				chinaRules: {
					idCard: [
            { 
            	required: true,
            	validator: Validator.idCard,
							message: '身份证格式不正确', 
							trigger: 'blur'  
						},
          ],
				},
				otherRules: {
					passport: [
            { 
            	required: true,
            	validator: Validator.passport,
							message: '护照格式不正确', 
							trigger: 'blur'  
						},
          ],
          country: [
            { 
            	required: true,
            	validator: Validator.trim,
							message: '国家不能为空', 
							trigger: 'blur'  
						},
          ],
          time: [
            { 
            	required: true,
							message: '入境日期没有选择', 
							trigger: 'change'  
						},
          ],
          toBe: [
            { 
            	required: true,
            	validator: Validator.trim,
							message: '居留事由不能为空', 
							trigger: 'blur'  
						},
          ],
          job: [
            { 
            	required: true,
            	validator: Validator.trim,
							message: '职务身份不能为空', 
							trigger: 'blur'  
						},
          ],
				},

				show: false,
				pic: '',
				baseUrl: '',
			}
		},
		components: {
			myUpload: myUpload,
		},
		methods: {
			toRegister(form1,form2,form3) {
				//这个地方要用箭头函数，否则会异步
				let formCommon = new Promise((resolve,reject) => {
				  this.$refs[form1].validate((valid) => {
            if(valid){
              resolve()
            }
          })
				})
				let formChina = new Promise((resolve,reject) => {
				  this.$refs[form2].validate((valid) => {
            if(valid){
              resolve()
            }
          })
				})
				let formOther = new Promise((resolve,reject) => {
				  this.$refs[form3].validate((valid) => {
            if(valid){
              resolve()
            }
          })
				})

				if(!this.userRegister.nationality) {
					Promise.all([formCommon,formChina]).then(() => {
						this.$ajax.post('client/addinfo', {
							b_username: sessionStorage.getItem('username'),
							userName: this.userRegister.userName,
							name: this.userRegister.name,
							nationality: this.userRegister.nationality,
							idCard: this.chinaUserRegister.idCard,
							avatar: this.pic,
						}).then(e => {
							if(e.data.message=='添加成功') {
								this.$message.success('添加成功')
							}else {
								this.$message.error('添加失败')
							}
						}).catch(e => {})
					})
				}else {
					Promise.all([formCommon,formOther]).then(() => {
						this.$ajax.post('client/addinfo',{
							b_username: sessionStorage.getItem('username'),
							userName: this.userRegister.userName,
							name: this.userRegister.name,
							nationality: this.userRegister.nationality,
							idCard: this.otherUserRegister.passport,
							avatar: this.pic,
							country: this.otherUserRegister.country,
							time: this.otherUserRegister.time,
							todo: this.otherUserRegister.toBe,
							job: this.otherUserRegister.job,
						}).then(e => {}).catch(e => {})
					})
				}
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
		},
	}
</script>

<style lang="less" scoped>
	.el-input {
		width: 250px;
	}
</style>