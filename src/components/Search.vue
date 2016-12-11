<template>
  <div class="row">
    <div class="col s12">
      <form>
        <label for="searchField">Search repos</label>
        <input id="searchField" v-model="searchTerm" placeholder="Username" />
      </form>
      <div v-if="repos.length > 0">
        <div class="collection">
          <a class="collection-item" v-for="repo in repos" v-on:click="addProject(repo)">
            {{repo.name}} ({{repo.stargazers_count}} stars)
          </a>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'search',
  data () {
    return {
      repos: [],
      searchTerm: ''
    }
  },
  watch: {
    searchTerm: function () {
      this.searchTermUpdate()
    }
  },
  methods: {
    searchTermUpdate: _.debounce(function () {
      if (!this.searchTerm) {
        this.error = ''
        this.repos = []
        return
      }
      window.fetch(this.buildUrl(`https://api.github.com/users/${this.searchTerm}/repos`, this.$store.state.user.accessToken), {
        method: 'get'
      }).then(function (response) {
        if (response.status === 200) {
          return response.json()
        } else {
          return response.json().then(function (error) { throw error })
        }
      })
      .then(function (data) {
        this.repos = _.sortBy(data, [function (o) { return -o.stargazers_count }])
      }.bind(this))
      .catch(function (error) {
        this.repos = []
        this.$store.dispatch('raiseErrorAsync', error)
      }.bind(this))
    }, 700),
    addProject: function (project) {
      this.$store.commit('add', project)
    },
    buildUrl (url, accessToken) {
      if (accessToken.length > 0) {
        return url + '?access_token=' + accessToken
      }
      return url
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  a:hover {
    cursor: pointer;
  }
</style>