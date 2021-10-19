import React from "react";
import UserActions from "./Components/UserActions";
import PictureCollection from "./Components/PictureCollection";
import store from "./Domain/PictureStore";
import { observer } from "mobx-react-lite";
import { message, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import Header from "./Components/Header";
import styled from "styled-components";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";

const ImageSlider = styled.div`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  background-color: #333333;
  overflow: hidden;

  .ant-btn:hover,
  .ant-btn:focus {
    color: #2ec973;
    border-color: #2ec973;
  }
`;

export default observer(() => {
  const [firstImage, setFirstImage] = React.useState(null);
  const [secondImage, setSecondImage] = React.useState(null);

  React.useEffect(() => {
    if (
      store.getCurrentProcess() &&
      store.getCurrentProcess().done !== store.getCurrentProcess().total
    ) {
      const contentMessage =
        store.getCurrentProcess().action + " " +
        store.getCurrentProcess().file +
        "(" +
        store.getCurrentProcess().done +
        "/" +
        store.getCurrentProcess().total +
        ")";
      message.loading({ content: contentMessage, key: "export", duration: 0 });
    } else if (
      store.getCurrentProcess() &&
      store.getCurrentProcess().done === store.getCurrentProcess().total
    ) {
      message.success({
        content: "Exported with success!",
        key: "export",
        duration: 2,
      });
      store.reset();
    } else if (store.isImporting) {
      message.loading({
        content: "Files are being uploaded please wait...",
        key: "import",
        duration: 0,
      });
    } else if (!store.isImporting && store.getPictures().length > 0) {
      message.success({
        content: "Uploaded with success!",
        key: "import",
        duration: 2,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.getCurrentProcess(), store.isImporting]);

  const setImageSlider = (firstUrl, secondUrl) => {
    setFirstImage(firstUrl);
    setSecondImage(secondUrl);
  };

  return (
    <React.Fragment>
      <Header store={store} />
      {store.getPictures().length === 0 ? (
        <UserActions />
      ) : (
        <PictureCollection store={store} setImageSlider={setImageSlider} />
      )}

      {firstImage && secondImage && (
        <ImageSlider>
          <Button
            onClick={() => setImageSlider(null, null)}
            style={{
              position: "absolute",
              right: "24px",
              top: "24px",
              zIndex: 1,
            }}
            shape="circle"
            icon={<CloseOutlined />}
            size="large"
          />
          <ReactBeforeSliderComponent
            firstImage={{ imageUrl: firstImage }}
            secondImage={{ imageUrl: secondImage }}
            delimiterColor="#333"
          />
        </ImageSlider>
      )}
    </React.Fragment>
  );
});
