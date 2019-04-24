// @flow

import type {AbsintheSocket} from "./types";

const closeConnection = (absintheSocket: AbsintheSocket) => {
  absintheSocket.channel.leave();
  absintheSocket.phoenixSocket.disconnect();
  absintheSocket.channelJoinCreated = false;
  absintheSocket.channel = absintheSocket.phoenixSocket.channel(
    absintheSocket.absintheChannelName
  );
  return absintheSocket;
};

const startInactiveTimeout = (absintheSocket: AbsintheSocket) => {
  if (
    !absintheSocket.inactiveTimeout &&
    absintheSocket.inactiveTimeoutDuration
  ) {
    absintheSocket.inactiveTimeout = setTimeout(
      () => closeConnection(absintheSocket),
      absintheSocket.inactiveTimeoutDuration
    );
  }
  return absintheSocket;
};

const cancelInactiveTimeout = (absintheSocket: AbsintheSocket) => {
  if (absintheSocket.inactiveTimeout) {
    clearTimeout(absintheSocket.inactiveTimeout);
    absintheSocket.inactiveTimeout = null;
  }
  return absintheSocket;
};

const updateInactiveTimeout = (absintheSocket: AbsintheSocket) => {
  if (absintheSocket.notifiers.length === 0) {
    return startInactiveTimeout(absintheSocket);
  }
  return cancelInactiveTimeout(absintheSocket);
};

export default updateInactiveTimeout;
