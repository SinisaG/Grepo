<template>
  <div class="row">
    <div class="col s4">
          <search></search>
    </div>
    <div class="col s8">
        <display-list></display-list>
        <stats></stats>
    </div>
  </div>
</template>

<script>
import Search from './components/Search'
import DisplayList from './components/DisplayList'
import Stats from './components/Stats'
import _ from 'lodash'
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    projectList: []
  },
  mutations: {
    add (state, project) {
      var has = _.some(state.projectList, {'id': project.id})
      if (!has) {
        state.projectList.push(project)
      }
    },
    remove (state, project) {
      state.projectList = _.remove(state.projectList, function (n) {
        return n.id !== project.id
      })
    }
  }
})

export default {
  name: 'app',
  store,
  components: {
    'search': Search,
    'display-list': DisplayList,
    'stats': Stats
  }
}
</script>

<style scoped>

</style>
