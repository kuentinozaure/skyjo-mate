<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineEmits } from 'vue';

const videoElement = ref<HTMLVideoElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const imageData = ref<string | null>(null);
const emit = defineEmits();

async function startCamera() {
    if (videoElement.value) {
        try {
            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: 'environment', // Force back camera (environment-facing)
                },
            };
            // Ask for camera permission
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            videoElement.value.srcObject = stream;
        } catch (err) {
            console.error("Error accessing camera: ", err);
        }
    }
}

function takeSnapshot() {
    if (canvasElement.value && videoElement.value) {
        const context = canvasElement.value.getContext('2d');
        if (context) {
            context.drawImage(videoElement.value, 0, 0, canvasElement.value.width, canvasElement.value.height);
            imageData.value = canvasElement.value.toDataURL('image/png');
            emit('snapshotTaken', imageData.value);
        }
    }
}

onMounted(() => {
    startCamera();
});


</script>

<template>
    <video ref="videoElement" autoplay></video>
    <!-- width="320" height="240" -->
    <canvas ref="canvasElement" style="display: none;  height: 100dvh;width: 100dvw;"></canvas>

    <div class="camera-container" @click="takeSnapshot">
        <!-- Camera svg -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"
            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    </div>
</template>

<style scoped>
.camera-container {
    position: absolute;
    bottom: 0;
    left: 50%;
    background-color: #646cff;
    padding: 1rem;
    border-radius: 50%;
    transform: translate(-50%, -50%);
}

video {
    height: 100dvh;
    width: 100dvw;
    object-fit: cover;
    position: absolute;
}

/* button {
    margin-top: 10px;
} */
</style>
