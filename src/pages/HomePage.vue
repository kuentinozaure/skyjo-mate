<template>
    <div>
        <h1>Welcome to Skyjo Mate!</h1>
        <h3>Make your games easier by letting the app calculate your points for you.</h3>

        <h3>How it works :</h3>

        <ul>
            <li>
                Analyze your skyjo grid from an existing photo.
            </li>
            <li>
                The app automatically calculates the points for each player at the end of the round.
            </li>
        </ul>

        Enjoy the game without worrying about the calculations!

        <h4>
            Ready? Click the button below to get started!
        </h4>


        <button @click="openMySkyjoGrid()">
            Import my skyjo grid
        </button>

        <input type="file" @change="handleFileUpload" accept="image/*" style="display: none;" ref="fileInput" />

    </div>
</template>

<script setup lang="ts">
// imports section
import { ref } from 'vue';
import type { SkyjoGameAnalysis } from '../interface/skyjo-game-analysis';
import { skyjoEndGameAnalysis } from '../ai/skyjo-game-analysis';
import { router } from '../../router';
import { useSkyjoStore } from '../store/skyjoStore';

// variables section
const fileInput = ref<HTMLInputElement | null>(null);
const skyjoBoardAnalysis = ref<SkyjoGameAnalysis | null>(null);


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
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target?.result as string;
            // Process the image (send it to skyjoEndGameAnalysis)
            store.setImage(dataUrl);
            const boardAnalysisFromLLM = await skyjoEndGameAnalysis(dataUrl);
            store.setBoardAnalysis(boardAnalysisFromLLM);
            router.push('/result')
        };
        reader.readAsDataURL(file);
    }
}
</script>

<style scoped></style>