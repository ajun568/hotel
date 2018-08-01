<template>
  <div class="register-container">
    <el-form class="register-form" autoComplete="off" :model="registerForm" ref="registerForm" label-position="left">
      <h3 class="title">系统注册</h3>
      <el-form-item prop="username">
        <i class="iconfont svg-container">&#xe670;</i>
        <el-input name="username" type="text" v-model="registerForm.username" autoComplete="off" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <i class="iconfont svg-container">&#xe613;</i>
        <el-input name="password" :type="pwdType" v-model="registerForm.password" autoComplete="off"
          placeholder="请输入密码" />
        <span class='show-pwd' @click='showPwd'><i class="iconfont">&#xe604;</i></span>
      </el-form-item>
      <el-form-item prop="password">
        <i class="iconfont svg-container">&#xe613;</i>
        <el-input name="password" :type="repwdType" v-model="registerForm.repassword" autoComplete="off"
          placeholder="请输入密码" />
        <span class='show-pwd' @click='showRepwd'><i class="iconfont">&#xe604;</i></span>
      </el-form-item>
      <el-button 
        type="primary" 
        style="width:100%;margin-bottom:30px;" 
        :loading="loading" 
        @click="toRegister">注册
      </el-button>
      <router-link to="login">
      	<p class="register"><i class="iconfont">&#xe61a;</i> 已有账号，去登录</p>
      </router-link>
    </el-form>
  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  name: 'register',
  data() {
    return {
      registerForm: {
        username: '',
        password: '',
        repassword: '',
      },
      pwdType: 'password',
      repwdType: 'password',
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

    showRepwd() {
    	if (this.repwdType === 'password') {
        this.repwdType = ''
      } else {
        this.repwdType = 'password'
      }
    },

    toRegister() {
      if(this.registerForm.username == '' || this.registerForm.password == '') {
        this.$message.error('用户名或密码不能为空')
      }
      else if(this.registerForm.password != this.registerForm.repassword) {
        this.$message.error('两次密码输入不一致')
      }
      else {
        this.$ajax.post('users/register',{
          username: this.registerForm.username,
          password: md5(this.registerForm.password),
        }).then(e => {
          if(!e.data.flag) {
            this.$message.error('这个用户名被注册过')
          } else {
            this.$message.success('注册成功')
            this.$router.push({name:'login'})
          }
        }).catch(e => {
          this.$message.error('网络错误，或者服务器发生了点小意外')
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
  .register-container {
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
    .register-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 80px auto;
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
	.register-container {
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