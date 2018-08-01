<template>
	<div class="g-container">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="房间设置" name="oneAdd">
				<el-form :model="houseSetting" :rules="houseRules" ref="houseSetting" label-width="80px">
					<el-form-item label="楼层设置" prop="floor">
						<el-input v-model="houseSetting.floor">
							<template slot="append">楼</template>
						</el-input>
					</el-form-item>
					<el-form-item label="门号设置" prop="number">
						<el-input v-model="houseSetting.number">
							<template slot="append">号</template>
						</el-input>
					</el-form-item>
					<el-form-item label="房间类型" prop="type">
						<el-select v-model="houseSetting.type" placeholder="请选择房间类型">
					    <el-option
					      v-for="item in roomOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="saveSetting('houseSetting')" type="primary">保存</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="批量设置" name="batchAdd">
				<el-form :model="batchHouseSetting" :rules="batchHouseRules" ref="batchHouseSetting" label-width="80px">
					<el-form-item label="楼层设置" prop="floor">
						<el-input v-model="batchHouseSetting.floor">
							<template slot="append">楼</template>
						</el-input>
					</el-form-item>
					<el-form-item label="门号设置" prop="number">
						<el-input v-model="batchHouseSetting.number.start_number">
							<template slot="append">号</template>
						</el-input>
						至
						<el-input v-model="batchHouseSetting.number.end_number">
							<template slot="append">号</template>
						</el-input>
					</el-form-item>
					<el-form-item label="房间类型" prop="type">
						<el-select v-model="batchHouseSetting.type" placeholder="请选择房间类型">
					    <el-option
					      v-for="item in roomOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click="saveBatchSetting('batchHouseSetting')" type="primary">保存</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import Validator from '@/util/validator.js'
	export default {
		data() {
			return {
				Validator: Validator,
				id: '',
				activeName: 'oneAdd',
				houseSetting: {
					floor: '',
					number: '',
					type: '',
				},
				batchHouseSetting: {
					floor: '',
					number: {
						start_number: '',
						end_number: '',
					},
					type: '',
				},
				roomOptions: [],

				houseRules: {
					floor: [
            { 
            	required: true,
            	validator: Validator.int,
							message: '楼层设置要为正整数', 
							trigger: 'blur'  
						},
          ],
					number: [
            { 
            	required: true,
            	validator: Validator.int,
							message: '房间号要为正整数', 
							trigger: 'blur'  
						},
          ],
          type: [
            { 
            	required: true, 
            	message: '请选择房型', 
            	trigger: 'change' 
            },
          ],
				},

				batchHouseRules: {
					floor: [
            { 
            	required: true,
            	validator: Validator.int,
							message: '楼层设置要为正整数', 
							trigger: 'blur'  
						},
          ],

					number: [
						{ 
							required: true,
							validator: (rule, value, callback) => {
								let ref = /^[0-9]*[1-9][0-9]*$/
                if (ref.test(this.batchHouseSetting.number.start_number) && ref.test(this.batchHouseSetting.number.end_number)) {
                    callback();
                } else {
                    callback(new Error('门号设置要为正整数'));
                }
              }, 
			      },
			      { 
							validator: (rule, value, callback) => {
                if (Number(this.batchHouseSetting.number.start_number) < Number(this.batchHouseSetting.number.end_number)) {
                    callback();
                } else {
                    callback(new Error('起始数据要小于结束数据'));
                }
              }, 
			      },
			    ],
          type: [
            { 
            	required: true, 
            	message: '请选择房型', 
            	trigger: 'change' 
            },
          ],
				},
			}
		},
		methods: {
			getApi() {
				this.$ajax.post('troom/getRoomAll',{
          keys: '',
          status: [0,1,2],
        }).then(e => {
          e.data.data.map(item => {
          	this.roomOptions.push({
          		value: item._id,
          		label: item.room_type_name,
          	})
          })
        }).catch(e => {})
			},
			transformNumber(num) {
				if(Number(num) < 10) {
					return '0' + parseInt(num)
				}else {
					return '' + parseInt(num)
				}
			},
			saveSetting(formName) {
				this.$refs[formName].validate((valid) => {
          if (valid) {
						this.$ajax.post('roomList/addHouse',{
							id: this.id ? this.id : '',
							house_type_id: this.houseSetting.type,
							floor: this.houseSetting.floor,
							house_num: parseInt(this.houseSetting.floor) + this.transformNumber(this.houseSetting.number)
						})
						.then(e => {
							if(e.data.flag) {
								this.$message.success(e.data.message)
							}else {
								this.$message.error(e.data.message)
							}
							this.$router.push({name:'houseList'})
						})
						.catch(e => {})
          }
        })
			},
			saveBatchSetting(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let ref = []
						for(let i = this.batchHouseSetting.number.start_number; i <= this.batchHouseSetting.number.end_number; i++) {
								ref.push(parseInt(this.batchHouseSetting.floor) + this.transformNumber(i))
						}
						this.$ajax.post('roomList/addhousebatch',{
							house_type_id: this.batchHouseSetting.type,
							floor: this.batchHouseSetting.floor,
							house_arr: ref,
						}).then(e => {
							if(e.data.flag) {
								this.$message.success('全部添加成功')
							}else {
								this.$message.error(e.data.failArr+'添加失败')
							}
							this.$router.push({name:'houseList'})
						}).catch(e => {})
 					}
				})
			},
		},
		mounted() {
			this.getApi()
			this.id = this.$route.query.id
			if(this.id) {
				this.$ajax.post('roomList/gethouseinfo',{
					id: this.id,
				}).then(e => {
					this.houseSetting.floor = e.data.floor
					this.houseSetting.number = parseInt(e.data.house_num.substring(e.data.house_num.length-2))
					this.houseSetting.type = e.data.house_type_id
				}).catch(e => {})
			}
		},
	}
</script>

<style lang="less" scoped>
	.el-input {
		width: 150px;
	}
</style>