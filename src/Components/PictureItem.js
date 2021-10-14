import React from "react";
import { observer } from "mobx-react-lite";
import { Input, Checkbox, Spin } from "antd";
import {
  RightCircleOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  ControlOutlined,
  LoadingOutlined,
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
  border: dashed 1px
    ${({ isWarning }) =>
      isWarning ? "rgba(249, 43, 70, 0.8)" : "rgba(255, 255, 255, 0.2)"};
  margin: 24px;
`;

const Preview = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 16px;

  .ant-checkbox {
    top: 0;
    &:hover .ant-checkbox-inner,
    &:focus .ant-checkbox-inner {
      border-color: #2ec973;
    }
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background: #2ec973;
  }

  .ant-checkbox-checked::after {
    border-color: #2ec973;
    border-radius: 50%;
  }

  .ant-checkbox-wrapper::after {
    display: none;
  }

  .ant-checkbox-inner {
    border-color: #2ec973;
    background: none;
    border-radius: 50%;
  }
`;

const ImageContainer = styled.div`
  cursor: pointer;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.75);
  border-radius: 50%;
  width: 100%;
  height: 100%;
  overflow: hidden;
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

const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${({ isLoading }) =>
    isLoading ? "rgba(0, 0, 0, 0.6)" : "transparent"};
  transition: background-color 0.2s;
`;

const Title = styled.div`
  margin-bottom: 8px;
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  width: 100%;
  color: ${({ disabled }) =>
    disabled ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.85)"};
  text-overflow: ellipsis;
  text-align: center;
  overflow: hidden;
  padding: 0 40px;
  transition: color 0.2s;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const InputContainer = styled.div`
  position: relative;

  .ant-input {
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

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input:disabled {
    background-color: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.25);
  }

  input {
    background: none;
    color: ${({ isWarning }) =>
      isWarning ? "rgba(249, 43, 70, 0.8)" : "rgba(255, 255, 255, 0.65)"};
  }
`;

const Info = styled.div`
  font-family: Roboto;
  font-size: 14px;
  line-height: 22px;
  color: ${({ disabled }) =>
    disabled ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.45)"};
  transition: color 0.2s;
`;

export default observer(({ store, path, setImageSlider }) => {
  const picture = store.getPicture(path);
  const ratio = picture.width / picture.height;
  let newWidth = picture.newWidth;
  let newHeight = picture.newHeight;
  const isLoading = picture.isLoading;
  const isWarning = newHeight > 1024 || newWidth > 1024;

  const processPicture = () => {
    store.updatePictureSetting(
      picture.path,
      newWidth,
      newHeight,
      picture.quality,
      picture.ignore,
      true
    );
  };

  const onChangeWidth = (newWidth) => {
    newHeight = Math.floor(newWidth / ratio);
    store.updatePictureSetting(
      picture.path,
      newWidth,
      newHeight,
      picture.quality,
      picture.ignore
    );
  };

  const onChangeHeight = (newHeight) => {
    newWidth = Math.floor(newHeight * ratio);
    store.updatePictureSetting(
      picture.path,
      newWidth,
      newHeight,
      picture.quality,
      picture.ignore
    );
  };

  const onChangeQuality = (newQuality) => {
    store.updatePictureSetting(
      picture.path,
      picture.newWidth,
      picture.newHeight,
      newQuality,
      picture.ignore
    );
  };

  const onChangeIgnore = (newIgnore) => {
    store.updatePictureSetting(
      picture.path,
      picture.newWidth,
      picture.newHeight,
      picture.quality,
      newIgnore,
      true
    );
  };

  const antIcon = <LoadingOutlined style={{ fontSize: "32px" }} spin />;

  return (
    <Container isWarning={isWarning}>
      <Preview>
        <Checkbox
          style={{ position: "absolute", right: 0, top: 0 }}
          checked={!picture.ignore}
          onChange={(e) => onChangeIgnore(!e.target.checked)}
        />

        <ImageContainer
          onClick={() =>
            setImageSlider(
              "data:image/jpeg;base64," + picture.base64,
              "data:image/jpeg;base64," + picture.newBase64
            )
          }
        >
          <img
            src={"data:image/jpeg;base64," + picture.newBase64}
            width="100%"
            height="100%"
            alt={picture.name}
          />
          <Loading isLoading={isLoading}>
            <Spin
              style={{ color: "#fff" }}
              indicator={antIcon}
              spinning={isLoading}
            />
          </Loading>
        </ImageContainer>
      </Preview>
      <Title disabled={picture.ignore}>{picture.name}</Title>
      <Options>
        <InputContainer isWarning={picture.newWidth > 1024}>
          <Input
            placeholder="width"
            size="small"
            type="number"
            disabled={isLoading || picture.ignore}
            max={picture.width}
            min={0}
            onWheel={(e) => e.target.blur()}
            onChange={(e) =>
              onChangeWidth(
                e.target.value
                  ? parseInt(
                      e.target.value > picture.width
                        ? picture.width
                        : e.target.value
                    )
                  : ""
              )
            }
            onBlur={(e) => processPicture()}
            value={picture.newWidth}
          />
          <ColumnWidthOutlined
            style={{
              position: "absolute",
              top: "4px",
              right: "13px",
              color: "rgba(255, 255, 255, 0.2)",
            }}
          />
        </InputContainer>

        <InputContainer isWarning={picture.newHeight > 1024}>
          <Input
            placeholder="height"
            size="small"
            type="number"
            disabled={isLoading || picture.ignore}
            max={picture.height}
            min={0}
            onWheel={(e) => e.target.blur()}
            onChange={(e) =>
              onChangeHeight(
                e.target.value
                  ? parseInt(
                      e.target.value > picture.height
                        ? picture.height
                        : e.target.value
                    )
                  : ""
              )
            }
            onBlur={(e) => processPicture()}
            value={picture.newHeight}
          />
          <ColumnHeightOutlined
            style={{
              position: "absolute",
              top: "5px",
              right: "13px",
              color: "rgba(255, 255, 255, 0.2)",
            }}
          />
        </InputContainer>

        <InputContainer>
          <Input
            placeholder="quality"
            size="small"
            type="number"
            disabled={
              picture.name.match(/\.png$/i) || isLoading || picture.ignore
            }
            max={100}
            min={0}
            onWheel={(e) => e.target.blur()}
            onChange={(e) =>
              onChangeQuality(
                e.target.value
                  ? parseInt(e.target.value > 100 ? 100 : e.target.value)
                  : ""
              )
            }
            onBlur={(e) => processPicture()}
            value={picture.quality}
          />
          <ControlOutlined
            style={{
              position: "absolute",
              top: "4px",
              right: "13px",
              color: "rgba(255, 255, 255, 0.2)",
            }}
          />
        </InputContainer>
      </Options>

      <Info disabled={picture.ignore}>
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
            <span
              style={{
                color: picture.size < picture.newSize ? "#F92B46" : "#2ec973",
              }}
            >
              {HumanFileSize.format(picture.newSize)}
            </span>
          </React.Fragment>
        )}
      </Info>
    </Container>
  );
});
