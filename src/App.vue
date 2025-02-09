<script setup lang="ts">
import { computed, ref } from 'vue';
import { skyjoEndGameAnalysis } from '../ai/skyjo-game-analysis'
import { type SkyjoGameAnalysis } from '../interface/skyjo-game-analysis';
import CameraCapture from './components/CameraCapture.vue';


const skyjoBoardAnalysis = ref<SkyjoGameAnalysis | null>(null);
const displayCamera = ref(false);
const displayPreview = ref(false)
const cameraPreview = ref("")


function onCalculMySkyjoBoardClick() {
  displayCamera.value = true
}

async function snapshotTaken(data: string | null) {
  if (data) {
    displayCamera.value = false
    displayPreview.value = true
    cameraPreview.value = data
    skyjoBoardAnalysis.value = await skyjoEndGameAnalysis(cameraPreview.value);
  }
}


const calculateSkyjoSum = computed(() => {
  if (!skyjoBoardAnalysis.value) return ""
  const sumLine1 = skyjoBoardAnalysis.value.line1.reduce((sum: number, num: number) => sum + num, 0);
  const sumLine2 = skyjoBoardAnalysis.value.line2.reduce((sum: number, num: number) => sum + num, 0);
  const sumLine3 = skyjoBoardAnalysis.value.line3.reduce((sum: number, num: number) => sum + num, 0);

  return sumLine1 + sumLine2 + sumLine3;
})

const calculateLine1 = computed(() => {
  if (!skyjoBoardAnalysis.value) return ""

  return skyjoBoardAnalysis.value.line1.toString()
})

const calculateLine2 = computed(() => {
  if (!skyjoBoardAnalysis.value) return ""

  return skyjoBoardAnalysis.value.line2.toString()
})

const calculateLine3 = computed(() => {
  if (!skyjoBoardAnalysis.value) return ""

  return skyjoBoardAnalysis.value.line3.toString()
})

const previewAccordingPhotoTaken = computed(() => {
  if (!cameraPreview.value || cameraPreview.value === "") return "";
  return cameraPreview.value
})


</script>

<template>
  <div class="container">
    <div v-if="!displayCamera && !displayPreview">
      <h1>Welcome to Skyjo Mate!</h1>
      <h3>Make your games easier by letting the app calculate your points for you.</h3>

      <h3>How it works :</h3>

      <ul>
        <li>
          Take a photo of your Skyjo grid or analyze an existing photo.
        </li>
        <li>
          The app automatically calculates the points for each player at the end of the round.
        </li>
      </ul>

      Enjoy the game without worrying about the calculations!

      <h4>
        Ready? Click the button below to get started!
      </h4>

      <button @click="onCalculMySkyjoBoardClick()">
        Calcul my skyjo board
      </button>
    </div>

    <!-- Display the camera for capture a screenshot -->
    <CameraCapture @snapshotTaken="snapshotTaken" v-if="displayCamera && !displayPreview" />

    <!-- Preview and result of the calcul-->

    <div v-if="!displayCamera && displayPreview">
      <img class="image" :src="previewAccordingPhotoTaken" alt="user skyjo hand">

      <div>
        Here your result :
        {{ calculateSkyjoSum }}

        <div v-if="skyjoBoardAnalysis !== null">
          <h1>First line</h1>
          {{ calculateLine1 }}

          <h1>Second line</h1>
          {{ calculateLine2 }}

          <h1>Thrid line</h1>
          {{ calculateLine3 }}

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin: 8px 16px;
}

/* .image {
  height: 40vh;
  width: 40vh;
}

.fade-out {
  animation: fadeOut 1s forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    visibility: visible;
  }

  100% {
    opacity: 0;
    visibility: hidden;
  }
}
*/
</style>
