import React from "react";
import { observer } from "mobx-react-lite";
import { Input, Checkbox, Image } from "antd";
import {
  RightCircleOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { HumanFileSize } from "../HumanFileSize";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 328px;
  height: 328px;
  border-radius: 4px;
  border: dashed 1px rgba(255, 255, 255, 0.2);
  margin: 24px;
`;

const Preview = styled.div`
  cursor: pointer;
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75);
  border-radius: 50%;
  overflow: auto;

  &:after {
    content: " ";
    left: 0;
    box-shadow: rgb(255 255 255 / 20%) 0px 0px 0px 2px inset;
    border-radius: 50%;
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

const Title = styled.div`
  margin-bottom: 8px;
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  width: 100%;
  color: rgba(255, 255, 255, 0.85);
  text-overflow: ellipsis;
  text-align: center;
  overflow: hidden;
  padding: 0 40px;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;

  .ant-input-affix-wrapper {
    width: 76px;
    margin: 0 4px;
    background: none;
    border-color: rgba(255, 255, 255, 0.2);

    &:hover,
    &:focus {
      border-color: rgba(255, 255, 255, 0.65);
      box-shadow: none;
    }
  }

  .ant-checkbox {
    &:hover .ant-checkbox-inner,
    &:focus .ant-checkbox-inner {
      border-color: #2ec973;
    }
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background: #2ec973;
  }

  .ant-checkbox-inner {
    border-color: #2ec973;
    background: none;
  }

  input {
    background: none;
    color: rgba(255, 255, 255, 0.65);
  }
`;

const Info = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.45);
`;

export default observer(({ store, path }) => {
  const [visible, setVisible] = React.useState(false);
  const picture = store.getPicture(path);
  const ratio = picture.width / picture.height;
  let newWidth = picture.newWidth;
  let newHeight = picture.newHeight;

  function onChangeWidth(newWidth) {
    newHeight = Math.floor(newWidth / ratio);
    store.updatePictureSetting(
      picture.path,
      newWidth,
      newHeight,
      picture.quality,
      picture.ignore
    );
  }

  function onChangeHeight(newHeight) {
    newWidth = Math.floor(newHeight * ratio);
    store.updatePictureSetting(
      picture.path,
      newWidth,
      newHeight,
      picture.quality,
      picture.ignore
    );
  }

  function onChangeQuality(newQuality) {
    store.updatePictureSetting(
      picture.path,
      picture.newWidth,
      picture.newHeight,
      newQuality,
      picture.ignore
    );
  }

  function onChangeIgnore(newIgnore) {
    store.updatePictureSetting(
      picture.path,
      picture.newWidth,
      picture.newHeight,
      picture.quality,
      newIgnore
    );
  }

  return (
    <Container>
      <Preview onClick={() => setVisible(true)}>
        <img
          src={"data:image/jpeg;base64," + picture.newBase64}
          width="100%"
          height="100%"
          alt={picture.name}
        />
        <div style={{ display: "none" }}>
          <Image.PreviewGroup
            preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
          >
            <Image src={"data:image/jpeg;base64," + picture.base64} />
            <Image src={"data:image/jpeg;base64," + picture.newBase64} />
          </Image.PreviewGroup>
        </div>
      </Preview>
      <Title>{picture.name}</Title>
      <Options>
        <Input
          placeholder="width"
          size="small"
          suffix={
            <ColumnWidthOutlined
              style={{ color: "rgba(255, 255, 255, 0.2)" }}
            />
          }
          onChange={(e) => onChangeWidth(parseInt(e.target.value) || 0)}
          value={picture.newWidth}
        />
        <Input
          placeholder="height"
          size="small"
          suffix={
            <ColumnHeightOutlined
              style={{ color: "rgba(255, 255, 255, 0.2)" }}
            />
          }
          onChange={(e) => onChangeHeight(parseInt(e.target.value) || 0)}
          value={picture.newHeight}
        />

        <Input
          placeholder="quality"
          size="small"
          disabled={picture.name.match(/\.png$/i)}
          suffix={
            <Checkbox
              checked={!picture.ignore}
              onChange={(e) => onChangeIgnore(!e.target.checked)}
            />
          }
          onChange={(e) => onChangeQuality(parseInt(e.target.value) || 0)}
          value={picture.quality}
        />
      </Options>

      <Info>
        {HumanFileSize.format(picture.size)}
        {!picture.ignore && (
          <React.Fragment>
            <RightCircleOutlined
              style={{
                fontSize: "12px",
                margin: "0 8px",
                color: "rgba(255, 255, 255, 0.2)",
              }}
            />
            <span style={{ color: "#2ec973" }}>
              {HumanFileSize.format(picture.newSize)}
            </span>
          </React.Fragment>
        )}
      </Info>
    </Container>
  );
});
