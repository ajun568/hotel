<template>
	<div class="g-container">
		<el-radio-group @change="checkedFloor" v-model="floorModel">
      <el-radio-button v-for="(item, index) in floorArr" :label="item" :key="index">{{item}}</el-radio-button>
    </el-radio-group>
		<div class="floor">
      <div v-for="item in floorData" class="floor-box">
        <div class="floor-info">楼层：{{item.floor}}</div>
        <div class="floor-info">门牌号：{{item.house_num}}</div>
        <div class="floor-info">类型：{{item.house_type_name}}</div>
        <div class="option-panel">
          <div class="edit-btn edit-hover" @click="editHouse(item._id)">编辑</div>
          <div class="edit-btn delete-hover" @click="deleteHouse(item._id)">删除</div>
        </div>
      </div>
    </div>
    <el-pagination 
      v-if="total"
      :page-sizes="[15, 30, 45, 60]" 
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
	export default {
		data() {
			return {
				total: 0,
				floorData: [],
	      floorModel: '全部',
	      floorArr: ['全部'],

        pageNum: 1,
        pageSize: 15,
        total: 0,
			}
		},
		methods: {
			checkedFloor(item) {
        this.pageNum = 1
        this.getApi()
			},
      getApi() {
        this.$ajax.post('roomList/pagelist',{
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          floor: this.floorModel!='全部' ? this.floorModel.split('楼').join('') : 0,
        }).then(e => {
          this.floorData = e.data.data.rows
          this.total = e.data.data.total
        }).catch(e => {})
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
      editHouse(id) {
        this.$router.push({name:'houseSetting',query:{id:id}})
      },
      deleteHouse(id) {
        this.$ajax.post('roomList/delhouse',{
          id: id
        }).then(e => {
          this.$message.success('删除成功')
          if(this.floorData.length==1&&this.pageNum!=1) {
            this.pageNum = this.pageNum - 1
          }
          this.getApi()
        }).catch(e => { this.$message.error('删除失败') })
      },
		},
		created() {
			this.$ajax.post('roomList/getfloor',{}).then(e => {
        e.data.floor.map(item => {
          this.floorArr.push(item+'楼')
        })
        this.getApi()
      }).catch(e => {})
		},
	}
</script>

<style lang="less" scoped>
@theme: #0CDDD6;
@theme-bg: #ECF9EA;
.floor {
  width: 1100px;
  max-width: 1100px;
  overflow: hidden;
}
.floor-box {
  float: left;
  margin: 20px 20px 20px 0;
  padding-top: 5px;
  width: 200px;
  border-radius: 4px;
  background-color: @theme;
  color: #fff;
  .floor-info {
    padding: 4px 0 4px 10px;
  }
  .option-panel {
    margin-top: 10px;
    width: 100%;
    height: 30px;
    background-color: @theme-bg;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .edit-btn {
    width: 50%;
    float: left;
    height: 30px;
    border-bottom-left-radius: 4px;
    color: @theme;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
  .edit-hover:hover {
  	color: #38C546;
  }
  .delete-hover:hover {
  	color: #F6532D;
  }
}
.el-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>