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
        try {
            const resizedDataUrl = await resizeImage(file, 1024, 1024);

            store.setImage(resizedDataUrl);

            // Send the resized image to the analysis image tool
            const boardAnalysisFromLLM = await skyjoEndGameAnalysis(resizedDataUrl);
            store.setBoardAnalysis(boardAnalysisFromLLM);

            router.replace('/result');
        } catch (error) {
            console.error('Error handling image upload:', error);
        } finally {
            loadingImage.value = false;
        }
    }
}

function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = () => {
            img.src = reader.result as string;
        };

        reader.readAsDataURL(file);

        img.onload = () => {
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            // Resize using canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Convert back to dataURL
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataUrl);
        };

        img.onerror = reject;
    });
}


</script>

<style scoped>
.loader-container {
    display: flex;
    height: 100vh;
    width: 100%;
}
</style>