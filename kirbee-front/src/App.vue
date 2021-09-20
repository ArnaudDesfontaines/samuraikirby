<template>
  <div class="App">
    <div class="game">
      <div v-if="isMenu" class="demo-scene">
          <p>{{ status }}</p>
          <button @click="ping">Ping</button>
          <div class="player-name">
            Tu es {{ isPlayerOne ? 'Kirby' : 'Meta-Knight'}}
          </div>
          <br>
          <button v-if="isPlayerNumberOk" @click="playerReady">Jouer</button>
          <div v-if="!isPlayerNumberOk">En attente d'un autre joueur ...</div>
          <br>
          <br>
          <div>
            Lorsque "!" apparait, clique sur n'importe quelle touche le plus vite possible.
          </div>
      </div>
      <div v-if="!isMenu && showExPoint" class="ExPoint">
        <img src="/images/ExPoint.png">
      </div>
      <div v-if="!isMenu && isPlaying" class="battlefield">
          <img v-if="isWaiting" src="/images/kirby-standing.png" class="kirby-standing">
        
          <img v-if="isWaiting" src="/images/mk-standing.png" class="reverse mk-standing"> 
        
          <img v-if="!isWaiting && ((isPlayerOne && youWin) || (!isPlayerOne && youLoose))" 
          src="/images/mk-loosing.png" class="reverse mk-loosing">

          <img v-if="!isWaiting && ((isPlayerOne && youWin) || (!isPlayerOne && youLoose))" 
          src="/images/kirby-winning.png" class="kirby-winning">

          <img v-if="!isWaiting && ((!isPlayerOne && youWin) || (isPlayerOne && youLoose))" 
          src="/images/mk-winning.png" class="reverse mk-loosing">
          
          <img v-if="!isWaiting && ((!isPlayerOne && youWin) || (isPlayerOne && youLoose))" 
          src="/images/kirby-loosing.png" class="kirby-loosing">
      </div>
      <div v-if="!isMenu && !isPlaying">
        En attente de l'autre Joueur ...
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import { ref } from 'vue';

export default {
  name: 'App',

  setup () {
    let isPlayerNumberOk = ref(false);
    let showExPoint = ref(false);
    let isWaiting = ref(true);
    let youWin = ref(false);
    let isPlayerOne = ref(null);
    let isMenu = ref(true);
    let isPlaying = ref(false);
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

    socket.on('p', (arg) => {isPlayerNumberOk.value = arg === 2});

    socket.on('!', () => showExPoint.value = true);

    socket.on('Win', () => {isWaiting.value = false, youWin.value = true});

    socket.on('Lose', () => {isWaiting.value = false, youWin.value = false});

    socket.on('ToSoonLose', () => console.log('Trop pressé'));

    socket.on('ToSoonWin', () => console.log('ToSoonWin'));

    socket.on('player 1', () => {isPlayerOne.value = true;});
    socket.on('player 2', () => {isPlayerOne.value = false;});
    socket.on('play', () => {isPlaying.value = true});

    const ping = () => socket.emit('ping');

    const playerReady = () => {isMenu.value = false; socket.emit('playerReady')};

    window.addEventListener('keypress', socket.emit('slash'));

    return {
      status,
      ping,
      playerReady,
      isMenu,
      isPlaying,
      isPlayerNumberOk,
      showExPoint,
      isWaiting,
      youWin,
      isPlayerOne
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

.battlefield{
  margin-top: 250px;
}

.kirby-standing, .mk-loosing, .mk-winning{
  margin-left: 80px
}

.mk-standing, .kirby-winning, .kirby-loosing {
  margin-left: 180px;
}

.mk-loosing {
  margin-left: 80px
}

.ExPoint {
  position: absolute;
  margin-left: 200px;
}

.reverse{
  -moz-transform: scale(-1, 1);
  -webkit-transform: scale(-1, 1);
  -o-transform: scale(-1, 1);
  -ms-transform: scale(-1, 1);
  transform: scale(-1, 1);
}

.player-name {
  margin-top: 100px;
}

</style>