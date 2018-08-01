<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="off" :model="loginForm" ref="loginForm" label-position="left">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <i class="iconfont svg-container">&#xe670;</i>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="off" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <i class="iconfont svg-container">&#xe613;</i>
        <el-input name="password" :type="pwdType" v-model="loginForm.password" autoComplete="off" placeholder="请输入密码" />
        <span class='show-pwd' @click='showPwd'><i class="iconfont">&#xe604;</i></span>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click="login">登录</el-button>
      <router-link to="register">
        <p class="register"><i class="iconfont">&#xe61a;</i> 没有账号，去注册</p>
      </router-link>
    </el-form>
  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      pwdType: 'password',
      loading: false,
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },

    login() {
      this.$ajax.post('users/login',{
        username: this.loginForm.username,
        password: md5(this.loginForm.password)
      }).then(e => {
        if(e.data.flag){
          sessionStorage.setItem('token',e.data.token)
          sessionStorage.setItem('username',e.data.username)
          if(e.data.fir_flag) {
            this.$router.push({name:'main'})
          }else {
            this.$router.push({name:'basicSetting'})
          }
        }else {
          this.$message.error('账号不存在或密码输入错误')
        }
      }).catch(e => {
        this.$message.error('网络错误，或者服务器发生了点小意外')
      })
    }
  },
}
</script>

<style lang="less" scoped>
  .login-container {
    height: 100vh;
    background-color: #2d3a4b;
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: #eee;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: #889aa4;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: #eee;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: #889aa4;
      cursor: pointer;
    }
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
    .register {
      color: #eee;
      padding: 0;
      margin: 0;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
<style lang="less">
	.login-container {
		.el-input__inner {
    	background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: #eee;
      height: 47px;
    }
	}
</style>