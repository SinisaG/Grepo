<template>
  <div class="row">
    <div class="col s12">
      <div v-show="selectedProjects.length > 0">
        <div class="chart-wrapper">
          <canvas id="myChart" width="400" height="400"></canvas>
        </div>
        <h3>Contributors</h3>
        <ol>
          <li v-for="contributor in allContributors">
            <a :href="contributor.url">
                {{contributor.name}} {{contributor.value}} 
            </a>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Chart from '../../node_modules/chart.js/src/chart.js'
Chart.defaults.global.responsive = true
export default {
  name: 'stats',
  data () {
    return {
      allContributors: [],
      myChart: null
    }
  },
  computed: {
    selectedProjects: function () {
      return this.$store.state.projectList
    }
  },
  watch: {
    selectedProjects: function () {
      this.projectChangeHandle()
    }
  },
  methods: {
    projectChangeHandle: function () {
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
      this.drawGraph(result)
    },
    drawGraph: function (elements) {
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
<style scoped>
  #myChart {
    height: auto !important;
    width: 100% !important;
  }
</style>