import { connection } from "./globals";
import { setDefaults } from "./setDefaults";

window.addEventListener(
  "offline",
  function() {
    if (!connection || !connection.attachStreams.length) return;

    setDefaults();
  },
  false
);

window.addEventListener(
  "online",
  function() {
    if (!connection) return;

    setDefaults();
  },
  false
);
