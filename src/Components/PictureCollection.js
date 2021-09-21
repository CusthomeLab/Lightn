import {observer} from "mobx-react-lite"
import PictureItem from "./PictureItem";
import {HumanFileSize} from "../HumanFileSize"

export default observer(({store}) => {
    return (
        <div>
            <div>
                {store.getPictures().length > 0 && (
                    <div>
                        Original size: {HumanFileSize.format(store.getTotalSize())}<br/>
                        Compressed size: {HumanFileSize.format(store.getNewTotalSize())}
                    </div>
                )
                }
            </div>
            {
                store.getPictures().map((picture, i) => {
                    return (<PictureItem key={picture.path} path={picture.path} store={store}/>)
                })
            }
        </div>
    )
})