import { observer } from "mobx-react-lite";
import PictureItem from "./PictureItem";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
`;

export default observer(({ store }) => {
  return (
    <Container>
      {store.getPictures().map((picture, i) => {
        return (
          <PictureItem key={picture.path} path={picture.path} store={store} />
        );
      })}
    </Container>
  );
});
