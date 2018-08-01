<template>
  <div class="left-side">
    <div class="left-side-inner">
      <router-link to="/" class="sidebar-logo">
        <img src="@/assets/hotel-logo.png" alt="hotel-logo">
      </router-link>
      <el-menu class="menu-box" router :default-active="$route.path">
        <div v-for="(item, index) in nav_menu_data" :key="index">
          <el-menu-item class="menu-list" v-if="typeof item.child === 'undefined'" :index="item.path">
            <i 
              class="iconfont" 
              aria-hidden="true"
              v-html="item.icon">
            </i>
            <span v-text="item.title" class="text"></span>
          </el-menu-item>
          <el-submenu :index="item.path" v-else>
            <template slot="title">
              <i 
                class="iconfont" 
                aria-hidden="true"
                v-html="item.icon">
              </i>
              <span v-text="item.title" class="text"></span>
            </template>
            <el-menu-item class="menu-list" v-for="(sub_item, sub_index) in item.child" :index="sub_item.path" :key="sub_index">
              <span v-text="sub_item.title" class="text"></span>
            </el-menu-item>
          </el-submenu>
        </div>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'slide',
  data() {
    return {
      nav_menu_data: [
        {
          title: "主页",
          path: "/",
          icon: "&#xe601;"
        }, 
        {
          title: "房型设置",
          path: "/room",
          icon: "&#xe608;",
          child: [{
            title: "添加房型",
            path: "/room/addRoom"
          }, {
            title: "房型列表",
            path: "/room/roomList"
          }]
        }, 
        {
          title: "酒店管理",
          path: "/manage",
          icon: "&#xe70c;",
          child: [{
            title: "实时管理",
            path: "/manage/manageHome"
          },{
            title: "基础设置",
            path: "/manage/basicSetting"
          }]
        },
        {
          title: "房间管理",
          path: "/house",
          icon: "&#xe636;",
          child: [{
            title: "房间设置",
            path: "/house/houseSetting"
          },{
            title: "房间列表",
            path: "/house/houseList"
          }]
        },
        {
          title: "用户管理",
          path: "/user",
          icon: "&#xe619;",
          child: [{
            title: "用户列表",
            path: "/user/userList"
          }]
        },
        {
          title: "订单管理",
          path: "/order",
          icon: "&#xe63a;",
          child: [{
            title: "订单列表",
            path: "/order/orderList"
          }]
        },
        {
          title: "C端模拟",
          path: "/toC",
          icon: "&#xe665;",
          child: [{
            title: "C端注册",
            path: "/simulate/register"
          },{
            title: "移动模拟",
            path: "/simulate"
          }]
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
@sidebar-bg: #424f63;
.left-side {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 220px;
  height: 100%;
  overflow-y: auto;
  background-color: @sidebar-bg;
  .sidebar-logo {
    text-align: center;
    display: block;
    height: 70px;
    background: @sidebar-bg;
    img {
      width: 150px;
      height: 100%;
    }
  }
}
</style>

<style lang="less">
@sidebar-bg: #424f63;
.left-side {
  .menu-box {
    background-color: @sidebar-bg;
    .menu-list,
    .el-submenu__title {
      width: 220px;
      height: 45px;
      line-height: 45px;
      color: #fff;
      background-color: @sidebar-bg;
      .icon {
        width: 16px;
        font-size: 14px;
      }
      .text {
        margin-left: 10px;
      }
      &.is-active,
      &:hover {
        background-color: #353f4f;
        color: #65cea7;
      }
    }
  }
}
</style>