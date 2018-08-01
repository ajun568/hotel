<template>
	<div class="g-container">
		<el-form  :model="queryForm" ref="queryForm"  class="query-form" label-width="80px">
      <el-row class="form">
        <el-col :md="24" :lg="10">
            <el-form-item label="订单编号">
              <el-input v-model="queryForm.orderNumber" placeholder="请严格输入订单编号"></el-input>
            </el-form-item>
        </el-col>
        <el-col  :md="24" :lg="10">
            <el-form-item label="入住房型">
							<el-select v-model="queryForm.room" placeholder="请选择">
						    <el-option
						      v-for="item in roomOptions"
						      :key="item.value"
						      :label="item.label"
						      :value="item.label">
						    </el-option>
						  </el-select>
            </el-form-item>
        </el-col>
        <el-col  :md="12" :lg="2" :pull="1">
            <el-form-item label="">
                <el-button type="primary" @click="searchGoods" icon="search">查询订单</el-button>
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="position:relative;width:100%;">
    	<el-button style="position:absolute;right:22px;" type="success" @click="exportExcel"><i class="iconfont">&#xe60c;</i> 导出订单</el-button>
    </div>
		<el-radio-group @change="searchGoods" v-model="orderTypesChecked">
			<el-radio-button v-for="type in orderTypes" :label="type" :key="type">{{type}}</el-radio-button>
		</el-radio-group><span class="help-info">&nbsp;&nbsp;共{{total}}个符合条件的订单</span>
		<el-table :data="orderList" style="width: 100%;margin-top:5px;" border id="out-table">
			<el-table-column prop="_id" label="订单编号" min-width="170"></el-table-column>
      <el-table-column prop="name" label="入住人姓名" min-width="100"></el-table-column>
      <el-table-column prop="nationality" label="入住人国籍" min-width="100">
        <template slot-scope="scope">
          <span v-if="!scope.row.nationality">中国</span>
          <span v-else>其它</span>
        </template>
      </el-table-column>
      <el-table-column prop="idcard" label="入住人证件号" min-width="160">
        <template slot-scope="scope">
          <span v-if="!scope.row.nationality">身份证：{{scope.row.idcard}}</span>
          <span v-else>护照：{{scope.row.idcard}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="交易方式" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.order">网上预定</span>
          <span v-else>线下支付</span>
        </template>
      </el-table-column>
      <el-table-column prop="room_type_name" label="入住房型" min-width="100"></el-table-column>
      <el-table-column prop="house_num" label="入住房间" min-width="100"></el-table-column>
      <el-table-column prop="price" label="房型价格（元）" min-width="100"></el-table-column>
    </el-table>
    <el-pagination 
      :page-sizes="[25, 50, 75, 100]" 
      :current-page="pageNum" 
      :page-size="pageSize" 
      layout="total,sizes, prev, pager, next" 
      :total="total" 
      style="float:right;"
      @size-change="handleSizeChange" 
      @current-change="handlePageChange">
    </el-pagination>
	</div>
</template>

<script>
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
	export default {
		data() {
			return {
				orderList: [],
				queryForm: {
          orderNumber: '',
          room: '',
        },
        orderTypesChecked: '全部',
        orderTypes:['全部','中国','其它'],
        roomOptions: [{
          value: 0,
          label: '全部',
        }],

        pageNum: 1,
        pageSize: 15,
        total: 0,
			}
		},
		methods: {
			getApi() {
        let ref
        if(this.orderTypesChecked=='全部') {
          ref = -1
        }
        else if(this.orderTypesChecked=='中国') {
          ref = 0
        }
        else if(this.orderTypesChecked=='其它') {
          ref = 1
        }
				this.$ajax.post('order/list',{
          id: this.queryForm.orderNumber,
          room_type_name: this.queryForm.room=='全部' ? '' : this.queryForm.room,
          nationality: ref,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }).then(e => {
					this.orderList = e.data.data.rows
          this.total = e.data.data.total
				}).catch(e => {})
			},
      getRoomApi() {
        this.$ajax.post('troom/getRoomAll',{
          keys: '',
          status: [1,2],
        }).then(e => {
          if(e.data.flag) {
            e.data.data.map(item => {
              if(item.room_type_flag == 1) {
                this.roomOptions.push({
                  value: item._id,
                  label: item.room_type_name,
                })
              }
            })
          }
        }).catch(e => {})
      },
			exportExcel () {
       var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
       var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
       try {
           FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'myorder.xlsx')
       } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
       return wbout
     	},
     	searchGoods() {
        this.getApi()
     	},
      handlePageChange(pageNum) {
        this.pageNum = pageNum
        this.getApi()
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize
        this.pageNum = 1
        this.getApi()
      },
		},
		created() {
      this.getRoomApi()
			this.getApi()
		},
	}
</script>

<style lang="less" scoped>
	.query-form{
	  margin-bottom: 20px;
	  padding: 25px 25px 0;
	  margin-right: 20px;
	  background-color: #ecf8ff;
	  border-radius: 10px;
	  .el-input{
	      width:320px;
	  }
	  .el-select{
	      width:320px;
	  }
	}
</style>