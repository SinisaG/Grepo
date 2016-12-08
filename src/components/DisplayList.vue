
<template>
  <div class="row">
    <div class="col s12">
      <div v-if="displayComponent">
        <ul>
          <li v-for="item in displayList" class="inline-list" v-on:click="removeItem(item)">
            {{item.name}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'displayList',
  computed: {
    displayList: function () {
      return this.$store.state.projectList
    },
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
  .inline-list {
    display: inline-block;
    border-radius: 4px;
    margin: 2px;
    background: grey;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
  }
  
  .inline-list:hover {
    background: red;
    cursor: pointer;
    color: white;
  }
</style>