import React from "react";
import UserActions from "./Components/UserActions";
import PictureCollection from "./Components/PictureCollection";
import store from "./Domain/PictureStore";
import { observer } from "mobx-react-lite";
import { message } from "antd";
import Header from "./Components/Header";

export default observer(() => {
  React.useEffect(() => {
    if (
      store.getCurrentProcess() &&
      store.getCurrentProcess().done !== store.getCurrentProcess().total
    ) {
      const contentMessage =
        store.getCurrentProcess().action +
        store.getCurrentProcess().file +
        "(" +
        store.getCurrentProcess().done +
        "/" +
        store.getCurrentProcess().total +
        ")";
      message.loading({ content: contentMessage, key: "updatable" });
    } else if (
      store.getCurrentProcess() &&
      store.getCurrentProcess().done === store.getCurrentProcess().total
    ) {
      message.success({
        content: "Exported with success!",
        key: "updatable",
        duration: 2,
      });
      store.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.getCurrentProcess()]);

  return (
    <React.Fragment>
      <Header store={store} />
      {store.getPictures().length === 0 && <UserActions />}
      <PictureCollection store={store} />
    </React.Fragment>
  );
});
