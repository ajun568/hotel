<template>
	<div>
		<navbar :avatar='avatar' :name='name'></navbar>
    <sidebar></sidebar>
    <router-view/>
	</div>
</template>

<script>
import navbar from '@/components/bar/navbar'
import sidebar from '@/components/bar/sidebar'
export default {
  name: 'App',
  components: {
    sidebar,
    navbar,
  },
  data(){
    return {
      avatar: '',
      name: ''
    }
  },
  created(){
    this.$ajax.post('users/getInfo',{}).then(e => {
            this.name = e.data.name ? e.data.name : '店铺名称'
            this.avatar = e.data.avatar ? e.data.avatar : 'https://weapp-1253522117.image.myqcloud.com//image/20180327/534e48977957d8dd.jpg'
    }).catch(e => {})
  }
}
</script>