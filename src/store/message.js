export default {
  namespaced: true,
  state: {
    message: '',
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
            context.commit('REMOVE_MESSAGE', index);
          }
        });
      }, 5000);
    },
  },
  mutations: {
    UPDATE_MESSAGE(state, payload) {
      state.message = state.message.push(payload);
    },
    REMOVE_MESSAGE(state, index) {
      state.message = state.message.splice(index, 1);
    },
  },
  getters: {
    message(state) {
      return state.message;
    },
  },
};
