import { makeAutoObservable, observable } from "mobx";
import { Picture } from "./Picture";

export class PictureStore {
  importDir = null;
  pictures = [];
  currentProcess = null;

  constructor() {
    makeAutoObservable(this, {
      pictures: observable,
    });
  }

  setImportDir(value) {
    this.importDir = value;
  }

  addPicture(
    path,
    relative,
    name,
    width,
    height,
    size,
    base64,
    newWidth,
    newHeight,
    newSize,
    newBase64
  ) {
    this.pictures.push(
      new Picture(
        path,
        relative,
        name,
        width,
        height,
        size,
        base64,
        newWidth,
        newHeight,
        newSize,
        newBase64
      )
    );
  }

  getPicture(path) {
    return this.pictures.find((picture) => picture.path === path);
  }

  getPictures() {
    return this.pictures;
  }

  getCurrentProcess() {
    return this.currentProcess;
  }

  updatePictureSetting(path, newWidth, newHeight, quality, ignore) {
    let picture = this.getPicture(path);
    picture.updateSetting(newWidth, newHeight, quality, ignore);

    if (newWidth > 0 && newHeight > 0 && quality > 0) {
      window.postMessage({
        type: "app:picture-setting-updated",
        picture: picture,
      });
    }
  }

  updateNewPictureInfo(path, newWidth, newHeight, newSize, newBase64) {
    let picture = this.getPicture(path);
    picture.updateNewPictureInfo(newWidth, newHeight, newSize, newBase64);
  }

  reset() {
    this.importDir = null;
    this.pictures = [];
    this.currentProcess = null;
  }

  toJson() {
    return {
      importDir: this.importDir,
      pictures: this.pictures.map((picture, i) => picture.toJson()),
    };
  }

  updateCurrentProcess(file, action, done, total) {
    this.currentProcess = {
      file: file,
      action: action,
      done: done,
      total: total,
    };
  }

  getTotalSize() {
    let total = 0;
    this.pictures.forEach(function (picture) {
      total += picture.size;
    });
    return total;
  }

  getNewTotalSize() {
    let total = 0;
    this.pictures.forEach(function (picture) {
      total += picture.newSize;
    });
    return total;
  }
}

const store = new PictureStore();

window.addEventListener("message", (evt) => {
  if (evt.data.type === "electron:reset") {
    store.reset();
  }
  if (evt.data.type === "electron:import-dir-selected") {
    store.setImportDir(evt.data.path);
  }
  if (evt.data.type === "electron:file-processed") {
    store.updateCurrentProcess(
      evt.data.process.file,
      evt.data.process.action,
      evt.data.process.done,
      evt.data.process.total
    );
  }
  if (evt.data.type === "electron:picture-added") {
    console.log("electron:picture-added", evt.data.picture);
    let picture = evt.data.picture;
    store.addPicture(
      picture.path,
      picture.relative,
      picture.name,
      picture.width,
      picture.height,
      picture.size,
      picture.base64,
      picture.newWidth,
      picture.newHeight,
      picture.newSize,
      picture.newBase64
    );
  }
  if (evt.data.type === "electron:picture-setting-info") {
    console.log("electron:picture-setting-info", evt.data.info);
    store.updateNewPictureInfo(
      evt.data.info.path,
      evt.data.info.newWidth,
      evt.data.info.newHeight,
      evt.data.info.newSize,
      evt.data.info.newBase64
    );
  }
});

export default store;
