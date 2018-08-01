<template>
	<div class="g-container">
    <el-form  :model="queryForm" ref="queryForm"  class="query-form" label-width="80px">
      <el-row class="form">
        <el-col :md="24" :lg="10">
            <el-form-item label="房型名称">
              <el-input v-model="queryForm.roomName" placeholder="请输入房型名称"></el-input>
            </el-form-item>
        </el-col>
        <el-col  :md="24" :lg="10">
            <el-form-item label="房型状态">
              <el-checkbox-group v-model="queryForm.roomStatus">
                <el-checkbox :label="hotelMap[0]"></el-checkbox>
                <el-checkbox :label="hotelMap[1]"></el-checkbox>
                <el-checkbox :label="hotelMap[2]"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
        </el-col>
        <el-col  :md="12" :lg="2" :pull="1">
            <el-form-item label="">
                <el-button type="primary" @click="searchGoods" icon="search">查询房型</el-button>
            </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="roomList" style="width: 100%" border>
    	<el-table-column prop="room_type_name" label="房型名称" min-width="130">
        <template slot-scope="scope">
            <span class="room-title" @click="editHotel(scope.row._id)">{{scope.row.room_type_name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pic" label="房型图片" width="140">
        <template slot-scope="scope">
            <img class="inline-img" :src="scope.row.pic" style="width:100px;height:100px;"/>
        </template>
      </el-table-column>
      <el-table-column prop="roomModel" label="房型概要" min-width="200">
        <template slot-scope="scope">
            <p><i class="iconfont">&#xe673;</i> 面积：{{scope.row.room_area}}㎡</p>
            <p><i class="iconfont">&#xe636;</i> 床型：{{scope.row.bed_type}}m</p>
            <p><i class="iconfont">&#xe661;</i> 早餐：{{scope.row.breakfeast ? '含' : '无'}}早</p>
        </template>
      </el-table-column>
      <el-table-column prop="room_type_price" label="售价价格（¥）" width="130">
        <template slot-scope="scope">
            <span style="color:#325BFF;">¥{{scope.row.room_type_price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="room_type_flag" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="status(scope.row.room_type_flag)">{{hotelMap[scope.row.room_type_flag]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="action" width="220" label="操作">
        <template slot-scope="scope">
          <el-button @click="editHotel(scope.row._id)" size="mini" type="success" icon="edit">编辑</el-button>
          <el-button v-if="scope.row.room_type_flag==1" @click="stopDoBusiness(scope.row._id)" size="mini" type="warning">下架</el-button>
          <el-button v-if="scope.row.room_type_flag!=1" @click="stopDoBusiness(scope.row._id)" size="mini" type="primary">上架</el-button>
          <el-button @click="delHotel(scope.row._id)" size="mini" type="danger" icon="delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
	</div>
</template>

<script>
	import { hotelMap } from '@/map/map.js'
	export default {
		data() {
			return {
				hotelMap: hotelMap,
				queryForm: {
          roomName: '',
          roomStatus: [hotelMap[0],hotelMap[1],hotelMap[2]],
        },
        roomList: [],
			}
		},

		methods: {
      getApi() {
        let ref = []
        if(this.queryForm.roomStatus) {
          this.queryForm.roomStatus.forEach(item => {
            if(item == this.hotelMap[0]) {
              ref.push(0)
            }
            else if(item == this.hotelMap[1]) {
              ref.push(1)
            }
            else if(item == this.hotelMap[2]) {
              ref.push(2)
            }
          })
        }
        this.$ajax.post('troom/getRoomAll',{
          keys: this.queryForm.roomName,
          status: ref.sort(),
        }).then(e => {
          if(e.data.flag) {
            this.roomList = e.data.data
          }
        }).catch(e => {})
      },

			editHotel(id) {
				this.$router.push({name:'addRoom',query:{id:id}})
			},

			delHotel(id) {
        this.$ajax.post('troom/del',{
          _id: id
        }).then(e => {
          this.getApi()
          this.$message.success('删除成功')
        }).catch(e => {this.$message.error('服务器又故障了哟！')})
			},

			stopDoBusiness(id) {
        this.$ajax.post('troom/roomStatus',{
          _id: id
        }).then(e => {
          this.getApi()
          this.$message.success('修改成功')
        }).catch(e => {})
			},

			status(value) {
				if(value == 0) {
					return 'warning'
				}
				if(value == 1) {
					return 'success'
				}
				if(value == 2) {
					return ''
				}
			},

			searchGoods() {
        this.getApi()
			},
		},

    mounted() {
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

.room-title {
	cursor: pointer;
	color: #325BFF;
}
</style>