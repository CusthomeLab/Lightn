import React from "react";
import { observer } from "mobx-react-lite";
import { Alert } from "antd";
import PictureItem from "./PictureItem";
import styled from "styled-components";

const Container = styled.div`
  padding-top: 72px;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
`;

export default observer(({ store, setImageSlider }) => {
  const [isWarning, setIsWarning] = React.useState(false);
  const numberPictureWithBigSize = store.numberPictureWithBigSize();

  React.useEffect(() => {
    if (numberPictureWithBigSize) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberPictureWithBigSize]);

  return (
    <Container>
      {isWarning && (
        <Alert
          message="Warning"
          description={
            (numberPictureWithBigSize === 1
              ? "One image"
              : numberPictureWithBigSize + " images") +
            " exceeds 1024px. Please resize " +
            (numberPictureWithBigSize === 1 ? "it!" : "them!")
          }
          type="warning"
          showIcon
          style={{ margin: "24px 48px", width: "100%" }}
        />
      )}
      {store.getPictures().map((picture, i) => {
        return (
          <PictureItem
            key={picture.path}
            path={picture.path}
            store={store}
            setImageSlider={setImageSlider}
          />
        );
      })}
    </Container>
  );
});
