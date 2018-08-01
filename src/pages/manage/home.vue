<template>
	<div class="g-container">
	  <el-tabs v-model="activeName" type="card" @tab-click="checkRoomType">
	  	<el-tab-pane v-for="(item,index) in houseTypeArr" :label="item" :name="item" :key="index">
	  		<div class="checkbox g-flex">
			    <el-checkbox-group v-model="roomStatusArr" class="g-flex">
            <el-checkbox v-for="num in hotelStatus.length" :label="hotelStatus[num]" :key="num">
            	{{hotelStatus[num]}}<div class="color-show" :style="`background:${bgColor[num]}`"></div>
            </el-checkbox>
          </el-checkbox-group>
          <el-button size="small" class="find-btn" @click="search">查询</el-button>
	  		</div>
	  	</el-tab-pane>
  		<div 
  			class="commonality" 
  			v-for="(item,index) in roomArr" 
  			@click="setArr(item,index)"
  			:style="`background:${bgColor[item.house_status]}`">
  			<i class="iconfont icon-home">&#xe616;</i>
  		</div>
	  </el-tabs>

	 <el-dialog title="房间信息" :visible.sync="dialogFormVisible" width="50%" top="10vh">
	  <el-form :model="temForm" :label-width="formLabelWidth">
	  	<el-form-item label="房间状态">
      	<div class="g-flex">
      		<el-tag :type="status(temForm.house_status)">{{hotelStatus[temForm.house_status]}}</el-tag>
      		<div class="light-btn ml2" style="height:32px;" v-if="temForm.house_status==1" @click="alterIn(temForm.house_num)">入住</div>
      		<div class="light-btn ml2" style="height:32px;" v-if="temForm.house_status==2" @click="alterStatus(temForm.house_num,temForm.begin_date)">退房</div>
      	</div>
	  	</el-form-item>
	  	<el-form-item label="房间号">{{temForm.house_num}}</el-form-item>
	    <el-form-item label="选择国籍">
	      <el-radio-group v-model="temForm.country_flag">
			    <el-radio :label="0">中国</el-radio>
			    <el-radio :label="1">其他</el-radio>
			  </el-radio-group>
	    </el-form-item>
	    <el-form-item label="姓名">
	      <el-input v-model="temForm.name" placeholder="请输入入住人姓名"></el-input>
	    </el-form-item>
	    <el-form-item :label="temForm.country_flag ? '护照' :'身份证'">
	      <el-input v-model="temForm.idCard" :placeholder="temForm.country_flag ? '请输入护照' :'请输入身份证'"></el-input>
	    </el-form-item>
	    <el-form-item label="入住时间">
			 	<el-date-picker
		      v-model="temForm.total_date"
		      type="daterange"
		      range-separator="至"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期"
		      value-format="yyyy-MM-dd">
		    </el-date-picker>
	    </el-form-item>
	    <el-form-item label="费用">
	    	<div class="g-flex">
	    		<span class="total-money">{{temForm.price}}元</span>
	    	</div>
	    </el-form-item>
	  </el-form>
	  <div slot="footer" class="dialog-footer">
	    <el-button @click="dialogFormVisible = false">取 消</el-button>
	    <el-button type="primary" @click="submitForm" v-if="!temForm.isInhome">确 定</el-button>
	  </div>
	</el-dialog>
	</div>
</template>

<script>
	import {hotelStatus} from '@/map/map.js'
	export default {
		data() {
			return {
				hotelStatus: hotelStatus,
				roomStatusArr: [],
				activeName: '',
				bgColor: {1:'#AE25FC',2:'#38C546',3:'#FEA126'},
				houseTypeArr: [],
				roomArr: [],

				dialogFormVisible: false,
				formLabelWidth: '80px',
				//时间的临时状态
				roomStatusFlag: 0,

				//向dialog里传值的临时变量
				temForm: '',
				price: '',
			}
		},
		mounted() {
			this.initRoomStatusArr()
		},
		methods: {
			initRoomStatusArr() {
				for(let i = 1; i <= this.hotelStatus.length; i++) {
					this.roomStatusArr.push(this.hotelStatus[i])
				}
			},
			setArr(item, index) {
				this.dialogFormVisible = true
				if(item.order) {
					this.temForm = {
						id: item.house_type_id,
						house_num: item.house_num,
						name: item.order.name,
						room_type_name: this.activeName,
						country_flag: Number(item.order.nationality),
						idCard: item.order.idcard,
						total_date: [item.order.begin_date.split('T00:00:00.000Z')[0],item.order.end_date.split('T00:00:00.000Z')[0]],
						begin_date: item.order.begin_date,
						beginDate: item.order.begin_date.split('T00:00:00.000Z')[0],
						endDate: item.order.end_date.split('T00:00:00.000Z')[0],
						nationality: 0,
						house_status: item.house_status,
						price: this.price,
						isInhome: true,
					}
				}else {
					this.temForm = {
						id: item.house_type_id,
						house_num: item.house_num,
						name: '',
						room_type_name: this.activeName,
						country_flag: 0,
						idCard: '',
						total_date: '',
						begin_date: '',
						beginDate: '',
						endDate: '',
						nationality: 0,
						house_status: item.house_status,
						price: this.price,
						isInhome: false,
					}
				}
			},
			status(value) {
				if(value == 1) {
					this.roomStatusName = this.hotelStatus[1]
					return 'warning'
				}
				if(value == 2) {
					this.roomStatusName = this.hotelStatus[2]
					return 'success'
				}
				if(value == 3) {
					this.roomStatusName = this.hotelStatus[3]
					return 'danger'
				}
			},
			alterStatus(num,time) {
				this.$ajax.post('order/checkout',{
					houseNum: num,
					beginDate: time,
				}).then(e => {
					this.$message.success(e.data.message)
					this.dialogFormVisible = false
					this.getHouse()
				}).catch(e => {})
			},
			alterIn(num) {
				this.$ajax.post('order/status',{
					house_num: num,
				}).then(e => {
					this.$message.success(e.data.message)
					this.dialogFormVisible = false
					this.getHouse()
				}).catch(e => {})
			},
			checkRoomType() {
				this.getHouse()
			},
			getHouse(flag) {
				this.$ajax.post('roomList/gethouse').then(e => {
					if(flag) {
						e.data.data.map(item => {
							this.houseTypeArr.push(item.roomTypeName)
						})
						this.activeName = this.houseTypeArr[0]
					}
					let ref = []
					this.roomStatusArr.map(item => {
						if(item=='已预定') {
							ref.push(1)
						}
						else if(item=='已入住') {
							ref.push(2)
						}
						else if(item=='未入住') {
							ref.push(3)
						}
					})
					e.data.data.map(item => {
						if(item.roomTypeName == this.activeName) {
							this.roomArr = item.data.filter(i=>ref.indexOf(i.house_status)>-1)
							this.price = item.price
						}
					})
				}).catch(e => {})
			},
			submitForm() {
				this.temForm.beginDate = this.temForm.total_date[0]
				this.temForm.endDate = this.temForm.total_date[1]
				this.$ajax.post('order/orderB',{
					...this.temForm
				}).then(e => {
					this.dialogFormVisible = false
					this.getHouse()
				}).catch(e => {})
			},
			search() {
				this.getHouse()
			},
		},
		created(){
			this.getHouse(true)
		}
	}
</script>

<style lang="less">
	.commonality {
		width: 100px;
		height: 100px;
		background: #f00;
		border-radius: 6px;
		cursor: pointer;
		float: left;
		margin: 20px;
	}

	.checkbox {
		margin-left: 20px;

		.color-show {
			width: 14px;
			height: 14px;
			float: right;
			margin-top: 2px;
			margin-left: 5px;
		}

		.find-btn {
			padding: 4px 10px;
			margin-left: 20px;
		}
	}

	.icon-home {
		display: block;
		font-size: 50px;
		line-height: 100px;
		color: #fff;
		text-align: center;
	}

	.el-input {
		width: 250px;
	}

	.total-money {
		font-size: 18px;
		color: #0863BE;
	}
</style>