<template class="template-class">
  <div id="top-ten-container" class="prevent-select">
    <table
      style="
        width: 100%;
        border-radius: 12px;
        border: 1px solid;
        background-color: rgba(255, 255, 255, 0.8);
        color: black;
      "
    >
      <tr>
        <td colspan="4" style="text-align: center; position: relative">
          <button
            style="border: 0.5px solid; border-radius: 8px; position: absolute; right: 0; top: 0"
            @click="onClickExit"
          >
            ❌
          </button>

          <label for="">{{ this.loading ? 'Loading...' : '' }} TOP TEN FOR 👉🏾</label>
          <select
            @change="getScores($event.target.value)"
            name="level"
            id="level"
            style="margin-left: 20px"
          >
            <option
              key="showAll"
              :value="JSON.stringify(this.showAll)"
              :selected="this.isItDefault(this.showAll.id)"
            >
              {{ this.showAll.difficulty }}
            </option>
            <option
              v-for="difficulty in props.difficulties"
              :key="difficulty"
              :value="JSON.stringify(difficulty)"
              :selected="this.isItDefault(difficulty.difficultyId)"
            >
              {{ difficulty.difficulty }}
            </option>
          </select>
        </td>
      </tr>

      <tr>
        <th style="width: 10%; border: 1px solid black">RANK</th>
        <th style="width: 35%; border: 1px solid black">USERNAME</th>
        <th style="width: 35%; border: 1px solid black">DIFFICULTY</th>
        <th style="width: 20%; border: 1px solid black">SCORE</th>
      </tr>
      <tr v-for="(score, index) in this.topten" :key="score" :index="index">
        <td style="text-align: center; border: 1px solid black">{{ index + 1 }}</td>
        <td style="text-align: center; border: 1px solid black">
          {{ score.userId.username  }}
        </td>
        <td style="text-align: center; border: 1px solid black">
          {{ score.difficultyId.difficulty }}
        </td>
        <td style="text-align: center; border: 1px solid black">{{ score.value }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  name: 'TopTen',
  props: ['props'],
  components: {},
  data() {
    return {
      loading: false,
      rank: 0,
      topten: {},
      users: {},
      showAll: { id: 0, difficulty: 'All' }
    }
  },
  methods: {
    isItDefault(Id) {
      return Id === 0
    },
    onClickExit() {
      this.$router.push('/')
    },
    getScores(level) {
      this.loading = true
      const parsed_difficulty = JSON.parse(level)
      console.log(level)
      const query = parsed_difficulty.id === 0 ? '' : `?level=${parsed_difficulty._id}`
      return fetch(this.props.baseURL + `/scores${query}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('could not get items')
          }
          return response.json()
        })
        .then((res) => {
          this.topten = res.data
          this.loading = false
          return res
        })
    }
  },

  async mounted() {
    this.loading = true
    await this.getScores(JSON.stringify(this.showAll))
    this.loading = false
  }
}
</script>
<style scoped>
#top-ten-container {
  /* position: absolute; */
  width: 80vw;
  height: 80vh;
  /* z-index: 100; */
  height: 100%;
  padding: 25px;
}
.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
