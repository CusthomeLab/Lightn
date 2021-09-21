import {observer} from "mobx-react-lite"
import {HumanFileSize} from "../HumanFileSize"

export default observer(({store, path}) => {
    let picture = store.getPicture(path)
    let ratio = picture.width / picture.height
    let newWidth = picture.newWidth
    let newHeight = picture.newHeight

    function onChangeWidth(newWidth) {
        newHeight = Math.floor(newWidth / ratio)
        store.updatePictureSetting(picture.path, newWidth, newHeight, picture.quality, picture.ignore)
    }

    function onChangeHeight(newHeight) {
        newWidth = Math.floor(newHeight * ratio)
        store.updatePictureSetting(picture.path, newWidth, newHeight, picture.quality, picture.ignore)
    }

    function onChangeQuality(newQuality) {
        store.updatePictureSetting(picture.path, picture.newWidth, picture.newHeight, newQuality, picture.ignore)
    }

    function onChangeIgnore(newIgnore) {
        store.updatePictureSetting(picture.path, picture.newWidth, picture.newHeight, picture.quality, newIgnore)
    }

    return (
        <div>
            <hr/>
            <h2>{picture.relative}</h2>
            <div>
                <br/>
                width : <input type="text" onChange={e => onChangeWidth(parseInt(e.target.value))}
                               value={picture.newWidth}/> x
                height <input type="text" onChange={e => onChangeHeight(parseInt(e.target.value))}
                              value={picture.newHeight}/>
                quality <input type="text" onChange={e => onChangeQuality(parseInt(e.target.value))}
                               value={picture.quality}/>
                <input type={"checkbox"} checked={picture.ignore}
                       onChange={e => onChangeIgnore(e.target.checked)}/> No compression
            </div>
            <div>
                <h3>Current</h3>
                <img src={"data:image/jpeg;base64," + picture.base64} width="320" height="200" alt={picture.name}/><br/>
                {picture.width}x{picture.height} / {HumanFileSize.format(picture.size)}
            </div>
            <div>
                <h3>Optimized</h3>
                <img src={"data:image/jpeg;base64," + picture.newBase64} width="320" height="200" alt={picture.name}/><br/>
                {picture.newWidth}x{picture.newHeight} / {HumanFileSize.format(picture.newSize)}
            </div>
        </div>
    )
})
