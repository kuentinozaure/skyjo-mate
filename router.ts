import { createMemoryHistory, createRouter } from "vue-router";

import HomePage from "./src/pages/HomePage.vue";
import SkyjoResultPage from "./src/pages/SkyjoResultPage.vue";

const routes = [
  { path: "", component: HomePage },
  { path: "/result", component: SkyjoResultPage },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
