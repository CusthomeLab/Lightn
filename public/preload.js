const { ipcRenderer } = require("electron");

process.once("loaded", () => {
  window.addEventListener("message", (evt) => {
    if (evt.data.type === "app:input-dir-clicked") {
      ipcRenderer.send("app:input-dir-clicked");
    }
    if (evt.data.type === "app:export-dir-clicked") {
      ipcRenderer.send("app:export-dir-clicked", evt.data.config);
    }
    if (evt.data.type === "app:picture-setting-updated") {
      ipcRenderer.send("app:picture-setting-updated", evt.data.picture);
    }
    if (evt.data.type === "app:input-files-dropped") {
      ipcRenderer.send("app:input-files-dropped", evt.data.path);
    }
  });
});

ipcRenderer.on("electron:reset", function (event, arg) {
  window.postMessage({
    type: "electron:reset",
  });
});

ipcRenderer.on("electron:picture-added", function (event, picture) {
  window.postMessage({
    type: "electron:picture-added",
    picture: picture,
  });
});

ipcRenderer.on("electron:import-dir-selected", function (event, paths) {
  window.postMessage({
    type: "electron:import-dir-selected",
    paths: paths,
  });
});

ipcRenderer.on("electron:import-finished", function (event) {
  window.postMessage({
    type: "electron:import-finished",
  });
});

ipcRenderer.on("electron:file-processed", function (event, process) {
  window.postMessage({
    type: "electron:file-processed",
    process: process,
  });
});

ipcRenderer.on("electron:picture-setting-info", function (event, info) {
  window.postMessage({
    type: "electron:picture-setting-info",
    info: info,
  });
});
