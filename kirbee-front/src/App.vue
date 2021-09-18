<template>
  <div class="App">
    <div class="game">
      {{showExPoint}}
      {{isPlayerNumberOk}}
      <div v-if="isMenu" class="demo-scene">
          <p>{{ status }}</p>
          <button @click="ping">Ping</button>
          <br>
          <br>
          <button v-if="isPlayerNumberOk" @click="play">Jouer</button>
      </div>
      <div v-if="!isMenu" class="play-scene">
        <button @click="play" class="quit-button">Quitter</button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import { ref } from 'vue';

export default {
  name: 'App',

  data() {
    return {
      isMenu: true
    }
  },

  methods: {
    play() {
      this.isMenu = false
    },
    quit() {
      this.isMenu = true
    }
  },

  setup () {
    let isPlayerNumberOk = ref(false);
    let showExPoint = ref(false);
    const status = ref('connecting...');
    const socket = io(`${location.protocol}//${location.hostname}:3006`);
    socket.on('connect', () => {
      status.value = 'connected';
      console.log('coucou');
    });
    socket.on('disconnect', () => {
      status.value = 'disconnected';
      console.log('coucou')
    });
    socket.on('reconnect', () => {
      status.value = 'connected';
    });
    socket.on('pong', () => {
      console.log('pong received !');
    });

    socket.on('other player disconnected', () => {console.log('other player disconnected')})

    socket.on('p', (arg) => {console.log(arg); isPlayerNumberOk.value = arg === 2 ;});

    socket.on('!', () => showExPoint.value = true);

    socket.on('Win', () => console.log('You win !'));

    socket.on('Lose', () => console.log('You lose ...'));

    socket.on('ToSoonLose', () => console.log('Trop pressé'));

    socket.on('ToSoonWin', () => console.log('ToSoonWin'));
    socket.on('player 1', () => console.log('You are player one'));
    socket.on('player 2', () => console.log('You are player two'));


    const ping = () => socket.emit('ping');

    return {
      status,
      ping,
      isPlayerNumberOk,
      showExPoint
    }
  }
}
</script>

<style scoped>
.App {
  width: 100%;
  height: 100%;
  background: url(/images/background.png) center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game {
  width: 512px;
  max-width: 90%;
  height: 444px;
  max-height: 90%;
  background: url(/images/background.png) center center;
  box-shadow: 0 0 9px rgb(0 0 0 / 60%), 0 0 0 9999px rgb(255 255 255 / 40%);
  border-radius: 5px;
  overflow: hidden;
}

.demo-scene {
  height: 100%;
  padding: 0.7rem;
  text-align: center;
  color: white;
}

.demo-scene p {
  margin-bottom: 2rem;
}

.quit-button {
  float: right;
  margin-right: 10px;
  margin-top: 10px;
}
</style>