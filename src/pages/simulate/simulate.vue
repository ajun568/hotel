<template>
	<div class="g-container">
		<div class="container-phone">
			<div class="phone">
				<div class="content">
					<div class="header">
						<img src="../../assets/phone_header.png" style="width:268px;height:50px;">
					</div>
					<div class="wrap">
						<img src="../../assets/hotel.jpg">
						<div class="hotel-detail">
							<div class="detail-header">
								<img :src="hotelImage">
								<div style="width:100%">
									<div class="detail-title">{{basisForm.name}}</div>
									<div class="detail-item"><i class="iconfont">&#xe633;</i>{{basisForm.detailAddress}}</div>
									<div class="detail-item"><i class="iconfont">&#xe60b;</i>{{basisForm.phone}}</div>
								</div>
							</div>
							<div class="appoint">
								<div class="appoint-item">
									<el-date-picker
							      v-model="beginTime"
							      type="date"
							      :picker-options="pickerOptions"
							      placeholder="入住日期">
							    </el-date-picker>
								</div>
								<div class="appoint-item">
									<el-date-picker
							      v-model="endTime"
							      type="date"
							      :picker-options="pickerOptions"
							      placeholder="退房日期">
							    </el-date-picker>
								</div>
							</div>
						</div>
					</div>
					<div class="footer">
						<div v-for="(item,index) in roomArr" class="footer-item">
							<img :src="item.pic">
							<div class="g-flex" style="margin:5px 10px;">
								<div class="footer-content">
									<div class="footer-title">{{item.room_type_name}}</div>
									<div class="footer-p">房型面积{{item.room_area}}㎡</div>
									<div class="footer-p">床{{item.bed_type}} {{item.breakfeast ? '含早' : '无早'}}</div>
								</div>
								<div class="footer-price">
									<div class="price">￥{{item.room_type_price}}</div>
									<div class="btn" @click="reserve(item)" v-if="item.flag">立即预定</div>
									<div class="btn" style="background:#A7A8A6;" v-else>已满房</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<el-dialog title="预约信息" :visible.sync="dialogFormVisible" width="460px">
		  <el-form :model="temForm" label-width="80px">
		    <el-form-item label="选择国籍">
		      <el-radio-group v-model="temForm.nationality">
				    <el-radio :label="0">中国</el-radio>
				    <el-radio :label="1">其他</el-radio>
				  </el-radio-group>
		    </el-form-item>
		    <el-form-item label="姓名">
		      <el-input v-model="temForm.name" placeholder="请输入入住人姓名"></el-input>
		    </el-form-item>
		    <el-form-item :label="temForm.nationality ? '护照' :'身份证'">
		      <el-input v-model="temForm.idCard" :placeholder="temForm.nationality ? '请输入护照' :'请输入身份证'"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="submitForm">提 交</el-button>
		  </div>
		</el-dialog>
	</div>
</template>

<script>
	import moment from 'moment'
	export default {
		data() {
			return {
				hotelImage: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526102982730&di=2585d358d3a67cb55c0a74ac4bf5b738&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fe1fe9925bc315c602050233b87b1cb1348547718.jpg',
				beginTime: '',
				endTime: '',
				roomArr: [],
				basisForm: {},
				temForm: {},
				dialogFormVisible: false,
				pickerOptions: {
	        disabledDate(time) {
	          return time.getTime() < Date.now() - 8.64e7
	        }
	      },
			}
		},
		methods: {
			getRoomApi(flag) {
				this.$ajax.post('troom/getRoomAll',{
          keys: '',
          status: [0,1,2],
        }).then(e => {
        	if(e.data.flag) {
        		e.data.data.map(item => {
        			item.flag = ''
        			if(item.room_type_flag == 1) {
        				this.roomArr.push(item)
        			}
        		})
        	}
        	if(flag) {
        		this.$ajax.post('troom/isldle',{}).then(e => {
							this.roomArr.forEach(item => {
								e.data.data.forEach(value => {
									if(item.room_type_name==value.house_type_name) {
										item.flag = value.flag
									}
								})
							})
						}).catch(e => {})
        	}
        }).catch(e => {})
			},
			getBasisApi() {
				this.$ajax.post('users/getInfo',{}).then(e => {
					this.basisForm = e.data
					this.basisForm.detailAddress = e.data.region.split('-').join('')+e.data.address
				}).catch(e => {})
			},
			reserve(item) {
				if(this.beginTime!=''&&this.endTime!=""&&(moment(this.beginTime).format('X')<moment(this.endTime).format('X'))) {
					this.dialogFormVisible = true
					this.temForm = {
						nationality: 0,
						name: '',
						idCard: '',
						beginDate: this.beginTime,
						endDate: this.endTime,
						room_type_name: item.room_type_name,
						username: sessionStorage.getItem('username'),
						price: item.room_type_price,
					}
				}else {
					this.$message.error('预约时间没填写或格式不正确')
				}
			},
			submitForm() {
					this.$ajax.post('order/orderC',{
						...this.temForm
					}).then(e => {
						this.dialogFormVisible = false
						this.$message.success('预约成功')
					}).catch(e => {})
			},
		},
		created() {
			this.getBasisApi()
			this.getRoomApi(true)
		},
	}
</script>

<style lang="less" scoped>
	.container-phone {
		display: flex;
		justify-content: center;
		.phone {
			width: 310px;
			height: 620px;
			background: url('../../assets/phone.png') no-repeat;
			background-size: 310px 620px;

			.content {
				margin-left: 21px;
				margin-top: 76px;
				width: 268px;
				.header {
					width: 100%;
					height: 50px;
					background: #f00;
				}
				.wrap {
					width: 100%;
					height: 200px;
					img {
						width: 100%;
						height: 145px;
					}
					.hotel-detail {
						margin: 0 auto;
						padding: 10px;
						box-sizing: border-box;
						width: 218px;
						height: 130px;
						background: #eee;
						transform: translateY(-80px);
						box-shadow: 0 0 5px #888;

						.detail-header {
							display: flex;
							img {
								width: 72px;
								height: 72px;
							}
							.detail-title {
								margin-left: 8px;
								font-size: 14px;
								color: #333;
							}
							.detail-item {
								width:120px;
								margin-left: 8px;
								margin-top: 8px;
								color: #aaa;
								font-size: 12px;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
							}
						}
					}
					.appoint {
						display: flex;
						width: 100%;
						margin-top: 10px;

						.el-input {
							width: 100px;
							height: 30px;
						}
					}
				}
				.footer {
					width: 100%;
					height: 214px;
					max-height: 214px;
					overflow: auto;

					.footer-item {
						display: flex;
						width: 100%;
						height: 71.33px;
						border-bottom: 1px solid #ddd;
						box-sizing: border-box;
						img {
							margin: 5px 0 5px 10px;
							width: 61.33px;
							height: 61.33px;
						}
						.footer-content {
							width: 120px;
							height: 61.33px;
							.footer-title {
								font-size: 14px;
								margin: 5px 0;
							}
							.footer-p {
								font-size: 12px;
								color: #aaa;
								margin-bottom: 5px;
							}
						}
						.footer-price {
							.price {
								margin-top: 5px;
								color: #FF2801;
							}
							.btn {
								width: 60px;
								height: 30px;
								line-height: 30px;
								text-align: center;
								background: #FF2801;
								color: #fff;
								font-size: 12px;
								cursor: pointer;
							}
						}
					}
				}
			}
		}
	}
	.el-input {
		width: 300px;
	}
</style>

<style lang="less">
	.appoint-item {
		.el-input__inner {
			padding: 0 0 0 10px;
			height: 30px;
		}
		.el-icon-date:before {
			content: '';
		}
		.el-icon-circle-close:before {
			content: '';
		}
	}
</style>