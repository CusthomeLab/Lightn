import {observer} from "mobx-react-lite"

export default observer(({store}) => {

        function openInputDirClicked() {
            window.postMessage({
                type: 'app:input-dir-clicked',
            })
        }

        function openExportDirClicked() {
            window.postMessage({
                type: 'app:export-dir-clicked',
                config: store.toJson()
            })
        }

        return (
            <div>
                <div><input type="button" value="Input" id="input-dir" onClick={() => openInputDirClicked()}/>
                    {store.getPictures().length > 0 ?
                        <input type="button" value="Export" id="export" onClick={() => openExportDirClicked()}/> : ''}
                </div>
                {store.getCurrentProcess() && store.getCurrentProcess().done !== store.getCurrentProcess().total && (
                    <div>{store.getCurrentProcess().action} {store.getCurrentProcess().file} ({store.getCurrentProcess().done} / {store.getCurrentProcess().total}})</div>
                )}
            </div>
        )
    }
)
