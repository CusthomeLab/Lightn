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
  isLoading = false;
  lastCompressedWidth = null;
  lastCompressedQuality = 85;

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
    this.lastCompressedWidth = newWidth;
  }

  toJson() {
    return {
      path: this.path,
      relative: this.relative,
      name: this.name,
      newWidth: this.newWidth,
      newHeight: this.newHeight,
      newBase64: this.newBase64,
      quality: this.quality,
      ignore: this.ignore,
    };
  }

  updateSetting(newWidth, newHeight, quality, ignore, processPicture) {
    this.newWidth = newWidth;
    this.newHeight = newHeight;
    this.quality = quality;
    this.ignore = ignore;
    this.isLoading = processPicture;
  }

  updateNewPictureInfo(newWidth, newHeight, newSize, newBase64, quality) {
    this.newWidth = newWidth;
    this.newHeight = newHeight;
    this.newSize = newSize;
    this.newBase64 = newBase64;
    this.isLoading = false;
    this.lastCompressedWidth = newWidth;
    this.quality = quality;
    this.lastCompressedQuality = quality;
  }
}
