export default {
  namespaced: true,
  state: {
    messages: [],
  },
  actions: {
    updateMessage(context, { message, status }) {
      const timestamp = Math.floor(new Date() / 1000);

      context.commit('UPDATE_MESSAGE', {
        message,
        status,
        timestamp,
      });

      context.dispatch('removeMessageWithTiming', timestamp);
    },
    removeMessageWithTiming(context, timestamp) {
      setTimeout(() => {
        context.state.messages.forEach((item, index) => {
          if (item.timestamp === timestamp) {
            // context.state.messages.splice(i, 1);
            context.commit('REMOVE_MESSAGE_TIMING', index);
          }
        });
      }, 5000);
    },
  },
  mutations: {
    UPDATE_MESSAGE(state, payload) {
      state.messages = state.messages.push(payload);
    },
    REMOVE_MESSAGE_TIMING(state, index) {
      state.messages = state.messages.splice(index, 1);
    },
  },
  getters: {
    messages(state) {
      return state.messages;
    },
  },
};
