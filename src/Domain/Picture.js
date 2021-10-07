import { makeAutoObservable, observable } from "mobx";

export class Picture {
  path = null;
  relative = null;
  name = null;
  width = null;
  height = null;
  size = null;
  newWidth = null;
  newHeight = null;
  newSize = null;
  base64 = null;
  quality = 85;
  ignore = false;

  constructor(
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
    makeAutoObservable(this, {
      newWidth: observable,
      newHeight: observable,
    });
    this.path = path;
    this.relative = relative;
    this.name = name;
    this.width = width;
    this.height = height;
    this.size = size;
    this.base64 = base64;
    this.newWidth = newWidth;
    this.newHeight = newHeight;
    this.newSize = newSize;
    this.newBase64 = newBase64;
  }

  toJson() {
    return {
      path: this.path,
      relative: this.relative,
      name: this.name,
      newWidth: this.newWidth,
      newHeight: this.newHeight,
      quality: this.quality,
      ignore: this.ignore,
    };
  }

  updateSetting(newWidth, newHeight, quality, ignore) {
    this.newWidth = newWidth;
    this.newHeight = newHeight;
    this.quality = quality;
    this.ignore = ignore;
  }

  updateNewPictureInfo(newWidth, newHeight, newSize, newBase64) {
    this.newWidth = newWidth;
    this.newHeight = newHeight;
    this.newSize = newSize;
    this.newBase64 = newBase64;
  }
}
