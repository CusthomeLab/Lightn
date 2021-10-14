import React from "react";
import { observer } from "mobx-react-lite";
import { Layout, Button } from "antd";
import { DownloadOutlined, RightCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import Lightn from "./Lightn";
import { HumanFileSize } from "../HumanFileSize";
const { Header } = Layout;

const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 48px;
  height: 32px;
`;

const Version = styled.div`
  font-family: Roboto;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 24px;
  letter-spacing: normal;
  text-align: right;
  color: rgba(255, 255, 255, 0.25);
`;

const Infos = styled.div`
  font-family: Roboto;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
`;

const ExportButton = styled(Button)`
  margin-right: 48px;
  padding: 5px 16px;
  background-color: #2ec973;
  border: none;
  border-radius: 2px;
  color: #fff;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  .anticon {
    margin-right: 5px;
  }

  &:hover {
    color: #2ec973;
  }

  &:disabled {
    cursor: default;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export default observer(({ store }) => {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (
      (store.getCurrentProcess() &&
        store.getCurrentProcess().done !== store.getCurrentProcess().total) ||
      store.isImporting ||
      store.onePictureLoading()
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.getCurrentProcess(), store.isImporting, store.onePictureLoading()]);

  const openExportDirClicked = () => {
    window.postMessage({
      type: "app:export-dir-clicked",
      config: store.toJson(),
    });
  };

  return (
    <Header
      style={{
        position: "fixed",
        height: "min-content",
        top: "0px",
        zIndex: 10,
        width: "100%",
        padding: "20px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#333333",
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(51, 51, 51, 0.5)",
      }}
    >
      <Logo>
        <Lightn />
        <Version>0.1.0</Version>
      </Logo>
      {store.getTotalSize() ? (
        <Infos>
          <span>
            <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>Total</span>{" "}
            {HumanFileSize.format(store.getTotalSize())}
          </span>
          <RightCircleOutlined
            style={{
              fontSize: "14px",
              margin: "0 9px",
              color: "rgba(255, 255, 255, 0.2)",
            }}
          />
          <span style={{ color: "#2ec973" }}>
            {HumanFileSize.format(store.getNewTotalSize())}
          </span>
        </Infos>
      ) : null}
      {store.getPictures().length > 0 && (
        <ExportButton
          onClick={() => openExportDirClicked()}
          icon={<DownloadOutlined />}
          loading={loading}
          disabled={loading}
        >
          Export
        </ExportButton>
      )}
    </Header>
  );
});
