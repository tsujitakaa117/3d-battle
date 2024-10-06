import { createRouter } from "vue-router";
import HomePage from "../views/HomePage.vue";
import BattleScene from "./../views/BattleScene.vue";
import { createWebHashHistory } from "vue-router";





const routes = [
    {
        "path": "/",
        "name": "Home",
        "component": HomePage
    },
    {
        "path": "/battle",
        "name": "Battle",
        "component": BattleScene
    }
]


const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });
  
  export default router;