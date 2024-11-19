import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";

// Font imports
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// View components imports
import App from "./App.vue";
import Start from "./views/TheStart.vue";
import Sessions from "./views/TheSessions.vue";
import Participants from "./views/TheParticipants.vue";
import Settings from "./views/TheSettings.vue";
import NewSession from "./views/TheNewSession.vue";
import NewConfiguration from "./views/TheNewConfiguration.vue";
import Feedback from "./views/TheFeedback.vue";
import FeedbackList from "./views/TheFeedbackList.vue";
import Session from "./views/TheSession.vue";
import Profile from "./views/TheProfile.vue";
import Courses from "./views/TheCourses.vue";
import Login from "./views/TheLogin.vue";

// Other imports
import { Calendar, DatePicker } from "v-calendar";
import "v-calendar/style.css";
import VueWordCloud from "vuewordcloud";

import { store, key } from "./store";

// Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Start", component: Start },
    { path: "/new-session", name: "Neue Sitzung", component: NewSession },
    { path: "/sessions", name: "Vergangene Sitzungen", component: Sessions },
    { path: "/participants", name: "Teilnehmer", component: Participants },
    { path: "/settings", name: "Einstellungen", component: Settings },
    { path: "/feedbacklist", name: "Analyseliste", component: FeedbackList },
    { path: "/feedback/:id", name: "Analyse", component: Feedback },
    { path: "/login", name: "Einloggen", component: Login },

    {
      path: "/session/:id",
      name: "Modul",
      component: Session,
    },
    { path: "/teacher-profile", name: "Profile", component: Profile },
    { path: "/courses", name: "Module", component: Courses },
    {
      path: "/new-configuration",
      name: "Neue Konfiguration",
      component: NewConfiguration,
    },
  ],
});

// Vue app
const app = createApp(App);

app.use(store, key);
app.use(router);

// reroute to Login page if no token is found
if (!localStorage.getItem("token")) router.replace("/login");

// Vue components
app.component("VCalendar", Calendar);
app.component("VDatePicker", DatePicker);
app.component(VueWordCloud.name, VueWordCloud);

//Mounting app
router.isReady().then(() => {
  app.mount("#app");
});
// });
