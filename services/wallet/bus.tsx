type Listener = () => void;

const listeners = {
  updated: new Set<Listener>(),
};

export const walletBus = {
  on(event: "updated", cb: Listener): () => void {
    listeners.updated.add(cb);
    return () => {
      listeners.updated.delete(cb);
    };
  },
  emit(event: "updated"): void {
    if (event !== "updated") return;
    listeners.updated.forEach((cb) => cb());
  },
};
