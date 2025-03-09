<template>
    <div class="skyjo-result-container">
        <h3 class="score-info" v-bind:class="{ 'active': !elementToShow.includes('score') }">
            You scored {{ store.totalRoundPoint }} point(s)! 🥳
        </h3>

        <div class="breakdown-container" v-bind:class="{ 'active': !elementToShow.includes('breakdown') }">
            <span>Here the breakdown of your board:</span>
            <div class="skyjo-board">
                <SkyjoCard :cardValue="item" v-for="(item, index) in store.boardAnalysis?.numbers" :key="index" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SkyjoCard from '../components/SkyjoCard.vue'
import { useSkyjoStore } from '../store/skyjoStore';

const store = useSkyjoStore();
const elementToShow = ref(['score', 'breakdown']);


onMounted(async () => {
    setTimeout(() => {
        elementToShow.value.shift();
    }, 500)

    setTimeout(() => {
        elementToShow.value.shift();
    }, 1000)
})


</script>

<style scoped>
.skyjo-result-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;

    .score-info {
        display: flex;
        justify-content: center;
        font-size: 24px;
        width: 100%;
        opacity: 0;
        transition: opacity 1s ease;
    }

    .breakdown-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        opacity: 0;
        transition: opacity 1s ease;

        .skyjo-board {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
            max-width: 800px;
            margin: auto;
            transition: opacity 1s ease;
        }
    }

    .active {
        opacity: 1;
    }
}
</style>