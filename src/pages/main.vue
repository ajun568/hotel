<template>
	<div class="g-container">
		<div class="g-flex">
	    <span class="g-title personal">个人信息：</span>
	    <div class="content g-flex1">
        <span>酒店名称：<strong>{{ hotelName }}</strong></span>
        <span>开通时间：<strong>{{ beginTime }}</strong></span>
        <span>开通期限：<strong>{{ deadline }}</strong></span>
        <button type="button" name="button">立即续费</button>
      </div>
		</div>
		<div class="dataOverview">
      <div class="content">
				<el-col :span="5" v-for="(item,index) in orderNumArr" class="mr4" :key="index">
          <div class="card">
            <div class="cardTitle">{{ item.name }}</div>
            <div class="cardContent">{{ item.num ? item.num : 0}} {{ item.unit }}</div>
          </div>
        </el-col>
      </div>
		</div>
		<div class="g-flex mt4">
			<div class="g-flex2 main-image-pd">
				<main-image :image="avatar" width="300px" height="300px" marginTop="120px;">
					<span class="image-word">你好呀,老朋友</span>
		    </main-image>
			</div>
			<div class="g-flex3 mb8">
				<el-col :span="22">
	        <div class="userIncrease dashboardChart">
	          <div class="title">
	            <a href="#" v-show="false"><span class="more">详情<i class="iconfont moreIcon" aria-hidden="true"> &#xe613;</i></span></a>
	          </div>
	          <div class="content">
	            <chart ref="userIncrease" :options="userIncrease" :auto-resize="true"></chart>
	            <span>上周订单增长趋势</span>
	          </div>
	        </div>
	      </el-col>
			</div>
		</div>
	</div>
</template>

<script>
	import mainImage from '@/components/admin/image'
  import moment from 'moment'
	import ECharts from 'vue-echarts/components/ECharts.vue'
	import 'echarts/lib/chart/line';
	export default {
		data() {
			return {
				avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
				hotelName: '酒店名称',
				beginTime: '',
				deadline: '',
				orderNumArr: [{
					name: '订单总数',
					num: '',
					unit: '个',
				},{
					name: '昨日订单数',
					num: '',
					unit: '个',
				},{
					name: '增长率',
					num: '',
					unit: '%',
				},{
					name: '成交总金额',
					num: '',
					unit: '元',
				},],

				userIncrease : {
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data:['']
          },
          grid: {
              left: '3%',
              right: '5%',
              bottom: '3%',
              top: '2%',
              containLabel: true
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: []
          },
          yAxis: {
              type: 'value'
          },
          tooltip: {
              trigger: 'axis'
          },
          series: [{
            name:'新增用户数',
            type:'line',
            stack: '总量',
            smooth:true,
            data:[],
            itemStyle: {
              normal: {
                areaStyle: {
                  // 折线区域颜色
                  color : 'rgba(159, 212, 252, 0.1)'
                }
              }
          	},
           }],
        	color: ['#75C2FA']
      	},
			}
		},
		components: {
			mainImage,
			'chart': ECharts,
		},
    methods: {
      getOrderdataApi() {
        this.$ajax.post('order/orderdata').then(e => {
          let yesterday = e.data.data.order.filter(item=>moment(item.begin_date).format('YYYY-MM-DD')  == moment().subtract(1,'days').format('YYYY-MM-DD')).length
          let preday = e.data.data.order.filter(item=>moment(item.begin_date).format('YYYY-MM-DD')  == moment().subtract(2,'days').format('YYYY-MM-DD')).length
          this.orderNumArr[0].num = e.data.data.total
          this.orderNumArr[1].num = e.data.data.order.filter(item=>moment(item.begin_date).format('YYYY-MM-DD')  == moment().subtract(1,'days').format('YYYY-MM-DD')).length
          if(preday!=0) {
            this.orderNumArr[2].num = parseInt((yesterday/preday).toFixed(2))*100
          }
          else if(preday==0&&yesterday!=0) {
            this.orderNumArr[2].num = 100
          }
          else {
            this.orderNumArr[2].num = 0
          }
          let total = e.data.data.order.map(item=>parseFloat(item.price)).reduce((a,b) => a+b)
          this.orderNumArr[3].num = total
        }).catch(e => {})
      },
      getWeekdataApi() {
        this.$ajax.post('order/weekdata').then(e => {
          this.userIncrease.xAxis.data = e.data.data.map(item=>item.date);
          this.userIncrease.series[0].data = e.data.data.map(item=>item.data);
        }).catch(e => {})
      },
      getInfoApi() {
        this.$ajax.post('users/getInfo',{}).then(e => {
          this.hotelName = e.data.name
          if(this.deadline) {
            this.deadline = e.data.term+'年'
          }
          else if(this.deadline == 0) {
            this.deadline = '永久'
          }
          else {
            this.deadline = '未开通'
          }
          this.beginTime = moment(e.data.date).format('YYYY-MM-DD')
        }).catch(e => {})
      },
    },
    created() {
      this.getOrderdataApi()
      this.getWeekdataApi()
      this.getInfoApi()
    },
	}
</script>

<style lang="less" scoped>
	@theme: #0CDDD6;
	.personal {
		line-height: 36px;
		margin-right: 10px;
	}

	.content {
    span {
      font-size: 14px;
      color: #808080;
      margin-right: 35px;
      strong {
        font-size: 16px;
        color: #333;
      }
    }
    button {
    	cursor: pointer;
      width: 126px;
      height: 36px;
      color: #fff;
      font-size: 16px;
      background-color: @theme;
      border: none;
      border-radius: 6px;
    }
  }

  .dataOverview {
  	width: 100%;
  	height: 150px;
    .content {
    	margin-top: 40px;
      .card {
        height: 148px;
        background-color: #fcfcfc;
        border: 1px solid #fcfcfc;
        box-shadow: 0 0 20px rgba(0, 0, 0, .14);
        .cardTitle {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          margin-top: 45px;
          text-align: center;
        }
        .cardContent {
          font-size: 30px;
          font-weight: bold;
          color: #ec6738;
          margin-top: 18px;
          text-align: center;
        }
      }
    }
  }

  .dashboardChart {
    position: relative;
    .more {
      font-size: 13px;
      font-weight: normal;
      color: #808080;
      position: absolute;
      right: 0;
      .moreIcon {
        font-size: 13px;
      }
    }
    .echarts {
      width: 100%;
      height: 280px;
    }
    .content {
      span {
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 15px;
        margin-top: 10px;
      }
    }
  }

  .dashboardChartB {
    .echarts {
      height: 280px;
    }
  }

  .main-image-pd {
  	padding-left: 100px;
  }

  .image-word {
  	font-weight: bold;
  	font-size: 20px;
  }
</style>