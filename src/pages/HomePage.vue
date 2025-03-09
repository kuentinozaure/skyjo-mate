<template>
    <div v-if="!loadingImage">
        <h1>Welcome to Skyjo Mate! 🎉</h1>

        <div>
            <h3>Simplify your game—let the app handle the scoring for you!</h3>

            <h3>How it works :</h3>

            <ul>
                <li>Snap a photo of your Skyjo grid, and let the app analyze it.</li>
                <li>Get instant, automatic score calculations for every player.</li>
            </ul>

            <p>Focus on the fun, and leave the math to us! 🚀</p>

            <h4>Ready to play? Import your Skyjo grid and start scoring!</h4>


            <button @click="openMySkyjoGrid()">
                Get My Skyjo Score! 📊
            </button>

            <input type="file" @change="handleFileUpload" accept="image/*" style="display: none;" ref="fileInput" />
        </div>
    </div>
    <di class="loader-container" v-else>
        <Loader />
    </di>

</template>

<script setup lang="ts">
// imports section
import { ref } from 'vue';
import { skyjoEndGameAnalysis } from '../ai/skyjo-game-analysis';
import { router } from '../../router';
import { useSkyjoStore } from '../store/skyjoStore';
import Loader from '../components/Loader.vue';

// variables section
const fileInput = ref<HTMLInputElement | null>(null);
const loadingImage = ref<boolean>(false);

const store = useSkyjoStore();

/**
 * This method mock the click on the file input to open the file picker, 
 * to open the selection menu for the user to select a file.
 */
function openMySkyjoGrid() {
    // Trigger file input click event
    fileInput.value?.click();
}

/**
 * This method is called when the user selects a file from the file picker.
 * It reads the file and processes it.
 * @param event The event that triggered the method.
 */
async function handleFileUpload(event: Event) {
    loadingImage.value = true;
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target?.result as string;
            // Process the image (send it to skyjoEndGameAnalysis)
            store.setImage(dataUrl);
            const boardAnalysisFromLLM = await skyjoEndGameAnalysis(dataUrl);
            store.setBoardAnalysis(boardAnalysisFromLLM);
            loadingImage.value = false;
            router.push('/result')
        };
        reader.readAsDataURL(file);
    }
}
</script>

<style scoped>
.loader-container {
    display: flex;
    height: 100vh;
    width: 100%;
}
</style>