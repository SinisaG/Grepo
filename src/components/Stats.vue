<template>
  <div v-show="selectedProjects.length > 0" class="row">
    <div class="col l8 s12">
      <table class="striped">
        <thead>
          <tr>
            <th>
              User
            </th>
            <th>
              Contributions
            </th>
            <th>
              User Profile
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contributor in allContributors">
            <td><img :src="contributor.img" v-bind:alt="contributor.name"/> <span>{{contributor.name}}</span></td>
            <td>{{contributor.value}} </td>
            <td><a :href="contributor.url">Link</a></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="col l4 s12">
      <div class="chart-wrapper">
        <canvas id="myChart" width="400" height="400"></canvas>
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
      myChart: null,
      selectedProjects: this.$store.state.projectList
    }
  },
  watch: {
    selectedProjects: function () {
      this.projectChangeHandle()
    }
  },
  mounted () {
    this.$on('draw', this.showContributors)
  },
  methods: {
    projectChangeHandle: function () {
      this.calculate()
    },
    calculate: function () {
      const grabContent = url => window.fetch(url)
      .then(function (response) {
        if (response.status === 200) {
          return response.json()
        } else {
          return response.json().then(function (error) { throw error })
        }
      })
      var data = []

      this.selectedProjects.forEach(function (project) {
        data.push(grabContent(project.contributors_url))
      })
      var contributorsCounter = {}
      for (var i = 0; i < data.length; i++) {
        data[i].then(function (repoContributors) {
          for (var j = 0; j < repoContributors.length; j++) {
            var c = repoContributors[j]
            contributorsCounter[c.login] = contributorsCounter[c.login] || {}
            var current = contributorsCounter[c.login].value || 0
            contributorsCounter[c.login].value = current + c.contributions
            contributorsCounter[c.login].url = c.html_url
            contributorsCounter[c.login].img = c.avatar_url
          }
          if (i === (data.length)) {
            this.$emit('draw', contributorsCounter)
          }
        }.bind(this))
        .catch(function (error) {
          this.$store.dispatch('raiseErrorAsync', error)
        }.bind(this))
      }
    },
    showContributors: function (contributorsCounter) {
      var result = []
      for (var key in contributorsCounter) {
        if (contributorsCounter.hasOwnProperty(key)) {
          result.push({name: key, value: contributorsCounter[key].value, url: contributorsCounter[key].url, img: contributorsCounter[key].img})
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
      for (var i = 0; i < elements.length; i++) {
        var current = elements[i]
        contributions.push(current.value)
        labels.push(current.name)
        backgrounds.push(getColorFromName(current.name))
      }
      this.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '# of Contributions',
            data: contributions,
            backgroundColor: backgrounds,
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
      function getColorFromName (str) {
        var hash = 0
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash)
        }
        var colour = '#'
        for (var j = 0; j < 3; j++) {
          var value = (hash >> (j * 8)) & 0xFF
          colour += ('00' + value.toString(16)).substr(-2)
        }
        return colour
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

  tr img {
    width: 48px;
    height: auto;
    max-width: 100%;
    vertical-align: middle;
    display: inline-block;
    margin-right: 12px;
    border-radius: 50%;
  }
  tr span {
    vertical-align: middle;
  }
</style>
