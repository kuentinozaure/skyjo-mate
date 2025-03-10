import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { SkyjoGameAnalysis } from "../interface/skyjo-game-analysis";

export const useSkyjoStore = defineStore("skyjo", () => {
  const skyjoImageBase64 = ref("");
  const boardAnalysis = ref<SkyjoGameAnalysis | null>(null);

  function setImage(imageBase64: string) {
    skyjoImageBase64.value = imageBase64;
  }

  function setBoardAnalysis(analysis: SkyjoGameAnalysis | null) {
    boardAnalysis.value = analysis;
  }

  const totalRoundPoint = computed(
    () =>
      boardAnalysis.value?.numbers.reduce(
        (acc, num) => (acc || 0) + (num || 0),
        0
      ) ?? 0
  );

  return {
    skyjoImageBase64,
    boardAnalysis,
    setImage,
    setBoardAnalysis,
    totalRoundPoint,
  };
});
