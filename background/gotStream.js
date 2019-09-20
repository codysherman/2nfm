function gotStream(stream) {
  if (!stream) {
    setDefaults();

    // chrome.windows.create({
    //   url:
    //     "data:text/html,<h1>Internal error occurred while capturing the screen.</h1>",
    //   type: "popup",
    //   width: screen.width / 2,
    //   height: 170,
    // });
    // return;
  }

  // chrome.browserAction.setTitle({
  //   title: "Connecting to WebSockets server.",
  // });

  // chrome.browserAction.disable();

  stream.addEventListener("inactive", e => {
    setDefaults();
  });

  addStreamStopListener(stream, function() {
    setDefaults();
    // chrome.runtime.reload();
  });

  shareStreamUsingRTCMultiConnection(stream);

  // chrome.browserAction.setIcon({
  //   path: "images/icon-active_128.png",
  // });
}
