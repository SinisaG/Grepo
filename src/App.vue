<template>
  <div class="row">
    <nav class="col s12">
      <div class="nav-wrapper">
        <a href="#" class="brand-logo">Grepo</a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li v-if="!user.loggedIn">
            <a v-on:click="login" class="waves-effect waves-light btn">
              Authorize with git
            </a>
          </li>
          <li v-else>
              <span class="username">Hello {{user.name}}</span>
          </li>
        </ul>
      </div>
    </nav>
    <div class="col s12 l2">
          <search></search>
    </div>
    <div class="col s12 l10">
        <display-list></display-list>
        <stats></stats>
    </div>
    <div v-if="error.display" class="error-api z-depth-4">
      Error: {{error.message}}
      <br/>
      <br/>
      <a href="https://api.github.com/rate_limit" target="_blank">Check your rate limit</a>
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
import Hello from 'hellojs'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    projectList: [],
    error: {
      display: false,
      message: ''
    },
    user: {
      loggedIn: false,
      accessToken: '',
      name: ''
    }
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
    },
    raiseError (state, error) {
      state.error.display = true
      state.error.message = error.message
    },
    clearError (state) {
      state.error.display = false
      state.error.message = ''
    },
    login (state, [data, user]) {
      state.user.accessToken = data.authResponse.access_token
      state.user.name = user.name
      state.user.loggedIn = true
    }
  },
  actions: {
    raiseErrorAsync (context, error) {
      let commit = context.commit
      commit('raiseError', error)
      window.setTimeout(function () {
        commit('clearError')
      }, 12000)
    }
  }
})

export default {
  name: 'app',
  store,
  data () {
    return {
      error: this.$store.state.error,
      github: Hello('github'),
      user: this.$store.state.user,
      clientId: process.env.CLIENT_ID
    }
  },
  mounted () {
    Hello.init({ github: this.clientId })
  },
  methods: {
    login: function () {
      this.github.login(function (data) {
        this.github.api('me').then(function (user) {
          this.$store.commit('login', [data, user])
        }.bind(this))
      }.bind(this))
    }
  },
  components: {
    'search': Search,
    'display-list': DisplayList,
    'stats': Stats
  }
}
</script>

<style>
  .error-api {
    position: fixed; 
    top: 100px;
    right: 20px; 
    padding: 24px;
    background: rgba(0, 0, 0, 0.8);
    color: #ee6e73;
    font-weight: bold;
    font-size: 16px;
    border-radius: 4px;
    width: 400px;
    max-width: 100%;
    -webkit-animation: fade 10s infinite; /* Safari 4.0 - 8.0 */
    -webkit-animation-delay: 5s; /* Safari 4.0 - 8.0 */
    animation: fade 10s infinite;
    animation-delay: 5s;
    z-index: 99;
  }
  /* Safari 4.0 - 8.0 */
  @-webkit-keyframes fade {
      from {opacity: 1;}
      to {opacity: 0;}
  }

  @keyframes fade {
      from {opacity: 1;}
      to {opacity: 0;}
  }

  nav {
    margin-bottom: 20px;
  }

  nav .username {
    font--size: 16px;
    font-weight: bold;
    padding: 24px;
  }
</style>
