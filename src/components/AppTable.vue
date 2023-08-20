<template class="template-class">
  <div style="position: relative">
    <span class="green">BATTLESHIP </span>
    <span class="green" style="position: absolute; right: 0">SCORE: {{ this.score }}</span>
  </div>
  <div id="navBar" style="position: relative">
    <a @click="showTopTen">Top Ten </a>
    <span v-if="this.gameOver === true">| <a @click="playAgain">PLAY AGAIN</a> | </span>
    <a @click="quitBattleship" style="position: absolute; right: 0">LOG OUT</a>
  </div>

  <div>
    Hi, {{ props.userInfo.username }}!
    <div v-if="this.baseOneAllShotCells.length === 0" style="display: inline">
      <label for="">SELECT LEVEL</label>
      <select @change="changeLevel($event)" name="level" id="level" style="margin-left: 20px">
        <option
          v-for="difficulty in props.difficulties"
          :key="difficulty"
          :value="JSON.stringify(difficulty)"
          :selected="isSelected(difficulty.id)"
        >
          {{ difficulty.difficulty }}
        </option>

        <!-- <option value="easy" :selected = isSelected(1) >Easy</option>
        <option value="medium" :selected = isSelected(2)>Medium</option>
        <option value="hard" :selected = isSelected(3)>Hard</option> -->
      </select>
    </div>
  </div>

  <audio loop ref="audioElm" :src="this.backgroundSound"></audio>
  <div id="main" class="main">
    <div
      v-if="gameOverWindow === true"
      id="gameOverWindow"
      style="
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 15;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      "
    >
      <div style="text-align: center">
        <h1
          style="
            color: black;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.25);
            font-size: 4rem;
          "
        >
          {{ this.gameResult }}
        </h1>
        <div
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
          "
        >
          <button style="width: 150px; height: 35px; border-radius: 8px" @click="playAgain">
            PLAY AGAIN
          </button>
          <button
            style="width: 150px; height: 35px; border-radius: 8px"
            @click="this.gameOverWindow = false"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
    <div id="battleAreaContainer" class="battleAreaContainer">
      <div
        name="baseOne-container"
        :style="{ position: 'relative', width: this.tableWidth + 'px', height: '500px' }"
      >
        <RoundBomb
          :style="{ width: this.cellSize + 'px', height: this.cellSize + 'px' }"
          v-for="index in 10"
          :key="index"
          :id="'bomb' + index"
        ></RoundBomb>
        <div>
          <h3 style="display: inline">YOUR BASE</h3>
          <button
            v-if="this.baseOneAllShotCells.length === 0 && this.repositionButton === true"
            @click="this.reposition()"
            style="margin-left: 25px"
          >
            Reposition
          </button>
        </div>

        <p>{{ this.pcMsg }}</p>
        <p>{{ this.baseOneSank }} of your {{ this.baseOneShips.length }} ships sank!</p>
        <div name="table-container" :style="{ position: 'absolute', top: this.tableTop + 'px' }">
          <table id="baseOne" :style="{ background: 'transparent', width: this.tableWidth + 'px' }">
            <tr v-for="row_index in this.gridSize" :key="row_index">
              <td
                class="sm"
                :style="cssVars"
                style="border: 1px dashed red"
                :id="`baseOne-${row_index}-${col_index}`"
                v-for="col_index in this.gridSize"
                :key="col_index"
              >
                <div style="width: 100%; height: 100%"></div>
              </td>
            </tr>
          </table>

          <table id="baseOneBackLayer" :style="cssBackLayerBase()">
            <tr v-for="row_index in this.gridSize" :key="row_index">
              <td
                class="sm"
                :style="cssVars"
                :id="`baseOneCell-${row_index}-${col_index}`"
                v-for="col_index in this.gridSize"
                :key="col_index"
              ></td>
            </tr>
          </table>
        </div>
      </div>

      <div
        id="baseTwo-container"
        name="baseTwo-container"
        :style="{ position: 'relative', width: this.tableWidth + 'px', height: '500px' }"
      >
        <h3>PC Base (Click 👇🏾)</h3>
        <p>{{ this.playerMsg }}</p>
        <p>{{ this.baseTwoSank }} of PC's {{ this.baseTwoShips.length }} ships sank!</p>
        <div name="table-container" :style="{ position: 'absolute', top: this.tableTop + 'px' }">
          <table id="baseTwo" style="background: transparent; height: 100%">
            <tr v-for="row_index in this.gridSize" :key="row_index">
              <td
                class="sm"
                :style="cssVars"
                style="border: 1px dashed"
                :name="`baseTwo-${row_index}-${col_index}`"
                :id="`baseTwo-${row_index}-${col_index}`"
                v-for="col_index in this.gridSize"
                :key="col_index"
                @click="
                  onClick(
                    row_index,
                    col_index,
                    $event.target.getAttribute('name'),
                    this.baseTwoShips,
                    this.baseTwoAllShotCells,
                    this.baseTwoHits
                  )
                "
              >
                <div
                  style="width: 100%; height: 100%; position: relative"
                  :name="`baseTwo-${row_index}-${col_index}`"
                >
                  <img
                    style="position: absolute; left: 0"
                    :style="{
                      ...cssTd(row_index, col_index),
                      visibility: this.gameOver ? 'hidden' : 'visible'
                    }"
                    :src="cssSrc()"
                    alt=""
                    :name="`baseTwo-${row_index}-${col_index}`"
                    v-if="findUnit([row_index, col_index], [baseTwoAllShotCells]) === false"
                  />
                  <div
                    v-if="
                      findUnit([row_index, col_index], [baseTwoAllShotCells]) === true &&
                      findUnit([row_index, col_index], baseTwoShips) === false
                    "
                  >
                    ❌
                  </div>
                  <div
                    v-if="
                      findUnit([row_index, col_index], [baseTwoAllShotCells]) === true &&
                      findUnit([row_index, col_index], baseTwoShips) === true
                    "
                  >
                    🔥
                  </div>
                </div>
              </td>
            </tr>
          </table>

          <table id="baseTwoBackLayer" :style="cssBackLayerBase()">
            <tr v-for="row_index in this.gridSize" :key="row_index">
              <td
                class="sm"
                :style="cssVars"
                :id="`baseTwoCell-${row_index}-${col_index}`"
                v-for="col_index in this.gridSize"
                :key="col_index"
              ></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RoundBomb from './RoundBomb.vue'
export default {
  emits: ['show-top-ten', 'quit-battleship'],
  props: ['props'],
  name: 'AppTable',
  components: {
    RoundBomb
  },
  data() {
    return {
      gameOverWindow: false,
      difficulty: 1,
      tableWidth: 330,
      level: 'easy',
      symbol: '❌',
      clicked: false,
      validClick: true,
      gameOver: false,
      score: 0,
      nextFire: [],
      shipDirection: '',
      baseImage:
        'https://c8.alamy.com/comp/2H2PRC8/beautiful-ocean-waves-top-down-view-from-drone-aerial-background-landscape-of-water-texture-2H2PRC8.jpg',
      imgPositionX: 0,
      imgPositionY: 0,
      rotate: '0deg',
      cellSize: 55,
      tableTop: 100,

      gameResult: '',
      playerMsg: 'Battle Ship',
      pcMsg: 'Battle Ship',
      playerTurn: true,

      baseOneRow: 0,
      baseOneCol: 0,
      baseOneShips: [], //position of ships
      baseOneAllShotCells: [],
      baseOneHits: {},
      baseOneSank: 0,

      baseTwoRow: 0,
      baseTwoCol: 0,
      baseTwoShips: [], //position of ships
      baseTwoAllShotCells: [],
      baseTwoHits: {},
      baseTwoSank: 0,

      latestFind: [],
      latestShipIndexFind: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,

      finish: true,

      gridSize: 6,
      repositionButton: true,
      backgroundSound: 'War.mp3'
    }
  },
  methods: {
    isSelected(difficulty) {
      return difficulty === this.difficulty
    },
    showTopTen() {
      this.$emit('show-top-ten')
    },
    quitBattleship() {
      this.$emit('quit-battleship')
    },

    addUserScore(value, userId, difficultyId) {
      fetch(this.props.baseURL + '/scores', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        method: 'POST',
        body: JSON.stringify({ value, userId, difficultyId })
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Adding Score failed')
        }
        return response.json()
      })
    },
    changeLevel(event) {
      this.clearTable()
      this.changeGridSize(event)
      setTimeout(() => {
        this.playAgain()
      }, 500)
    },
    changeGridSize(event) {
      const difficulty = JSON.parse(event.target.value)
      this.difficulty = difficulty.difficulty
      this.gridSize = difficulty.gridsize
      this.cellSize = this.tableWidth / difficulty.gridsize
    },
    playAgain() {
      this.backgroundSound = 'War.mp3'
      this.gameOver = false
      this.gameOverWindow = false
      this.refresh()
      this.clearTable()
      this.positionShips('baseOne', this.baseOneShips)
      this.positionShips('baseTwo', this.baseTwoShips)
    },
    quit() {
      this.playAgain()
    },
    sleep(milliseconds) {
      let counter = 0
      const start = new Date().getTime()
      while (new Date().getTime() - start < milliseconds) {
        counter = counter + 1
      }
    },
    PcAttackPlayer() {
      this.pcMsg = 'PC is attacking!'
      this.fire(this.baseOneShips)
    },
    isShipSank(baseHits, arrayShips) {
      return (
        baseHits['shipIndex_' + this.latestShipIndexFind].cells.length ===
        arrayShips[this.latestShipIndexFind].length
      )
    },
    addHitCell(baseHits, cell) {
      // eslint-disable-next-line no-prototype-builtins
      if (baseHits.hasOwnProperty('shipIndex_' + this.latestShipIndexFind)) {
        baseHits['shipIndex_' + this.latestShipIndexFind].cells.push(cell)
      } else {
        baseHits['shipIndex_' + this.latestShipIndexFind] = { cells: [cell], sank: false }
      }
    },
    play() {
      var a = this.$refs.audioElm
      if (this.backgroundSound !== null) {
        a.play()
      }
    },
    fire(arrayShips) {
      const ref = this

      this.play()

      const bombSound = new Audio('bombSound.wav')
      bombSound.play()
      // initialization 👇🏾
      let out = true
      let found = true
      let shipDirection = ''
      let row = 1
      let col = 2

      // initialization 👆🏾
      const damageShip = Object.keys(this.baseOneHits)
      if (damageShip.length > 0) {
        let firstKey = Object.keys(this.baseOneHits)[0]

        if (this.baseOneHits[firstKey].cells.length === 1) {
          let counter = 0

          while (out === true || found === true) {
            counter++
            shipDirection = this.GetShipDirection2()

            this.nextFire = [
              this.baseOneHits[firstKey].cells[0][0] + shipDirection[0],
              this.baseOneHits[firstKey].cells[0][1] + shipDirection[1]
            ]

            row = this.nextFire[0]
            col = this.nextFire[1]

            if (row > this.gridSize || row < 1 || col > this.gridSize || col < 1) {
              out = true
            } else {
              out = false
            }
            found = this.findUnit([row, col], [this.baseOneAllShotCells])

            if (counter === 20) {
              out = false
              found = false
            }
          }
        } else if (this.baseOneHits[firstKey].sank === false) {
          let lastIndex = this.baseOneHits[firstKey].cells.length - 1
          let rowIndex0 = this.baseOneHits[firstKey].cells[0][0]
          let rowIndex1 = this.baseOneHits[firstKey].cells[1][0]
          let colIndex0 = this.baseOneHits[firstKey].cells[0][1]
          let colIndex1 = this.baseOneHits[firstKey].cells[1][1]
          let rowDiff = rowIndex1 - rowIndex0
          let colDiff = colIndex1 - colIndex0

          this.nextFire = [
            this.baseOneHits[firstKey].cells[lastIndex][0] + rowDiff,
            this.baseOneHits[firstKey].cells[lastIndex][1] + colDiff
          ]
          row = this.nextFire[0]
          col = this.nextFire[1]

          if (row > this.gridSize || row < 1 || col > this.gridSize || col < 1) {
            out = true
          } else {
            out = false
          }
          
          found = this.findUnit([row, col], [this.baseOneAllShotCells])

          if (out === true || found === true) {
            this.nextFire = [
              this.baseOneHits[firstKey].cells[0][0] - rowDiff,
              this.baseOneHits[firstKey].cells[0][1] - colDiff
            ]
            row = this.nextFire[0]
            col = this.nextFire[1]
            this.baseOneHits[firstKey].cells.pop()
            this.baseOneHits[firstKey].cells.unshift([row, col])
          }
        }
      } else {
        while (found === true) {
          row = this.getRandomNumber(this.gridSize)
          col = this.getRandomNumber(this.gridSize)
          found = this.findUnit([row, col], [this.baseOneAllShotCells])
        }
      }

      let bombTop = 0
      let bomb = document.getElementById('bomb1')
      for (let i = 1; i <= 10; i++) {
        if (document.getElementById(`bomb${i}`).style.visibility !== 'visible') {
          bomb = document.getElementById(`bomb${i}`)
          break
        }
      }

      bomb.style.top = `${bombTop}px`
      bomb.style.left = `${ref.cellSize * col - ref.cellSize}px`
      bomb.style.visibility = 'visible'

      let timer = setInterval(function () {
        // how much time passed from the start?

        bombTop = bombTop + ref.cellSize / 2

        if (bombTop >= ref.tableTop + ref.cellSize * (row - 1)) {
          bombTop = ref.tableTop + ref.cellSize * (row - 1)

          bomb.style.top = `${bombTop}px`
          clearInterval(timer) // finish the animation after 2 seconds

          setTimeout(() => {
            bomb.style.visibility = 'hidden'
          }, 3000)

          return
        }
        // draw the animation at the moment timePassed
        bomb.style.top = `${bombTop}px`
      }, 10)

      this.attack(row, col, null, arrayShips, this.baseOneAllShotCells, this.baseOneHits)
    },
    cssBackLayerBase() {
      return {
        position: 'absolute',
        'z-index': -1,
        'background-image': `url(${this.baseImage})`,
        top: 0,
        left: 0
      }
    },
    cssSrc() {
      return `${this.baseImage}`
    },
    getNumberOfHits() {
      let sum = 0
      for (let i = 0; i < this.hits.length; i++) {
        sum = sum + this.hits[i].length
      }
      return sum
    },
    cssTd(r, c) {
      return {
        'object-position': `${this.cellSize - c * this.cellSize}px ${
          this.cellSize - r * this.cellSize
        }px`,
        width: '100%',
        height: '100%',
        'object-fit': 'none',
        'z-index': 10,
        'pointer-events': 'none'
      }
    },
    clearTable() {
      for (let row = 1; row <= this.gridSize; row++) {
        for (let col = 1; col <= this.gridSize; col++) {
          // Erase all the ships 👇🏾
          document.getElementById(`baseOneCell-${row}-${col}`).innerHTML = ''
          document.getElementById(`baseTwoCell-${row}-${col}`).innerHTML = ''
          // Erase all the ships 👆🏾

          document.getElementById(`baseOne-${row}-${col}`).innerHTML = ''
        }
      }
    },
    changeImgPosition() {
      this.imgPositionX = this.imgPositionX - this.cellSize
    },
    reposition() {
      this.repositionButton = false
      this.playAgain()
      setTimeout(() => {
        this.repositionButton = true
      }, 500)
    },
    refresh() {
      this.baseOneShips = [] //position of ships
      this.baseOneAllShotCells = []
      this.baseOneHits = {}
      this.baseOneSank = 0
      this.baseOneShips = []

      this.baseTwoShips = [] //position of ships
      this.baseTwoAllShotCells = []
      this.baseTwoHits = {}
      this.baseTwoSank = 0
      this.baseTwoShips = []

      this.score = 0
    },
    attack(row, col, id, arrayShips, arrayCellsAlreadyFired, baseHits) {
      let cellId = id
      let isHit = false
      const isCellAvailable = !this.findUnit([row, col], [arrayCellsAlreadyFired])
      cellId = cellId === null ? `baseOne-${row}-${col}` : id

      if (!isCellAvailable) {
        this.validClick = false
        let prevMsg = this.playerMsg
        this.playerMsg = 'YOU ALREADY CLICKED THIS AREA!'

        setTimeout(() => {
          this.playerMsg = prevMsg
        }, 500)
        return
      }

      if (isCellAvailable) {
        this.validClick = true
        arrayCellsAlreadyFired.push([row, col]) //add array when already clicked
        // check if clicked is in the ships array
        let innerText = ''
        let score = 0
        let msg = ''
        const el = document.getElementById(`${cellId}`)

        isHit = this.findUnit([row, col], arrayShips)

        if (isHit) {
          innerText = '🔥'
          score = 250 * this.difficulty
          this.addHitCell(baseHits, [row, col])
          const shipSank = this.isShipSank(baseHits, arrayShips)
          if (shipSank) {
            this.playerTurn ? this.baseTwoSank++ : this.baseOneSank++
            score += 1000 //bonus if you sank a ship
            delete baseHits['shipIndex_' + this.latestShipIndexFind]
          }
          msg = shipSank ? 'SANK A SHIP' : 'PARTIALLY HIT'
        }

        if (!isHit) {
          innerText = '❌'
          msg = 'MISSED'
          this.score >= 100 ? (score = -100) : (score = 0)
        }

        if (this.playerTurn === true) {
          this.score += score
        }

        if (this.playerTurn === true) {
          this.playerMsg = msg
        }
        if (this.playerTurn === false) {
          this.pcMsg = msg
          setTimeout(() => {
            el.innerText = innerText
          }, 1000)
        }
      }
    },
    onClick(row, col, id, arrayShips, arrayCellsAlreadyFired, baseHits) {
      if (this.gameOver) {
        return
      }

      this.playerTurn = true
      this.attack(row, col, id, arrayShips, arrayCellsAlreadyFired, baseHits)
      if (this.isGameOver()) {
        this.gameResult = 'Game Over: You Win'
        return
      }

      if (this.validClick === false) {
        return
      }

      this.playerTurn = false
      this.PcAttackPlayer()

      if (this.isGameOver()) {
        this.gameResult = 'Game over: You Lose'
      }
    },
    isGameOver() {
      const gameOver =
        this.baseOneShips.length === this.baseOneSank ||
        this.baseTwoShips.length === this.baseTwoSank

      if (gameOver) {
        this.gameOver = true
        this.gameOverWindow = true
        this.backgroundSound = null
        this.addUserScore(this.score, this.props.userInfo.userId, this.difficulty)
      }
      return gameOver
    },
    isHit(row_index, col_index, arrayShips) {
      let findUnit = false
      findUnit = this.findUnit([row_index, col_index], arrayShips)

      return findUnit
    },
    positionShips(base, arrToSaveAllShips) {
      this.prepareUnits(1, 2, this.gridSize, arrToSaveAllShips, base)
      this.prepareUnits(1, 3, this.gridSize, arrToSaveAllShips, base)
      this.prepareUnits(2, 4, this.gridSize, arrToSaveAllShips, base)
      this.prepareUnits(1, 5, this.gridSize, arrToSaveAllShips, base)
    },
    prepareUnits(qty, unitsPerShip, gridSize, arrToSaveAllShips, base) {
      let cell = null
      let unit = null
      let shipDirection = null
      let counter = 0
      while (counter < qty) {
        let arrayShip = []
        while (arrayShip.length < unitsPerShip) {
          if (arrayShip.length === 0) {
            let shipOutsideGrid = true //initial value
            while (shipOutsideGrid === true) {
              cell = this.GetCell(gridSize) // will return unit, row, column i.e. ['B3', 2, 3], should be [2,3], row then col
              shipDirection = this.GetShipDirection()
              shipOutsideGrid = this.outsideGrid(
                shipDirection,
                cell[0],
                cell[1],
                unitsPerShip,
                gridSize
              )
            }
            unit = [cell[0], cell[1]] //will return the cell address in this format 'C5', should be [row,col]
          } else {
            unit = this.getNextUnit(shipDirection, cell[0], cell[1], arrayShip.length)
          }
          // check if a unit will overlap other ship
          let unitTaken = this.findUnit(unit, JSON.parse(JSON.stringify(arrToSaveAllShips)))

          if (unitTaken === true) {
            //restart
            arrayShip = []
          } else {
            arrayShip.push(unit)
          }
        }

        this.w = this.cellSize * arrayShip.length
        this.h = this.cellSize

        if (shipDirection === 'right') {
          this.top = this.cellSize * arrayShip[0][0] - this.cellSize
          this.left = this.cellSize * arrayShip[0][1] - this.cellSize
          this.rotate = '0deg'
        }
        if (shipDirection === 'left') {
          this.top = this.cellSize * arrayShip[0][0] - this.cellSize
          this.left = this.cellSize * arrayShip[0][1] - this.cellSize * arrayShip.length
          this.rotate = '180deg'
        }
        if (shipDirection === 'down') {
          this.top =
            this.cellSize * arrayShip[0][0] -
            this.cellSize +
            (arrayShip.length - 1) * (this.cellSize / 2)
          this.left =
            this.cellSize * arrayShip[0][1] -
            this.cellSize -
            (arrayShip.length - 1) * (this.cellSize / 2)
          this.rotate = '90deg'
        }
        if (shipDirection === 'up') {
          this.top =
            this.cellSize * arrayShip[0][0] -
            this.cellSize * arrayShip.length +
            (arrayShip.length - 1) * (this.cellSize / 2)
          this.left =
            this.cellSize * arrayShip[0][1] -
            this.cellSize -
            (arrayShip.length - 1) * (this.cellSize / 2)
          this.rotate = '270deg'
        }
        // here
        document.getElementById(`${base}Cell-${arrayShip[0][0]}-${arrayShip[0][1]}`).innerHTML = `
        <img
        style="
        width:${this.w}px; 
        height: ${this.h}px; 
        object-fit:fill; 
        position: absolute; 
        top: ${this.top}px; 
        left: ${this.left}px;
        transform: rotate(${this.rotate});
        z-index: -2;"
        src="battleship.png" 
        alt="">`

        arrToSaveAllShips.push(arrayShip)
        counter++
      }
    },
    GetCell(gridSize) {
      let rndRow = this.getRandomNumber(gridSize) //get random number for row
      let rndCol = this.getRandomNumber(gridSize) //get random number for col
      return [rndRow, rndCol]
    },
    GetShipDirection() {
      let randomShipDirection = ['up', 'down', 'left', 'right']
      let shipDirection = randomShipDirection[this.getRandomNumber(4) - 1]

      switch (shipDirection) {
        case 'up':
          return 'up'
        case 'down':
          return 'down'
        case 'left':
          return 'left'
        case 'right':
          return 'right'
      }
    },
    GetShipDirection2() {
      let randomShipDirection = ['up', 'down', 'left', 'right']
      let shipDirection = randomShipDirection[this.getRandomNumber(4) - 1]

      switch (shipDirection) {
        case 'up':
          return [-1, 0]
        case 'down':
          return [1, 0]
        case 'left':
          return [0, -1]
        case 'right':
          return [0, 1]
      }
    },
    outsideGrid2(shipDirection, row, col, unitsPerShip, gridSize) {
      switch (shipDirection) {
        case '-1,0':
          if (row - unitsPerShip <= 0) {
            return true
          } else {
            return false
          }
        case '1,0':
          if (row + unitsPerShip > gridSize) {
            return true
          } else {
            return false
          }
        case '0,-1':
          if (col - unitsPerShip <= 0) {
            return true
          } else {
            return false
          }
        case '0,1':
          if (col + unitsPerShip > gridSize) {
            return true
          } else {
            return false
          }
      }
    },
    outsideGrid(shipDirection, row, col, unitsPerShip, gridSize) {
      switch (shipDirection) {
        case 'up':
          if (row - unitsPerShip <= 0) {
            return true
          } else {
            return false
          }
        case 'down':
          if (row + unitsPerShip > gridSize) {
            return true
          } else {
            return false
          }
        case 'left':
          if (col - unitsPerShip <= 0) {
            return true
          } else {
            return false
          }
        case 'right':
          if (col + unitsPerShip > gridSize) {
            return true
          } else {
            return false
          }
      }
    },
    getNextUnit(shipDirection, row, col, difference) {
      switch (shipDirection) {
        case 'up':
          return [row - difference, col]
        case 'down':
          return [row + difference, col]
        case 'left':
          return [row, col - difference]
        case 'right':
          return [row, col + difference]
      }
    },
    findUnit(unit, ships) {
      let result = false
      for (let i = 0; i < ships.length; i++) {
        for (let b = 0; b < ships[i].length; b++) {
          result = JSON.stringify(unit) === JSON.stringify(ships[i][b])
          if (result === true) {
            this.latestFind = unit
            this.latestShipIndexFind = i
            break
          }
        }
        if (result === true) {
          break
        }
      }
      return result
    },
    getRandomNumber(maxNum) {
      return Math.floor(Math.random() * maxNum) + 1
    }
  },
  mounted() {
    this.positionShips('baseOne', this.baseOneShips)
    this.positionShips('baseTwo', this.baseTwoShips)
  },
  computed: {
    cssVars() {
      return {
        '--cellSize': `${this.cellSize}px`
      }
    }
  }
}
</script>
<style scoped>
.headers {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.active {
  border: 2px solid red;
}
td {
  text-align: center;
  border: 1px dashed;
  padding: 0;
  background: transparent;
  user-select: none;
}

.sm {
  width: var(--cellSize);
  height: var(--cellSize);
  min-width: var(--cellSize);
  min-height: var(--cellSize);
  max-height: var(--cellSize);
  max-width: var(--cellSize);
}
table {
  border-collapse: collapse;
}
template {
  position: relative;
}

.battleAreaContainer {
  display: flex;
  gap: 20px;
  flex-direction: row;
  justify-content: space-between;
}

.img {
  width: 100%;
}

.main {
  /* border: 2px solid red; */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
}

@media (min-width: 360px) {
  .battleAreaContainer {
    flex-direction: column;
    justify-content: center;
  }
}

@media (min-width: 720px) {
  .battleAreaContainer {
    flex-direction: row;
  }
}

@media (min-width: 1024px) {
  .battleAreaContainer {
    flex-direction: row;
  }
}
</style>
