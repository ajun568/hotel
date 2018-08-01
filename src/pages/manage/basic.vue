<template>
	<div class="g-container">
		<el-form :model="basicSetting" :rules="basicRules" ref="basicSetting" label-width="80px">
			<el-form-item label="店铺名称" prop="storeName">
        <el-input v-model="basicSetting.storeName" placeholder="请输入店铺名称"></el-input>
      </el-form-item>
      <el-form-item label="开通年限">
      	<div class="g-flex">
      		<div 
      			class="age-limit" 
      			v-for="(item,index) in ageLimitArr" 
      			:key="index"
      			:class="index===ageLimitStatus ? 'selected' : ''"
      			@click="cutStatus(index)">{{item}}
      		</div>
      	</div>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="basicSetting.phone" placeholder="请输入联系方式"></el-input>
      </el-form-item>
      <el-form-item label="酒店地区" prop="selectedAreaOptions">
        <el-cascader filterable :options="areaArr" v-model="basicSetting.selectedAreaOptions" style="width:250px;"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
      	<el-input v-model="basicSetting.address" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item label="头像上传" prop="picture">
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
      	<div class="light-btn" @click="saveSetting('basicSetting')">保存设置</div>
      </el-form-item>
		</el-form>
		<el-dialog :visible.sync="dialogVisible">
		  <img width="100%" :src="basicSetting.dialogImageUrl" alt="">
		</el-dialog>
	</div>
</template>

<script>
	import { chinaArea } from '@/map/area.js'
	import myUpload from 'vue-image-crop-upload'
	import Validator from '@/util/validator.js'
	export default {
		data() {
			return {
				Validator: Validator,
				basicSetting: {
					storeName: '',
					ageLimit: 1,
					phone: '',
					selectedAreaOptions: [],
					address: '',
				},
        dialogVisible: false,
				ageLimitArr:['1年','3年','5年','永久'],
				ageLimitStatus: 0,
				areaArr: [],

				show: false,
				pic: '',
				baseUrl: '',

				basicRules: {
					storeName: [
            { 
            	required: true,
            	validator: Validator.trim,
							message: '店铺名称不能为空', 
							trigger: 'blur'  
						},
          ],
          phone: [
          	{
          		required: true,
            	validator: Validator.strictMobile,
							message: '手机号格式不正确', 
							trigger: 'blur' 
          	}
          ],
          selectedAreaOptions: [
          	{ 
							required: true,
            	validator: Validator.requiredArray,
							message: '请选择酒店地区', 
							trigger: 'change' 
            }
          ],
          address: [
            { 
            	required: true,
            	validator: Validator.trim,
							message: '详细地址不能为空', 
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
				},
			}
		},
		components: {
			myUpload: myUpload,
		},
		methods: {
			initApi() {
				this.$ajax.post('users/getInfo',{}).then(e => {
        	if(e.data.fir_flag) {
        		this.basicSetting.storeName = e.data.name
        		this.basicSetting.ageLimit = e.data.term
        		this.basicSetting.phone = e.data.phone
        		this.basicSetting.selectedAreaOptions = e.data.region.split('-')
        		this.basicSetting.address = e.data.address
        		this.baseUrl = e.data.avatar
        		this.pic = e.data.avatar
        		//这个特别蠢，先不改了，后续再改（这个页面状态处理做的不好）
        		if(e.data.term == 1) {
        			this.ageLimitStatus = 0
        		}
        		else if(e.data.term == 3) {
        			this.ageLimitStatus = 1
        		}
        		else if(e.data.term == 5) {
        			this.ageLimitStatus = 2
        		}
        		else if(e.data.term == 7) {
        			this.ageLimitStatus = 3
        		}
        	}
        }).catch(e => {})
			},
			cutStatus(index) {
				this.ageLimitStatus = index
				if(index==0) {
					this.basicSetting.ageLimit = 1
				}
				else if(index==1) {
					this.basicSetting.ageLimit = 3
				}
				else if(index==2) {
					this.basicSetting.ageLimit = 5
				}
				else if(index==3) {
					this.basicSetting.ageLimit = 0
				}
			},
			areaMap() {
	      chinaArea.forEach((item, index) => {
	        this.areaArr.push({
	          value: item.province_name,
	          label: item.province_name,
	        })
	        if (item.city) {
	          this.areaArr[index].children = []
	          item.city.forEach((value, num) => {
	            this.areaArr[index].children.push({
	              value: value.city_name,
	              label: value.city_name,
	            })
	            if (value.area) {
	              this.areaArr[index].children[num].children = []
	              value.area.forEach(ref => {
	                this.areaArr[index].children[num].children.push({
	                  value: ref,
	                  label: ref,
	                })
	              })
	            }
	          })
	        }
	      })
	    },
	    saveSetting(formName) {
	    	this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.post('users/addUserInfo',{
            	name: this.basicSetting.storeName,
            	term: this.basicSetting.ageLimit,
            	phone: this.basicSetting.phone,
            	region: this.basicSetting.selectedAreaOptions.join('-'),
            	address: this.basicSetting.address,
            	avatar: this.pic,
            	pic: this.basicSetting.dialogImageUrl,
            }).then(e => {
            	this.$message.success('设置成功')
            }).catch(e => {
            	this.$message.error('设置失败')
            })
          }
        })
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
		mounted() {
			this.areaMap()
			this.initApi()
		},
	}
</script>

<style lang="less" scoped>
	.el-input {
		width: 250px;
	}
	.age-limit {
		width: 78px;
		height: 38px;
		margin-right: 5px;
		cursor: pointer;
		background: #ecf5ff;
		border: 1px solid #b3d8ff;
		text-align: center;
		line-height: 38px;
		color: #409eff;
	}

	.selected {
		width: 74px;
		height: 34px;
		line-height: 34px;
		border: 3px solid #409eff;
	}
	.avatar-uploader,
	.el-upload {
    border: 1px dashed #d9d9d9;
    width: 178px;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader,
  .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>