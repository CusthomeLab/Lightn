import './App.css';
import UserActions from "./Components/UserActions";
import PictureCollection from "./Components/PictureCollection";
import store from "./Domain/PictureStore";
import {observer} from "mobx-react-lite"

export default observer(() => {
    return (
        <div className="App">
            <UserActions store={store}/>
            <PictureCollection store={store}/>
        </div>
    );
})