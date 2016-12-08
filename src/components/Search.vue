<template>
  <div class="row">
    <div class="col s12">
      <form>
        <label for="searchField">Search repos</label>
        <input id="searchField" v-model="searchTerm" placeholder="Search user's repos'" />
      </form>
      <div v-if="error">
        {{error}}
      </div>
      <div v-if="repos.length > 0">
        <h3> Repos </h3>
        <ul>
          <li v-for="repo in repos" v-on:click="addProject(repo)">
            {{repo.name}}
          </li>
        </ul>
      </div>
      <div v-if="selectedProjects.length > 0">
        <h3>Selected projects</h3>
        <ul>
          <li v-for="project in selectedProjects" class="inline-list" v-on:click="removeProject(project)">
            {{project.name}}
          </li>
        </ul>
      </div>
      <div v-if="allContributors.length > 0">
        <h3>Contributors</h3>
        <button type="button" v-on:click="drawGraph">Draw</button>
        <ol>
          <li v-for="contributor in allContributors">
            <a :href="contributor.url">
                {{contributor.name}} {{contributor.value}} 
            </a>
          </li>
        </ol>
        <canvas id="myChart" width="400" height="400"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Chart from '../../node_modules/chart.js/src/chart.js'

export default {
  name: 'search',
  data () {
    return {
      repos: [],
      searchTerm: '',
      error: '',
      selectedProjects: [],
      allContributors: [],
      myChart: null
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
      var has = _.some(this.selectedProjects, {'id': project.id})
      if (!has) {
        this.selectedProjects.push(project)
        this.calculate()
      }
    },
    removeProject: function (project) {
      this.selectedProjects = _.remove(this.selectedProjects, function (n) {
        return n.id !== project.id
      })
      this.calculate()
    },
    calculate: function () {
      const grabContent = url => window.fetch(url)
      .then(res => res.json())
      var data = []
      var contributorsCounter = {}
      this.selectedProjects.forEach(function (project) {
        data.push(grabContent(project.contributors_url))
      })
      data.forEach(function (repo) {
        repo.then(function (repoContributors) {
          repoContributors.forEach(function (c) {
            contributorsCounter[c.login] = contributorsCounter[c.login] || {}
            var current = contributorsCounter[c.login].value || 0
            contributorsCounter[c.login].value = current + c.contributions
            contributorsCounter[c.login].url = c.html_url
          })
          this.showContributors(contributorsCounter)
        }.bind(this))
      }.bind(this))
    },
    showContributors: function (contributorsCounter) {
      var result = []
      for (var key in contributorsCounter) {
        if (contributorsCounter.hasOwnProperty(key)) {
          result.push({name: key, value: contributorsCounter[key].value, url: contributorsCounter[key].url})
        }
      }
      result = _.sortBy(result, [function (o) { return -o.value }])
      this.allContributors = result
    },
    drawGraph: function () {
      var elements = this.allContributors
      var ctx = window.document.getElementById('myChart')
      if (this.myChart) {
        this.myChart.destroy()
      }
      var labels = []
      var contributions = []
      var backgrounds = []
      var borders = []
      for (var i = 0; i < elements.length; i++) {
        var current = elements[i]
        contributions.push(current.value)
        labels.push(current.name)
        backgrounds.push(getRandomColor())
        borders.push(getRandomColor())
      }
      this.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '# of Contributions',
            data: contributions,
            backgroundColor: backgrounds,
            borderColor: borders,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      })
      function getRandomColor () {
        var letters = '0123456789ABCDEF'
        var color = '#'
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)]
        }
        return color
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
  
  .inline-list {
    display: inline-block;
    border-radius: 4px;
    margin: 0 2px;
    background: grey;
    color: white;
  }
  
  .inline-list:hover {
    background: red;
  }
</style>