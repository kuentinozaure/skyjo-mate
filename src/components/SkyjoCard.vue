<template>
    <div class="skyjo-card" :style="{ backgroundColor: preCalculateSkyjoCard(cardValue) }">
        <div class="indicator-container">
            <span class="number-indicator">
                {{ cardValue }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SKYJO_COLORS_CARD } from '../../constant/skyjo-rule.ts'
defineProps({
    cardValue: {
        type: Number,
        required: false,
    }
});

const preCalculateSkyjoCard = ((cardValue: number | undefined) => {
    // Iterate over the object keys 
    for (const key in SKYJO_COLORS_CARD) {
        const range = SKYJO_COLORS_CARD[key].condition;

        // If the number is included in the range, return the color
        if (range.includes(cardValue)) {
            return SKYJO_COLORS_CARD[key].color;
        }
    }
    return SKYJO_COLORS_CARD.default.color;
});
</script>

<style scoped>
.skyjo-card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 100px;
    border-radius: 8px;
    border: 2px solid white;


    .indicator-container {
        background-color: white;
        width: 50px;
        height: 50px;
        border-radius: 50px;
        transform: skewX(-20deg);
        display: flex;
        justify-content: center;
        align-items: center;

        .number-indicator {
            font-size: 22px;
            font-weight: bold;
            color: #1a1a1a;
        }
    }
}
</style>