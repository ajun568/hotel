<template>
	<div class="container">
		<div class="navbar">
			<div class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner">
						<span class="nav-select">
							<i class="iconfont">&#xe64f;</i>
						</span>
						<img :src="avatar"/>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item><router-link to="/">个人中心</router-link></el-dropdown-item>
						<el-dropdown-item><router-link to="/manage/basicSetting">设置</router-link></el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
			<div class="username">
				{{name}}
			</div>
			<div class="username mr1" @click="fullScreen">
				<i class="iconfont">&#xe614;</i>
			</div>
		</div>
	</div>
</template>

<script>
	import screenfull from 'screenfull'
	export default {
		props:['avatar','name'],
		data() {
			return {
				
			}
		},
		methods: {
			fullScreen() {
	      if (!screenfull.enabled) {
	        this.$message.error('失败了哟，找找原因！')
	        return false
	      }
	      screenfull.toggle()
			},
			logout() {
				sessionStorage.removeItem('token')
				sessionStorage.removeItem('username')
				this.$router.push({name:'login'})
			}
		},
	}
</script>

<style lang="less" scoped>
	.container {
		top: 0px;
		bottom: 0px;
		width: 100%;

		.navbar {
			height: 70px;
			line-height: 70px;
			background: #fff;
			box-shadow: 0 1px 2px #999;

			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					img {
						width: 50px;
						height: 50px;
						border-radius: 8px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}

				.nav-select {
					display: block;
					float: right;
					width: 20px;
					height: 20px;
					margin-top: 10px;
					margin-left: 5px;
					.iconfont {
						font-size: 12px;
						cursor: pointer;
					}
				}
			}

			.username {
				float: right;
				cursor: pointer;
				font-size: 18px;
				font-weight: bolder;
				color: #190427;
			}
		}
	}
</style>