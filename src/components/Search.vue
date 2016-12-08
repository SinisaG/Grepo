<template>
  <div class="row">
    <div class="col s12">
      <form>
        <label for="searchField">Search repos</label>
        <input id="searchField" v-model="searchTerm" placeholder="Sinisag" />
      </form>
      <div v-if="error">
        {{error}}
      </div>
      <div v-if="repos.length > 0">
        <ul>
          <li v-for="repo in repos" v-on:click="addProject(repo)">
            {{repo.name}}
          </li>
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
      searchTerm: '',
      error: ''
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
      window.fetch(`https://api.github.com/users/${this.searchTerm}/repos`, {
        method: 'get'
      }).then(function (response) {
        if (response.status === 200) {
          return response.json()
        } else {
          this.repos = []
          this.error = response.statusText
        }
      }.bind(this))
      .then(function (data) {
        this.repos = data
      }.bind(this))
    }, 700),
    addProject: function (project) {
      this.$store.commit('add', project)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ul,
  ol {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    padding: 5px 10px;
    border-radius: 4px;
  }
  
  li:hover {
    cursor: pointer;
    background: grey;
    color: white;
  }
</style>