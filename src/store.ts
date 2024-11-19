import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import { uuid } from "vue-uuid";
import axios from "axios";
import { API_URL } from "./config";

export interface State {
  user_ids: string[];
  userData: {
    name: string;
    token: string;
  };
  loginState: "authenticated" | "unauthorized";
  teacher_rights: "public" | "private";
  // courses: Array<Object>;
  // actors: Array<Object>;
  // participants: { name: string; id: string }[];
  tabState: { tab: number; important: boolean };
  prevSession: string;
  currentDataPoint: string | null;
  currentTime: string | null;
  currentAudioTime: string | null;
  timeSamples: Array<string>;
  // currentFeedback saves the current observed feedback element
  currentFeedback: {
    id: string;
    user_ids: [string];
    meta: {
      session_id: string;
      edit_date: string;
      case_id: string;
      speakers: Array<object>;
    };
    transcript: {
      length_time: string;
      length_sec: string;
      transcriptId: string;
    };
    measuresId: string;
  } | null;
  // currentData saves the current feedback element's measurement data
  currentData: {
    measureId: string;
    type: string;
    timestamps: Array<string>;
    conversationPauses: {
      stats: Array<object>;
      speakers: [
        {
          speakerId: string;
          //  totalLength: number, totalCount: number,
          data: Array<object>;
        }
      ];
    };
    conversationShares: {
      speakers: [
        {
          speakerId: string;
          dataContinous: Array<string>;
          statisticValues: [];
        }
      ];
    };
    pitch: {
      speakers: [
        {
          speakerId: string;
          dataContinous: Array<string>;
          stats: {
            globalValues: [{ min: string; max: string; mean: string }];
            statisticalValues: [];
          };
        }
      ];
      // dataGlobal: Array,
      // stats: [],
    };
    tempo: {
      speakers: [
        {
          speakerId: string;
          dataContinous: Array<string>;
          statisticValues: [];
        }
      ];
    };
    loudness: {
      speakers: [
        {
          speakerId: string;
          dataContinous: Array<string>;
          stats: {
            globalValues: [{ min: string; max: string; mean: string }];
            stats: {
              globalValues: [{ min: string; max: string; mean: string }];
              statisticalValues: [];
            };
          };
        }
      ];
      // dataGlobal: Array,
    };

    words: {
      speakers: {
        speakerId: string;
        words: { value: string; count: string }[];
      }[];
    };

    keywordFrequencies:
      | {
          speaker: number;
          word: string;
          wordGroup: string;
          frequency: number;
          count: number;
        }[]
      | null;
  } | null;

  currentTranscript: {
    speakers: Array<object>;
    feedbackId: string;
    transcripts: [
      {
        speakerId: string;
        content: [
          {
            timeStart: number;
            timeEnd: number;
            value: string;
            confidences: [number];
          }
        ];
      }
    ];
  } | null;

  // currentRecord contains the infos about the recording including case, speakers, roles and parameters
  currentRecord: {
    words: {
      wordsToSay: string[] | null;
      wordsNotToSay: string[] | null;
    };
    speaker1: {
      id: string;
      color: string;
      name: string;
      role: string;
      student: boolean;
      dataUsage: [
        { name: "saveTranscript"; checked: true },
        { name: "saveRecord"; checked: true },
        { name: "saveAnalysis"; checked: true }
      ];
      parameters: [
        { name: "tempo"; checked: true },
        { name: "pitch"; checked: true },
        { name: "loudness"; checked: true },
        { name: "shares"; checked: true },
        { name: "pauses"; checked: true },
        { name: "words"; checked: true }
      ];
      verified: boolean;
    };
    speaker2: {
      id: string;
      color: string;
      name: string;
      role: string;
      student: boolean;
      dataUsage: [
        { name: "saveTranscript"; checked: true },
        { name: "saveRecord"; checked: true },
        { name: "saveAnalysis"; checked: true }
      ];
      parameters: [
        { name: "tempo"; checked: true },
        { name: "pitch"; checked: true },
        { name: "loudness"; checked: true },
        { name: "shares"; checked: true },
        { name: "pauses"; checked: true },
        { name: "words"; checked: true }
      ];
      verified: boolean;
    };
    case: { id: string; name: string };
    calibrated: boolean;
    recordStatus: string;
    feedbackId: string | null;
  };
  settings: {
    filteringFeedack: boolean;
    hidingFeedback: boolean;
    colors: [];
  };
  new_session: {
    name: string;
    id: string;
    configStep: number;
    status: "new" | "existing" | "forDelete";
    date: Date;
    meta: {
      recorded_cases: {
        case_id: string;
        feedback_id: string;
      }[];
    };
    // configStep: "0",
    baseConfig: {
      application_domain: string;
      subject_name: string;
      subject_topic: string;
      event_topic: string;
    };
    roomConfig: {
      room_size: string;
      room_echo: string;
      room_selected: string;
      rooms: { name: string; color: string }[];
    };
    caseConfig: {
      cases: {
        case_id: string;
        case_name: string;
        case_description: string;
        case_requisites: string;
        case_notes: string;
        case_role1: string;
        case_role2: string;
        case_wordsToSay: string[] | null;
        case_wordsNotToSay: string[] | null;
      }[];
      case_selected: {
        case_id: string;
        case_name: string;
        case_description: string;
        case_notes: string;
        case_requisites: string;
        case_role1: string;
        case_role2: string;
        case_wordsToSay: string[] | null;
        case_wordsNotToSay: string[] | null;
      } | null;
    };

    speakerConfig: {
      speaker1_name: string;
      speaker1_role: string;
      speaker1_color: string;
      speaker2_name: string;
      speaker2_role: string;
      speaker2_color: string;
      roles: { name: string }[];
    };
    audioConfig: {
      micro1_id: string;
      micro1_name: string;
      micro1_brand: string;
      micro1_color: string;
      micro2_id: string;
      micro2_name: string;
      micro2_brand: string;
      micro2_color: string;
      microphones: { name: string; color: string }[];
    };
  } | null;
  // sessions saves all fetched sessions
  sessions: {
    name: string;
    id: string;
    configStep: number;
    status: "new" | "existing" | "forDelete";
    date: Date;
    meta: {
      recorded_cases: {
        case_id: string;
        feedback_id: string;
      }[];
    };
    // configStep: "0",
    baseConfig: {
      application_domain: string;
      subject_name: string;
      subject_topic: string;
      event_topic: string;
    };
    roomConfig: {
      room_size: string;
      room_echo: string;
      room_selected: string;
      rooms: { name: string; color: string }[];
    };
    caseConfig: {
      cases: {
        case_id: string;
        case_name: string;
        case_description: string;
        case_requisites: string;
        case_notes: string;
        case_role1: string;
        case_role2: string;
        case_wordsToSay: string[] | null;
        case_wordsNotToSay: string[] | null;
      }[];
      case_selected: {
        case_id: string;
        case_name: string;
        case_description: string;
        case_notes: string;
        case_requisites: string;
        case_role1: string;
        case_role2: string;
        case_wordsToSay: string[] | null;
        case_wordsNotToSay: string[] | null;
      } | null;
    };

    speakerConfig: {
      speaker1_name: string;
      speaker1_role: string;
      speaker1_color: string;
      speaker2_name: string;
      speaker2_role: string;
      speaker2_color: string;
      roles: { name: string }[];
    };
    audioConfig: {
      micro1_id: string;
      micro1_name: string;
      micro1_brand: string;
      micro1_color: string;
      micro2_id: string;
      micro2_name: string;
      micro2_brand: string;
      micro2_color: string;
      microphones: { name: string; color: string }[];
    };
  }[];

  // newCase saves the temporal case data
  new_case: {
    case_id: string;
    case_name: string;
    case_description: string;
    case_requisites: string;
    case_notes: string;
    case_role1: string;
    case_role2: string;
    case_wordsToSay: string[] | null;
    case_wordsNotToSay: string[] | null;
  };
  // feedbacks saves all fetched feedbacks

  feedbacks: {
    id: string;
    user_ids: [string];
    meta: {
      session_id: string;
      edit_date: string;
      case_id: string;
      speakers: Array<object>;
    };
    transcript: {
      length_time: string;
      length_sec: string;
      transcriptId: string;
    };
    minTimestamp: number;
    measuresId: string;
    wordsToSay: Array<string>;
    wordsNotToSay: Array<string>;
    dataCheck: boolean;
  }[];
  currentSessionId: string | null;
  currentSession: {
    name: string;
    id: string;
    configStep: number;
    status: "new" | "existing" | "forDelete";
    date: Date;
    meta: {
      recorded_cases: {
        case_id: string;
        feedback_id: string;
      };
    };
  } | null;
  sessionSelected: boolean;
  currentFeedbackId: string | null;
  instances: {
    name: string;
    url: string;
  }[];
  currentInstance: {
    name: string | null;
    url: string | null;
  };
}

export const key: InjectionKey<Store<State>> = Symbol();

// store instance.
export const store = createStore<State>({
  state: {
    user_ids: [],
    userData: {
      name: "",
      token: "",
    },
    loginState: "unauthorized",
    settings: {
      filteringFeedack: true,
      hidingFeedback: true,
      colors: [],
    },
    timeSamples: [],
    currentData: null,
    currentFeedback: null,
    currentTranscript: null,
    currentRecord: {
      words: {
        wordsToSay: [],
        wordsNotToSay: [],
      },
      speaker1: {
        id: "1",
        color: "#3BA8D4",
        name: "",
        role: "Rolle 1",
        student: true,
        dataUsage: [
          { name: "saveTranscript", checked: true },
          { name: "saveRecord", checked: true },
          { name: "saveAnalysis", checked: true },
        ],
        parameters: [
          { name: "tempo", checked: true },
          { name: "pitch", checked: true },
          { name: "loudness", checked: true },
          { name: "shares", checked: true },
          { name: "pauses", checked: true },
          { name: "words", checked: true },
        ],
        verified: false,
      },
      speaker2: {
        id: "2",
        color: "#A71F60",
        name: "",
        role: "Rolle 2",
        student: false,
        dataUsage: [
          { name: "saveTranscript", checked: true },
          { name: "saveRecord", checked: true },
          { name: "saveAnalysis", checked: true },
        ],
        parameters: [
          { name: "tempo", checked: true },
          { name: "pitch", checked: true },
          { name: "loudness", checked: true },
          { name: "shares", checked: true },
          { name: "pauses", checked: true },
          { name: "words", checked: true },
        ],
        verified: false,
      },
      case: { id: "", name: "" },
      calibrated: false,
      recordStatus: "not recorded",
      feedbackId: null,
    },
    tabState: { tab: 0, important: false },
    prevSession: "",
    currentDataPoint: null,
    currentTime: null,
    currentAudioTime: null,

    teacher_rights: "private",
    sessions: [],
    feedbacks: [],
    sessionSelected: false,
    currentSessionId: null,
    currentSession: null,
    currentFeedbackId: "xy1",
    new_case: {
      case_id: "",
      case_name: "",
      case_description: "",
      case_requisites: "",
      case_notes: "",
      case_role1: "",
      case_role2: "",
      case_wordsToSay: [],
      case_wordsNotToSay: [],
    },
    new_session: null,
    instances: [],
    currentInstance: {
      name: "",
      url: "",
    },
  },

  mutations: {
    setUser(state, payload) {
      if (payload == "clear") {
        state.user_ids = [];
      } else {
        if (payload.id) {
          const user_id = state.user_ids.find((user) => {
            user === payload.id;
          });
          if (!user_id) state.user_ids.push(payload.id);
        }
        if (payload.username) state.userData.name = payload.username;
      }
    },
    setCurrentData(state, payload) {
      state.currentData = payload;
    },
    setCurrentSession(state, payload) {
      if (payload == "new") {
        const newId = uuid.v1();
        state.new_session = {
          id: newId,
          name: "new Session!",
          configStep: 0,
          status: "new",
          date: new Date(),
          meta: {
            recorded_cases: [],
          },
          baseConfig: {
            application_domain: "",
            subject_name: "",
            subject_topic: "",
            event_topic: "",
          },
          roomConfig: {
            room_size: "roomsize1",
            room_echo: "echo1",
            room_selected: "",
            rooms: [
              { name: "Seminarraum 23", color: "" },
              { name: "Banach", color: "" },
              { name: "Raum X1", color: "" },
              { name: "Container C2", color: "" },
              { name: "Tüftl", color: "" },
            ],
          },
          caseConfig: {
            cases: [],
            case_selected: {
              case_id: "",
              case_name: "",
              case_description: "",
              case_notes: "",
              case_requisites: "",
              case_role1: "",
              case_role2: "",
              case_wordsToSay: [],
              case_wordsNotToSay: [],
            },
          },
          speakerConfig: {
            speaker1_name: "",
            speaker1_role: "",
            speaker1_color: "#3BA8D4",
            speaker2_name: "",
            speaker2_role: "",
            speaker2_color: "#A71F60",

            roles: [
              { name: "Angehörige*r" },
              { name: "Arzt / Ärztin" },
              { name: "Frau" },
              { name: "Hebamme" },
              { name: "Patient*in" },
              { name: "Pfleger*in" },
              { name: "Physiotherapeut*in" },
              { name: "Mann" },
              { name: "Rolle 1" },
              { name: "Rolle 2" },
            ],
          },
          audioConfig: {
            micro1_id: "1",
            micro1_name: "Nr.1",
            micro1_color: "red",
            micro1_brand: "kp",
            micro2_id: "2",
            micro2_name: "Nr.2",
            micro2_brand: "string",
            micro2_color: "green",
            microphones: [
              { name: "Nr.1", color: "red" },
              { name: "Nr.2", color: "green" },
              { name: "Nr.3", color: "blue" },
            ],
          },
        };
        // state.sessions.push(
        state.currentSessionId = newId;
      } else {
        state.currentSession = payload;
        // state.sessions.find(
        //   (session) => session && session.id && session.id === payload
        // );
        // state.sessions[state.currentSession].status = "existing";
      }
    },
    setCurrentSessionId(state, payload) {
      state.currentSessionId = payload;
    },
    setRecordedCase(state, payload) {
      const session = state.sessions.find(
        (session) =>
          session && session.id && session.id === state.currentSessionId
      );
      if (session && session.meta) session.meta.recorded_cases.push(payload);

      let token = "";
      if (localStorage && localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        if (storedToken !== null) {
          token = storedToken;
        }
      }
      axios
        .put(API_URL + "/sessions/" + state.currentSessionId, session, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    setCurrentFeedback(state, payload) {
      if (payload == "last") {
        state.currentFeedbackId =
          state.feedbacks[state.feedbacks.length - 1].id;
        const feedback = state.feedbacks.find((item) => {
          return item && item.id === state.currentFeedbackId;
        });
        if (feedback) state.currentFeedback = feedback;
      } else if (typeof payload === "string") {
        state.currentFeedbackId = payload;

        const feedback = state.feedbacks.find((item) => {
          return item && item.id === state.currentFeedbackId;
        });
        if (feedback) state.currentFeedback = feedback;
      }

      state.currentFeedback = payload;
    },
    setCurrentFeedbackId(state, payload) {
      if (payload == "last") {
        state.currentFeedbackId =
          state.feedbacks[state.feedbacks.length - 1].id;
      } else {
        state.currentFeedbackId = payload;
      }
      const feedback = state.feedbacks.find((item) => {
        return item && item.id === state.currentFeedbackId;
      });
      if (feedback) state.currentFeedback = feedback;
    },
    setTranscript(state, payload) {
      state.currentTranscript = payload;
    },

    setKeywords(state, payload) {
      if (state.currentData) {
        state.currentData.words.speakers[0].words = payload.speakers[0];
        state.currentData.words.speakers[1].words = payload.speakers[1];
      }
    },
    setKeywordFrequencies(state, payload) {
      if (state.currentData) {
        state.currentData.keywordFrequencies = payload;
      }
    },

    setSubstantives(state, payload) {
      if (payload.wordsToSay) {
        console.log("jetzt wurde setSubstantives ausgeführt");
        state.currentRecord.words.wordsToSay = payload.wordsToSay;
      }
      if (payload.wordsNotToSay) {
        console.log("jetzt wurde setSubstantives ausgeführt");
        state.currentRecord.words.wordsNotToSay = payload.wordsNotToSay;
      }
    },

    setCaseWords(state, payload) {
      if (payload.wordsToSay) {
        console.log("jetzt wurde setSubstantives ausgeführt");
        state.new_case.case_wordsToSay = payload.wordsToSay;
      }
      if (payload.wordsNotToSay) {
        console.log("jetzt wurde setSubstantives ausgeführt");
        state.new_case.case_wordsNotToSay = payload.wordsNotToSay;
      }
    },

    setTimestamps(state, payload) {
      state.timeSamples = payload;
    },
    setSessionStatus(state, payload) {
      const session = state.sessions.find((session) => {
        return session && session.id && session.id === state.currentSessionId;
      });
      if (session) session.status = payload;

      if (session) {
        let token = "";
        if (localStorage && localStorage.getItem("token")) {
          const storedToken = localStorage.getItem("token");
          if (storedToken !== null) {
            token = storedToken;
          }
        }
        axios
          .put(API_URL + "/sessions/" + state.currentSessionId, session, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    setStudent(state, payload) {
      if (payload.id == state.currentRecord.speaker1.id) {
        state.currentRecord.speaker1.student = payload.value;
      } else state.currentRecord.speaker2.student = payload.value;
    },
    setSessions(state, payload) {
      state.sessions = payload;
    },
    setNewSession(state, payload) {
      // if (state.new_session) {
      //   state.new_session.baseConfig = payload.baseConfig;
      //   state.new_session.caseConfig = payload.caseConfig;
      // }
      state.new_session = payload;
    },
    setTabState(state, payload) {
      console.log("tab", payload);
      state.tabState = payload;
    },
    setPrevSession(state, payload) {
      state.prevSession = payload;
    },
    setLoginState(state, payload) {
      state.loginState = payload;
    },
    setToken(state, payload) {
      state.userData.token = payload;
    },
    setFeedbackSpeakers(state, payload) {
      const feedback = state.feedbacks.find(
        (feedback) =>
          feedback && feedback.meta.session_id === state.currentFeedbackId
      );
      if (feedback && feedback.meta && feedback.meta.speakers) {
        feedback.meta.speakers = payload;
      }
    },
    setFeedbacks(state, payload) {
      state.feedbacks = payload;
      // for (const i = 0; i < state.feedbacks.length; i++) {
      //   const participant1 = state.participants.find(
      //     (participant1) =>
      //       participant1 &&
      //       participant1.id === state.feedbacks[i].meta.speakers[0].id
      //   );
      //   if (participant1)
      //     state.feedbacks[i].meta.speakers[0].name = participant1.name;
      //   state.feedbacks[i].meta.speakers[0].color = "#3BA8D4";

      //   const participant2 = state.participants.find(
      //     (participant2) =>
      //       participant2 &&
      //       participant2.id === state.feedbacks[i].meta.speakers[1].id
      //   );
      //   if (participant2)
      //     state.feedbacks[i].meta.speakers[1].name = participant2.name;
      //   state.feedbacks[i].meta.speakers[1].color = "#A71F60";
      // }
    },
    setAnalysisObjects(state, payload) {
      state.feedbacks = payload;
    },

    setRoom(state, payload) {
      if (state.new_session && state.new_session.roomConfig) {
        state.new_session.roomConfig.room_selected = payload;
        console.log("roomNew", payload);
      } else {
        const session = state.sessions.find(
          (session) =>
            session && session.id && session.id === state.currentSessionId
        );
        if (session && session.roomConfig) {
          session.roomConfig.room_selected = payload;
          let token = "";
          if (localStorage && localStorage.getItem("token")) {
            const storedToken = localStorage.getItem("token");
            if (storedToken !== null) {
              token = storedToken;
            }
          }
          axios
            .put(API_URL + "/sessions/" + state.currentSessionId, session, {
              headers: {
                Authorization: "Bearer " + token,
              },
            })
            .then((response) => {
              console.log(response);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    },
    setCurrentDataPoint(state, payload) {
      state.currentDataPoint = payload;
    },
    setCurrentTime(state, payload) {
      state.currentTime = payload;
    },
    setCurrentAudioTime(state, payload) {
      state.currentAudioTime = payload;
    },

    setBaseConfig(state, payload) {
      if (state.new_session && state.currentSessionId == state.new_session.id) {
        if (payload[0] == "0") {
          state.new_session.baseConfig.application_domain = payload[1];
        } else if (payload[0] == "1") {
          state.new_session.baseConfig.subject_name = payload[1];
        } else if (payload[0] == "2") {
          state.new_session.baseConfig.subject_topic = payload[1];
        } else if (payload[0] == "3") {
          state.new_session.baseConfig.event_topic = payload[1];
        }
      } else {
        const session = state.sessions.find(
          (session) =>
            session && session.id && session.id === state.currentSessionId
        );
        if (session && session.baseConfig) {
          if (payload[0] == "0") {
            session.baseConfig.application_domain = payload[1];
          } else if (payload[0] == "1") {
            session.baseConfig.subject_name = payload[1];
          } else if (payload[0] == "2") {
            session.baseConfig.subject_topic = payload[1];
          } else if (payload[0] == "3") {
            session.baseConfig.event_topic = payload[1];
          }
          let token = "";
          if (localStorage && localStorage.getItem("token")) {
            const storedToken = localStorage.getItem("token");
            if (storedToken !== null) {
              token = storedToken;
            }
          }
          axios
            .post(API_URL + "/sessions/" + state.currentSessionId, session, {
              headers: {
                Authorization: "Bearer " + token,
              },
            })
            .then((response) => {
              console.log(response);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    },
    setCaseConfig(state, payload) {
      if (payload == "") {
        state.new_case = {
          case_id: "",
          case_name: "",
          case_description: "",
          case_requisites: "",
          case_notes: "",
          case_role1: "",
          case_role2: "",
          case_wordsToSay: [],
          case_wordsNotToSay: [],
        };
      } else if (state.new_case) {
        if (payload[0] == "0") {
          state.new_case.case_name = payload[1];
        } else if (payload[0] == "1") {
          state.new_case.case_description = payload[1];
        } else if (payload[0] == "2") {
          state.new_case.case_requisites = payload[1];
        } else if (payload[0] == "3") {
          state.new_case.case_notes = payload[1];
        } else if (payload[0] == "4") {
          state.new_case.case_role1 = payload[1];
        } else if (payload[0] == "5") {
          state.new_case.case_role2 = payload[1];
        } else if (payload[0] == "6") {
          state.new_case.case_wordsToSay = payload[1];
        } else if (payload[0] == "7") {
          state.new_case.case_wordsNotToSay = payload[1];
        }
      }
    },

    selectCase(state, payload) {
      if (state.new_session && state.currentSessionId == state.new_session.id) {
        if (
          state.new_session &&
          state.new_session.caseConfig &&
          state.new_session.caseConfig.case_selected &&
          payload == ""
        ) {
          state.new_session.caseConfig.case_selected = null;
        } else if (
          state.new_session &&
          state.new_session.caseConfig &&
          state.new_session.caseConfig.cases
        ) {
          const case_elem = state.new_session.caseConfig.cases.find(
            (case_elem) =>
              case_elem && case_elem.case_id && case_elem.case_id === payload
          );
          console.log("myWords", case_elem);

          if (case_elem) {
            state.new_session.caseConfig.case_selected = case_elem;
            if (state.currentRecord && state.currentRecord.words) {
              state.currentRecord.words.wordsToSay = case_elem.case_wordsToSay;
              state.currentRecord.words.wordsNotToSay =
                case_elem.case_wordsToSay;
            }
          }
        }
      }
      const session = state.sessions.find(
        (session) =>
          session && session.id && session.id === state.currentSessionId
      );
      if (
        session &&
        session.caseConfig &&
        session.caseConfig.case_selected &&
        payload == ""
      ) {
        session.caseConfig.case_selected = null;
      } else if (session && session.caseConfig && session.caseConfig.cases) {
        console.log("setCase", payload);
        const case_elem = session.caseConfig.cases.find(
          (case_elem) =>
            case_elem && case_elem.case_id && case_elem.case_id === payload
        );
        console.log("myWords", case_elem);
        if (case_elem) {
          session.caseConfig.case_selected = case_elem;
          if (state.currentRecord && state.currentRecord.case) {
            state.currentRecord.speaker1.role = case_elem.case_role1;
            state.currentRecord.speaker2.role = case_elem.case_role2;
          }
        }
      }
    },
    saveCase(state, payload) {
      if (state.new_session && state.currentSessionId == state.new_session.id) {
        if (
          state.new_session &&
          state.new_session.caseConfig &&
          state.new_session.caseConfig.cases
        ) {
          const case_elem = state.new_session.caseConfig.cases.find(
            (case_elem) =>
              case_elem && case_elem.case_id && case_elem.case_id === payload
          );
          if (case_elem) {
            case_elem.case_notes = state.new_case.case_notes;
          }
          if (case_elem && case_elem.case_id)
            case_elem.case_id = state.new_case.case_id;
          if (case_elem && case_elem.case_name)
            case_elem.case_name = state.new_case.case_name;
          if (case_elem && case_elem.case_description)
            case_elem.case_description = state.new_case.case_description;
          if (case_elem && case_elem.case_requisites)
            case_elem.case_requisites = state.new_case.case_requisites;

          if (case_elem && case_elem.case_role1)
            case_elem.case_role1 = state.new_case.case_role1;
          if (case_elem && case_elem.case_role2)
            case_elem.case_role2 = state.new_case.case_role2;
          if (case_elem && case_elem.case_wordsToSay)
            case_elem.case_wordsToSay = state.new_case.case_wordsToSay;
          if (case_elem && case_elem.case_wordsNotToSay)
            case_elem.case_wordsNotToSay = state.new_case.case_wordsNotToSay;
        }
        state.new_case = {
          case_id: "",
          case_name: "",
          case_description: "",
          case_requisites: "",
          case_notes: "",
          case_role1: "",
          case_role2: "",
          case_wordsToSay: [],
          case_wordsNotToSay: [],
        };
      } else {
        const session = state.sessions.find(
          (session) =>
            session && session.id && session.id === state.currentSessionId
        );

        if (session && session.caseConfig && session.caseConfig.cases) {
          const case_elem = session.caseConfig.cases.find(
            (case_elem) =>
              case_elem && case_elem.case_id && case_elem.case_id === payload
          );

          if (case_elem) {
            case_elem.case_notes = state.new_case.case_notes;

            case_elem.case_name = state.new_case.case_name;
            case_elem.case_description = state.new_case.case_description;

            case_elem.case_requisites = state.new_case.case_requisites;
            case_elem.case_role1 = state.new_case.case_role1;
            case_elem.case_role2 = state.new_case.case_role2;
          }

          // if (case_elem && case_elem.case_role1)
          //   if (case_elem && case_elem.case_role2)
          if (case_elem && case_elem.case_wordsToSay)
            case_elem.case_wordsToSay = state.new_case.case_wordsToSay;
          if (case_elem && case_elem.case_wordsNotToSay)
            case_elem.case_wordsNotToSay = state.new_case.case_wordsNotToSay;

          console.log(case_elem);
          console.log(state.new_case);

          state.new_case = {
            case_id: "",
            case_name: "",
            case_description: "",
            case_requisites: "",
            case_notes: "",
            case_role1: "",
            case_role2: "",
            case_wordsToSay: [],
            case_wordsNotToSay: [],
          };
        }
        if (session && session.status !== "new") {
          let token = "";
          if (localStorage && localStorage.getItem("token")) {
            const storedToken = localStorage.getItem("token");
            if (storedToken !== null) {
              token = storedToken;
            }
          }

          axios
            .put(API_URL + "/sessions/" + session.id, session, {
              headers: { Authorization: "Bearer " + token },
            })
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }

        if (session && session.status !== "new") {
          let token = "";
          if (localStorage && localStorage.getItem("token")) {
            const storedToken = localStorage.getItem("token");
            if (storedToken !== null) {
              token = storedToken;
            }
          }

          axios
            .put(API_URL + "/sessions/" + session.id, session, {
              headers: { Authorization: "Bearer " + token },
            })
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    },
    addCase(state) {
      if (state.new_session && state.currentSessionId == state.new_session.id) {
        state.new_session.caseConfig.cases.push({
          case_id: "c_" + uuid.v1(),
          case_name: state.new_case.case_name,
          case_description: state.new_case.case_description,
          case_requisites: state.new_case.case_requisites,
          case_notes: state.new_case.case_notes,
          case_role1: state.new_case.case_role1,
          case_role2: state.new_case.case_role2,
          case_wordsToSay: state.new_case.case_wordsToSay,
          case_wordsNotToSay: state.new_case.case_wordsNotToSay,
        });
      } else {
        const session = state.sessions.find(
          (session) =>
            session && session.id && session.id === state.currentSessionId
        );
        if (session) {
          console.log("added to session");

          session.caseConfig.cases.push({
            case_id: "c_" + uuid.v1(),
            case_name: state.new_case.case_name,
            case_description: state.new_case.case_description,
            case_requisites: state.new_case.case_requisites,
            case_notes: state.new_case.case_notes,
            case_role1: state.new_case.case_role1,
            case_role2: state.new_case.case_role2,
            case_wordsToSay: state.new_case.case_wordsToSay,
            case_wordsNotToSay: state.new_case.case_wordsNotToSay,
          });

          let token = "";
          if (localStorage && localStorage.getItem("token")) {
            const storedToken = localStorage.getItem("token");
            if (storedToken !== null) {
              token = storedToken;
            }
          }
          axios
            .put(API_URL + "/sessions/" + session.id, session, {
              headers: { Authorization: "Bearer " + token },
            })
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      state.new_case = {
        case_id: "",
        case_name: "",
        case_description: "",
        case_requisites: "",
        case_notes: "",
        case_role1: "",
        case_role2: "",
        case_wordsToSay: [],
        case_wordsNotToSay: [],
      };
    },
    setCase(state, payload) {
      console.log(state.new_session, state.currentSessionId, payload);
      if (state.new_session && state.currentSessionId == state.new_session.id) {
        const case_elem = state.new_session.caseConfig.cases.find(
          (case_elem) =>
            case_elem && case_elem.case_id && case_elem.case_id === payload
        );
        if (case_elem && case_elem.case_id)
          state.new_case.case_id = case_elem.case_id;
        if (case_elem && case_elem.case_name)
          state.new_case.case_name = case_elem.case_name;
        if (case_elem && case_elem.case_role1)
          state.new_case.case_role1 = case_elem.case_role1;
        if (case_elem && case_elem.case_role2)
          state.new_case.case_role2 = case_elem.case_role2;
        if (case_elem && case_elem.case_description)
          state.new_case.case_description = case_elem.case_description;
        if (case_elem && case_elem.case_requisites)
          state.new_case.case_requisites = case_elem.case_requisites;
        if (case_elem && case_elem.case_notes)
          state.new_case.case_notes = case_elem.case_notes;
        if (case_elem && case_elem.case_wordsToSay)
          state.new_case.case_wordsToSay = case_elem.case_wordsToSay;
        if (case_elem && case_elem.case_wordsNotToSay)
          state.new_case.case_wordsNotToSay = case_elem.case_wordsNotToSay;
      } else {
        const session = state.sessions.find(
          (session) =>
            session && session.id && session.id === state.currentSessionId
        );

        if (session && session.caseConfig && session.caseConfig.cases) {
          const case_elem = session.caseConfig.cases.find(
            (case_elem) =>
              case_elem && case_elem.case_id && case_elem.case_id === payload
          );
          if (case_elem && case_elem.case_id)
            state.new_case.case_id = case_elem.case_id;
          if (case_elem && case_elem.case_name)
            state.new_case.case_name = case_elem.case_name;
          if (case_elem && case_elem.case_role1)
            state.new_case.case_role1 = case_elem.case_role1;
          if (case_elem && case_elem.case_role2)
            state.new_case.case_role2 = case_elem.case_role2;
          if (case_elem && case_elem.case_description)
            state.new_case.case_description = case_elem.case_description;
          if (case_elem && case_elem.case_requisites)
            state.new_case.case_requisites = case_elem.case_requisites;
          if (case_elem && case_elem.case_notes)
            state.new_case.case_notes = case_elem.case_notes;
          if (case_elem && case_elem.case_wordsToSay)
            state.new_case.case_wordsToSay = case_elem.case_wordsToSay;
          if (case_elem && case_elem.case_wordsNotToSay)
            state.new_case.case_wordsNotToSay = case_elem.case_wordsNotToSay;
        } else {
          state.new_case = payload;
        }
      }
    },
    deleteCase(state, payload) {
      const session = state.sessions.find(
        (session) =>
          session && session.id && session.id === state.currentSessionId
      );

      if (session && session.caseConfig && session.caseConfig.cases) {
        const case_elem = session.caseConfig.cases.findIndex(
          (case_elem) =>
            case_elem && case_elem.case_id && case_elem.case_id === payload
        );
        session.caseConfig.cases.splice(case_elem, 1);
        let token = "";
        if (localStorage && localStorage.getItem("token")) {
          const storedToken = localStorage.getItem("token");
          if (storedToken !== null) {
            token = storedToken;
          }
        }
        axios
          .put(API_URL + "/sessions/" + session.id, session, {
            headers: { Authorization: "Bearer " + token },
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    setCaseNotes(state, payload) {
      const session = state.sessions.find(
        (session) =>
          session && session.id && session.id === state.currentSessionId
      );
      if (session && session.caseConfig) {
        state.new_case.case_notes = payload;
      }
    },
    setMicrophone(state, payload) {
      const session = state.sessions.find(
        (session) =>
          session && session.id && session.id === state.currentSessionId
      );
      if (session && session.audioConfig) {
        if (payload[0] == "1") {
          session.audioConfig.micro1_name = payload[1];
          session.audioConfig.micro1_color = payload[2];
        } else if (payload[0] == "2") {
          session.audioConfig.micro2_name = payload[1];
          session.audioConfig.micro2_color = payload[2];
        }
      }
    },
    setFeedbackConfig(state, payload) {
      console.log(payload);
      if (payload.speaker == "1") {
        state.currentRecord.speaker1.parameters[payload.index].checked =
          payload.checked;
      } else
        state.currentRecord.speaker2.parameters[payload.index].checked =
          payload.checked;
    },
    // setSpeakerConfig(state, payload) {},
    setDataUsageConfig(state, payload) {
      if (payload.speaker == "1") {
        state.currentRecord.speaker1.dataUsage[payload.index].checked =
          payload.checked;
      } else
        state.currentRecord.speaker2.dataUsage[payload.index].checked =
          payload.checked;
    },
    // setAudioConfig(state, payload) {},
    setSpeakerRole(state, payload) {
      console.log(payload);
      console.log(
        state.currentRecord.speaker1.id,
        "and",
        state.currentRecord.speaker2.id
      );
      console.log(state.currentRecord);
      if (payload.id == state.currentRecord.speaker1.id) {
        state.currentRecord.speaker1.role = payload.value;
      } else if (payload.id == state.currentRecord.speaker2.id) {
        state.currentRecord.speaker2.role = payload.value;
      }

      // const session = state.sessions.find(
      //   (session) =>
      //     session && session.id && session.id === state.currentSessionId
      // );
      // if (session && session.baseConfig) {
      //   if (payload.id == state.currentRecord.speaker1.id) {
      //     session.speakerConfig.speaker1_role = payload.value;
      //   } else if (payload.id == state.currentRecord.speaker2.id) {
      //     session.speakerConfig.speaker2_role = payload.value;
      //   }
      // }
    },
    setRoomConfig(state, payload) {
      if (state.new_session && state.currentSessionId == state.new_session.id) {
        if (payload[0] == "size")
          state.new_session.roomConfig.room_size = payload[1];
        if (payload[0] == "echo")
          state.new_session.roomConfig.room_echo = payload[1];
        if (payload[0] == "room")
          state.new_session.roomConfig.room_selected = payload[1];
        if (payload[0] == "rooms")
          state.new_session.roomConfig.rooms = payload[1];
      } else {
        const session = state.sessions.find(
          (session) =>
            session && session.id && session.id === state.currentSessionId
        );
        if (session && session.roomConfig) {
          if (payload[0] == "size") session.roomConfig.room_size = payload[1];
          if (payload[0] == "echo") session.roomConfig.room_echo = payload[1];
          if (payload[0] == "room")
            session.roomConfig.room_selected = payload[1];
          if (payload[0] == "rooms") session.roomConfig.rooms = payload[1];
        }
      }
    },
    setSpeakerName(state, payload) {
      if (payload.id == state.currentRecord.speaker1.id) {
        state.currentRecord.speaker1.name = payload.value;
      } else state.currentRecord.speaker2.name = payload.value;

      const session = state.sessions.find(
        (session) =>
          session && session.id && session.id === state.currentSessionId
      );
      if (session && session.baseConfig) {
        if (payload.id == state.currentRecord.speaker1.id) {
          session.speakerConfig.speaker1_name = payload.value;
        } else if (payload.id == state.currentRecord.speaker2.id) {
          session.speakerConfig.speaker2_name = payload.value;
        }
      }
    },
    setConfigStep(state, payload) {
      const session = state.sessions.find(
        (session) =>
          session && session.id && session.id === state.currentSessionId
      );
      if (session) session.configStep = payload;
    },
    setDate(state, payload) {
      if (state.new_session && state.currentSessionId == state.new_session.id) {
        state.new_session.date = payload;
      }

      const session = state.sessions.find(
        (session) =>
          session && session.id && session.id === state.currentSessionId
      );
      if (session) {
        session.date = payload;
      }
    },
    setCurrentRecord(state, payload) {
      console.log("set", payload);
      if (payload.feedbackId) {
        state.currentRecord.feedbackId = payload.feedbackId;
      }

      payload.case
        ? (state.currentRecord.case = JSON.parse(JSON.stringify(payload.case)))
        : state.currentRecord.case;
      if (payload.speaker1) {
        payload.speaker1.role
          ? (state.currentRecord.speaker1.role = payload.speaker1.role)
          : state.currentRecord.speaker1.role;

        payload.speaker1.student
          ? (state.currentRecord.speaker1.student = payload.speaker1.student)
          : state.currentRecord.speaker1.student;
        payload.speaker1.dataUsage
          ? (state.currentRecord.speaker1.dataUsage =
              payload.speaker1.dataUsage)
          : state.currentRecord.speaker1.dataUsage;
        payload.speaker1.parameters
          ? (state.currentRecord.speaker1.parameters =
              payload.speaker1.parameters)
          : state.currentRecord.speaker1.parameters;
        state.currentRecord.speaker1.id = payload.speaker1.id
          ? payload.speaker1.id
          : "1";
      }
      if (payload.speaker2) {
        if (payload.speaker2.name) {
          state.currentRecord.speaker2.name = payload.speaker2.name;
          // let participant = state.participants.find(
          //   (participant) =>
          //     participant &&
          //     participant.name &&
          //     participant.name === payload.speaker2.name
          // );
          // if (participant) {
          //   state.currentRecord.speaker2.verified = true;
          // } else state.currentRecord.speaker2.verified = false;
        }
        state.currentRecord.speaker2.id = payload.speaker2.id
          ? payload.speaker2.id
          : "2";
        payload.speaker2.role
          ? (state.currentRecord.speaker2.role = payload.speaker2.role)
          : state.currentRecord.speaker2.role;

        payload.speaker2.student
          ? (state.currentRecord.speaker2.student = payload.speaker2.student)
          : state.currentRecord.speaker2.student;
        payload.speaker2.dataUsage
          ? (state.currentRecord.speaker2.dataUsage =
              payload.speaker2.dataUsage)
          : state.currentRecord.speaker2.dataUsage;
        payload.speaker2.parameters
          ? (state.currentRecord.speaker2.parameters =
              payload.speaker2.parameters)
          : state.currentRecord.speaker2.parameters;
      }
      if (payload.words) {
        state.currentRecord.words.wordsToSay = payload.words.wordsToSay;
        state.currentRecord.words.wordsNotToSay = payload.words.wordsNotToSay;
      }
      if (payload.recordStatus) {
        console.log("recordStatus", payload.recordStatus);
        state.currentRecord.recordStatus = payload.recordStatus;
      }
    },
    // imports cosy devices from .env to an object array {label: x, url:y}
    setInstances(state) {
      // console.log(import.meta.env);
      for (const [labelEntry, labelIndex] of Object.entries(import.meta.env)) {
        if (labelEntry.startsWith("VITE_COSY_DEVICE_LABEL")) {
          const urlEntry = `VITE_COSY_DEVICE_URL${labelEntry.slice(22)}`;
          if (
            urlEntry in import.meta.env &&
            !!import.meta.env[urlEntry] &&
            !!labelIndex
          ) {
            state.instances.push({
              name: labelIndex,
              url: import.meta.env[urlEntry],
            });
            // console.log(labelEntry, labelIndex, urlEntry, import.meta.env[urlEntry]);
          }
        }
      }
      // console.log(state.instances);
    },
    setCurrentInstance(state, payload) {
      if (payload) {
        if (payload.name) {
          const instance = state.instances.find(
            (instance) => instance.name === payload.name
          );
          // console.log("setCurrentInstance", payload, state.instances, payload.name, instance);
          state.currentInstance = instance!;
          localStorage.setItem("currentInstance", payload.name);
        } else {
          const instance = state.instances.find(
            (instance) => instance.name === payload
          );
          state.currentInstance = instance!;
        }
      }
    },
  },
  actions: {
    init({ commit }) {
      return new Promise(() => {
        // Simulate an asynchronous setup
        const sessionId = localStorage.getItem("sessionId");
        if (sessionId) commit("setCurrentSessionId", sessionId);
        // resolve();
      });
    },
  },
  getters: {
    getInstances(state) {
      if (state.instances.length > 0) return state.instances;
    },
    getCurrentInstance(state) {
      if (state.currentInstance) return state.currentInstance;
    },

    getCurrentData(state) {
      if (state.currentData) return state.currentData;
    },
    getNewSession(state) {
      if (state.new_session) return state.new_session;
    },
    getToken(state) {
      return state.userData.token;
    },
    getUsers(state) {
      return state.user_ids;
    },
    getUserData(state) {
      return state.userData;
    },
    // getParticipants(state) {
    //   return state.participants;
    // },
    getPrevSession(state) {
      return state.prevSession;
    },
    getCurrentSession(state) {
      if (state.new_session && state.new_session.id == state.currentSessionId) {
        return state.new_session;
      }
      if (state.currentSession) {
        return state.currentSession;
      }
      const session = state.sessions.find(
        (session) => session && session.id === state.currentSessionId
      );
      if (session) return session;
    },
    getCurrentSessionId(state) {
      if (state.currentSessionId) return state.currentSessionId;
      if (state.currentSession) return state.currentSession.id;
    },
    getCurrentRecord(state) {
      return state.currentRecord;
    },
    // getCourses(state) {
    //   return state.courses;
    // },
    // getActors(state) {
    //   return state.actors;
    // },
    getCurrentFeedback(state) {
      const feedback = state.feedbacks.find(
        (feedback) => feedback && feedback.id === state.currentFeedbackId
      );
      return feedback;
    },
    getCurrentDataPoint(state) {
      return state.currentDataPoint;
    },
    getCurrentTime(state) {
      return state.currentTime;
    },
    getCurrentAudioTime(state) {
      return state.currentAudioTime;
    },

    getSessions(state) {
      return state.sessions;
    },
    getSubstantives(state) {
      return state.currentRecord.words;
    },
    getWords(state) {
      if (state.currentData) return state.currentData.words;
    },
    getKeywordFrequencies(state) {
      if (state.currentData) return state.currentData.keywordFrequencies;
    },

    getQuestionCodes(state) {
      if (state.currentData) return state.currentData.words;
    },

    getSpeakers(state) {
      const session = state.sessions.find(
        (session) =>
          session && session.id && session.id === state.currentSessionId
      );
      if (session && session.speakerConfig)
        return [
          {
            name: session.speakerConfig.speaker1_name,
            role: session.speakerConfig.speaker1_role,
            color: session.speakerConfig.speaker1_color,
          },
          {
            name: session.speakerConfig.speaker2_name,
            role: session.speakerConfig.speaker2_role,
            color: session.speakerConfig.speaker2_color,
          },
        ];
    },
    getFeedbacks(state) {
      return state.feedbacks;
    },
    getFeedbackSpeakers(state) {
      const feedback = state.feedbacks.find(
        (feedback) => feedback && feedback.id === state.currentFeedbackId
      );

      if (feedback && feedback.meta && feedback.meta.speakers) {
        return feedback.meta.speakers;
      }
    },

    // getParticipantById(state, payload) {
    //   const participant = state.participants.find(
    //     (participant) => participant && participant.id === payload
    //   );

    //   if (participant) return participant.name;
    // },

    getSpeakerRoles(state) {
      const session = state.sessions.find(
        (session) => session?.id === state.currentSessionId
      );
      if (session && session.audioConfig)
        return [
          session.speakerConfig.speaker1_role,
          session.speakerConfig.speaker2_role,
        ];
    },
    getSpeakerConfig(state) {
      const session = state.sessions.find(
        (session) => session?.id === state.currentSessionId
      );
      if (session) return session.speakerConfig;
    },
    getRoles() {
      return [
        { name: "Angehörige*r" },
        { name: "Arzt / Ärztin" },
        { name: "Frau" },
        { name: "Hebamme" },
        { name: "Mann" },
        { name: "Patient*in" },
        { name: "Pflegefachkraft" },
        { name: "Therapeut*in" },
      ];
      // const session = state.sessions.find(
      //   (session) => session?.id === state.currentSessionId
      // );
      // if (session && session.speakerConfig) {
      //   return session.speakerConfig.roles;
      // } else return undefined;
    },
    getBaseConfig(state) {
      if (state.new_session && state.currentSessionId == state.new_session.id) {
        return state.new_session.baseConfig;
      } else {
        const session = state.sessions.find(
          (session) => session?.id === state.currentSessionId
        );
        if (session && session.baseConfig) return session.baseConfig;
      }
    },
    getConfigStep(state) {
      const session = state.sessions.find(
        (session) => session?.id === state.currentSessionId
      );
      if (session) return session.configStep;
    },

    getNewCase(state) {
      return state.new_case;
    },
    getCaseConfig(state) {
      if (state.new_session && state.currentSessionId == state.new_session.id) {
        return state.new_session.caseConfig;
      } else {
        const session = state.sessions.find(
          (session) => session?.id === state.currentSessionId
        );
        if (session && session.caseConfig) return session.caseConfig;
      }
    },
    getAudioConfig() {
      return {
        micro1_id: "1",
        micro1_name: "Nr.1",
        micro1_color: "blue",
        micro1_brand: "kp",
        micro2_id: "2",
        micro2_name: "Nr.2",
        micro2_brand: "String",
        micro2_color: "red",
        microphones: [
          { name: "Nr.1", color: "red" },
          { name: "Nr.2", color: "green" },
          { name: "Nr.3", color: "blue" },
        ],
      };
    },
    getLoginState(state) {
      return state.loginState;
    },
    getRoomConfig(state) {
      if (
        state.new_session &&
        state.new_session.roomConfig &&
        state.currentSessionId == state.new_session.id
      ) {
        return state.new_session.roomConfig;
      } else {
        const session = state.sessions.find(
          (session) => session?.id === state.currentSessionId
        );
        if (session && session.roomConfig) return session.roomConfig;
      }
    },
    getMicrophones(state) {
      const session = state.sessions.find(
        (session) => session?.id === state.currentSessionId
      );
      if (session && session.audioConfig && session.audioConfig.microphones)
        return session.audioConfig.microphones;
    },
    getFeedback(state) {
      const feedback = state.feedbacks.find(
        (feedback) => feedback && feedback.id === state.currentFeedbackId
      );
      if (feedback) return feedback;
    },
    getConversationShares() {
      // const feedback = state.feedbacks.find(
      //   (feedback) => feedback && feedback.id === state.currentFeedbackId
      // );
      // if (
      //   feedback &&
      //   feedback.feedbackData &&
      //   feedback.feedbackData.conversationShares
      // ) {
      //   return feedback.feedbackData.conversationShares;
      // }
      // if (state.currentData&&
      //   state.currentData.feedbackData &&
      //   state.currentData.feedbackData.conversationShares
      // ) {
      //   return state.currentData.feedbackData.conversationShares;
      // }
    },

    getGlobalPitch() {
      // const feedback = state.feedbacks.find(
      //   (feedback) => feedback && feedback.id === state.currentFeedback
      // );
      // if (
      //   feedback &&
      //   feedback.feedbackData &&
      //   feedback.feedbackData.pitch &&
      //   feedback.feedbackData.pitch.dataGlobal
      // )
      //   return feedback.feedbackData.pitch.dataGlobal;
    },
    getFeedbackMeta(state) {
      const feedback = state.feedbacks.find(
        (feedback) => feedback && feedback.id === state.currentFeedbackId
      );
      if (feedback && feedback.meta) return feedback.meta;
    },
    getTranscript(state) {
      if (state.currentTranscript) return state.currentTranscript;

      // const feedback = state.feedbacks.find(
      //   (feedback) => feedback && feedback.id === state.currentFeedback
      // );
      // if (feedback && feedback.transcript) return feedback.transcript;
    },
    getTimeStamps(state) {
      return state.timeSamples;
      // const feedback = state.feedbacks.find(
      //   (feedback) => feedback && feedback.id === state.currentFeedback
      // );
      // if (feedback && feedback.transcript) return feedback.transcript;
    },
    hasConfigurationTitle(state) {
      return (
        state.new_session &&
        state.new_session.baseConfig.subject_topic.length > 0
      );
    },
  },
});
