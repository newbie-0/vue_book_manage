<template>
     <div v-html = "alipay"> {{alipay}}</div>
</template>
<script>
export default {
  name: 'alipay',
  data() {
    return {
      alipay: ''
    }
  },
  mounted () {
    var form = this.$route.query.htmlData
    this.alipay = form
    this.$nextTick(() => {
      document.forms[0].submit()
    })
  }
}
</script>
<style>
</style>
