import { loaderMessage } from '../../constant/loader-message';
<template>
    <div class="loader-container">
        <div class="loader">
        </div>
        <span class="loader-text">
            {{ loaderMessage }}
        </span>
    </div>


</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { loaderMessages } from '../../constant/loader-message';

let intervalId: number | null = null;
const loaderMessage = ref(loaderMessages[0]);

onMounted(() => {
    intervalId = setInterval(() => {
        loaderMessage.value = loaderMessages[Math.floor(Math.random() * loaderMessages.length)];
    }, 2000);
});

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});

</script>

<style scoped>
.loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .loader {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3451d4;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    .loader-text {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
    }
}


@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
