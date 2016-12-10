<template>
  <div class="row">
    <div class="col s12 l2">
          <search></search>
    </div>
    <div class="col s12 l10">
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
        state.projectList.splice(state.projectList.length, 1, project)
      }
    },
    remove (state, project) {
      var idx = _.findIndex(state.projectList, function (p) { return p.id === project.id })
      state.projectList.splice(idx, 1)
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
