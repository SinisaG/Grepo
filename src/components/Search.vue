<template>
  <div class="row">
    <div v-if="showError" class="error-api z-depth-4">
        Error: {{error}} - 
        <a href="https://api.github.com/rate_limit" target="_blank">Check your rate limit</a>
    </div>
    <div class="col s12">
      <form>
        <label for="searchField">Search repos</label>
        <input id="searchField" v-model="searchTerm" placeholder="Username" />
      </form>
      <div v-if="repos.length > 0">
        <div class="collection">
          <a class="collection-item" v-for="repo in repos" v-on:click="addProject(repo)">
            {{repo.name}}
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
      searchTerm: '',
      error: ''
    }
  },
  watch: {
    searchTerm: function () {
      this.searchTermUpdate()
    }
  },
  computed: {
    showError: function () {
      return this.error.length > 0
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
          return response.json().then(function (error) { throw error })
        }
      })
      .then(function (data) {
        this.repos = data
      }.bind(this))
      .catch(function (error) {
        this.repos = []
        this.error = error.message
        window.setTimeout(function () {
          this.error = ''
        }.bind(this), 12000)
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
  a:hover {
    cursor: pointer;
  }

.error-api {
  position: fixed; 
  top: 0;
  bottom: 0;
  left: 0; 
  right: 0;
  padding: 20vh 12px 24px;
  background: rgba(0, 0, 0, 0.8);
  color: #ee6e73;
  font-weight: bold;
  font-size: 36px;
  border-radius: 4px;
  -webkit-animation: fade 10s infinite; /* Safari 4.0 - 8.0 */
  -webkit-animation-delay: 5s; /* Safari 4.0 - 8.0 */
  animation: fade 10s infinite;
  animation-delay: 5s;
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
</style>