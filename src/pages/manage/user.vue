<template>
	<div class="g-container">
		<el-table :data="userList" style="width: 100%" border>
    	<el-table-column prop="client_username" label="用户名" min-width="100"></el-table-column>
      <el-table-column prop="avatar" label="头像" width="140">
        <template slot-scope="scope">
            <img class="inline-img" :src="scope.row.avatar" style="width:100px;height:100px;"/>
        </template>
      </el-table-column>
      <el-table-column prop="client_name" label="真实姓名" min-width="100"></el-table-column>
      <el-table-column prop="nationality" label="国籍" min-width="100">
        <template slot-scope="scope">
          <span v-if="!scope.row.nationality">中国</span>
          <span v-else>{{scope.row.country}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="idcard" label="证件号码" min-width="160">
        <template slot-scope="scope">
          <span v-if="!scope.row.nationality">身份证：{{scope.row.idcard}}</span>
          <span v-else>护照：{{scope.row.idcard}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="idcard" label="是否禁用" min-width="100">
        <template slot-scope="scope">
          {{scope.row.disable ? '否' : '是'}}
        </template>
      </el-table-column>
      <el-table-column prop="action" min-width="120" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.disable" @click="forbidden(scope.row._id)">禁用</el-button>
          <el-button v-else @click="forbidden(scope.row._id)">还原</el-button>
        </template>
      </el-table-column>
    </el-table>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				userList: [],
			}
		},
		methods: {
			getApi() {
				this.$ajax.post('client/getInfo',{}).then(e => {
					this.userList = e.data.data
				}).catch(e => {})
			},
			forbidden(id) {
				this.$ajax.post('client/disable',{
					id: id,
				}).then(e => {
					this.getApi()
				}).catch(e => {})
			},
		},
		created() {
			this.getApi()
		},
	}
</script>

<style lang="less" scoped>
	
</style>