
<template>
  <div class="row">
    <div class="col s12 l8">
      <div v-if="displayComponent">
        <div v-for="item in displayList" v-on:click="removeItem(item)" class="chip">
          {{item.name}}
          <i class="close material-icons">close</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'displayList',
  data () {
    return {
      displayList: this.$store.state.projectList
    }
  },
  computed: {
    displayComponent: function () {
      return this.displayList.length > 0
    }
  },
  methods: {
    removeItem: function (item) {
      this.$store.commit('remove', item)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>