import React from "react";
import styled from "styled-components";
import { UploadOutlined } from "@ant-design/icons";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const DashedBox = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 384px;
  height: auto;
  padding: 40px 0 38px;
  border-radius: 4px;
  border: ${({ dragenter }) =>
    dragenter
      ? "dashed 1px rgba(255, 255, 255, 0.8)"
      : "dashed 1px rgba(255, 255, 255, 0.2)"};
  transition: border-color 0.3s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.8);
  }
`;

const Title = styled.div`
  margin: 17px 0 3px;
  font-family: Roboto;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 24px;
  letter-spacing: normal;
  color: rgba(255, 255, 255, 0.85);
  pointer-events: none;
`;

const Description = styled.div`
  font-family: Roboto;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 22px;
  letter-spacing: normal;
  text-align: center;
  color: rgba(255, 255, 255, 0.45);
  pointer-events: none;
`;

export default () => {
  const [dragenter, setDragenter] = React.useState(false);

  React.useEffect(() => {
    const dropZone = document.getElementById("drop");
    if (dropZone) {
      dropZone.addEventListener("drop", onDrop);
      dropZone.addEventListener("dragover", onDragover);
      dropZone.addEventListener("dragenter", onDragenter);
      dropZone.addEventListener("dragleave", onDragleaver);

      return () => {
        dropZone.removeEventListener("drop", onDrop);
        dropZone.removeEventListener("dragover", onDragover);
        dropZone.removeEventListener("dragenter", onDragenter);
        dropZone.removeEventListener("dragleave", onDragleaver);
      };
    }
  }, [dragenter]);

  const onDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const path =[]
    if (event.dataTransfer.files) {
      for (const file of event.dataTransfer.files) {
        path.push(file.path);
      }
    }

    window.postMessage({
      type: "app:input-files-dropped",
      path: path,
    });
  };

  const onDragover = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragenter = () => {
    setDragenter(true);
  };

  const onDragleaver = () => {
    setDragenter(false);
  };

  const openInputDirClicked = () => {
    window.postMessage({
      type: "app:input-dir-clicked",
    });
  };

  return (
    <Container>
      <DashedBox
        id="drop"
        onClick={() => openInputDirClicked()}
        dragenter={dragenter}
      >
        <UploadOutlined
          style={{
            color: "rgba(255, 255, 255, 0.45)",
            fontSize: "48px",
            pointerEvents: "none",
          }}
        />
        <Title>Click or drag files or folder to this area to upload</Title>
        <Description>Support .png .jpg</Description>
      </DashedBox>
    </Container>
  );
};
