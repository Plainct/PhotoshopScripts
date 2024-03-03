var dlg = "dialog{text:'添加相同图片',\
                panel0:Panel{text:'选择文件夹',orientation: 'column',alignChildren:'left',\
                    g01:Group{orientation: 'row',text:'g01',\
                        boxShowPSDpath: EditText { characters: 30 },\
                        btnSelectPSDpath:Button{text:'选择psd文件'}}\
                    g02:Group{orientation: 'row',\
                        boxShowPNGpath: EditText {characters: 30 },\
                        btnSelectPNGpath:Button{text:'选择png文件'}}},"+    //panel0封闭
    "panel1:Panel{text:'参数配置',orientation: 'column',alignChildren:'left',\
                    g11:Group{orientation: 'column',\
                        imgsuffixDrop:DropDownList{title:'导入图片的后缀'},\
                        \
                        g113:Group{orientation:'row',\
                            importedlayerPositon:DropDownList{title:'导入图层的位置'}}\
                        g111:Group{orientation: 'row',\
                            coverOrNotBox:Checkbox{text:'是否创建蒙版:(图层名称)'},\
                            coverLayerName:EditText{characters: 10 }\
                        },\
                        g112:Group{orientation: 'row',alignChildren:'left',\
                        importedLayerRenameBox:Checkbox{text:'(自定义)重命名的名字'},\
                        importedLayerRenameText:EditText{characters: 10 }\
                        },\
                        LockAllImgLayerOrnot:Checkbox{text:'锁定所有图片图层的位置移动'}\
                        \
                    }}"+
    "gbtn: Group { orientation: 'row', \
                    okBtn: Button { text:'OK', properties:{name:'ok'} }, \
                    cancelBtn: Button { text:'Cancel', properties:{name:'cancel'} }\
                }}"


var win = new Window(dlg, '图层组操作');
win.panel0.g01.boxShowPSDpath.enabled = false
win.panel0.g02.boxShowPNGpath.enabled = false
win.panel1.g11.imgsuffixDrop.add('item', 'jpg')
win.panel1.g11.imgsuffixDrop.add('item', 'png')
win.panel1.g11.imgsuffixDrop.selection = 0
win.panel1.g11.g111.coverLayerName.enabled = false
win.panel1.g11.g111.coverOrNotBox.onClick = function () {
    switch (win.panel1.g11.g111.coverOrNotBox.value) {
        case true:
            win.panel1.g11.g111.coverLayerName.enabled = true;
            break;
        case false:
            win.panel1.g11.g111.coverLayerName.enabled = false;
            break;
        default:
            win.panel1.g11.g111.coverLayerName.enabled = false;
            break;
    }
}
win.panel1.g11.g112.importedLayerRenameText.enabled = false;
win.panel1.g11.g112.importedLayerRenameText.text = 'textless'//默认值
win.panel1.g11.g112.importedLayerRenameBox.onClick = function () {
    switch (win.panel1.g11.g112.importedLayerRenameBox.value) {
        case true:
            win.panel1.g11.g112.importedLayerRenameText.enabled = true;
            break;
        case false:
            win.panel1.g11.g112.importedLayerRenameText.enabled = false;
            break;
        default:
            win.panel1.g11.g112.importedLayerRenameText.enabled = false;
            break;
    }
}
win.panel1.g11.g113.importedlayerPositon.add('item', '置于底层的上一层')
win.panel1.g11.g113.importedlayerPositon.add('item', '置于底层')
win.panel1.g11.g113.importedlayerPositon.selection = 0

win.panel1.g11.LockAllImgLayerOrnot.value=true;


var psdList = []
win.panel0.g01.btnSelectPSDpath.onClick = function () {
    // alert('clicked')
    var psdFileFolder = Folder.selectDialog("选择要导入的图像文件");
    if (psdFileFolder) {//&& pngFileFolder.exists
        psdList = psdFileFolder.getFiles("*.psd");
        win.panel0.g01.boxShowPSDpath.text = psdFileFolder.fsName
    }
}
var pngList = []
win.panel0.g02.btnSelectPNGpath.onClick = function () {
    // alert('clicked')
    var pngFileFolder = Folder.selectDialog("选择要导入的图像文件");
    if (pngFileFolder && pngFileFolder.exists) {
        var fullpass = "*." + win.panel1.g11.imgsuffixDrop.selection.text
        pngList = pngFileFolder.getFiles(fullpass); // +功能 添加个下拉框选择后缀
        if (pngList.length<1){
            pngList = pngFileFolder.getFiles("*.png");
             // +功能 添加个下拉框选择后缀
        }if(pngList.length<1){
            pngList = pngFileFolder.getFiles("*." + win.panel1.g11.imgsuffixDrop.selection.text.toUpperCase());
        }
        win.panel0.g02.boxShowPNGpath.text = pngFileFolder.fsName
    }
}
win.gbtn.okBtn.onClick = function () {
    try {
        importImg(psdList, pngList);
    } catch (e) {
        alert(e);
    }
}
var bl = win.show();
// 核心函数//OK后执行
function importImg(psdList, pngList) {
    if (pngList.length<0){alert('没找到图片');return;}
    for (var i = 0; i < psdList.length; i++) {
        // 获取文件名（不带扩展名）
        var psdName = psdList[i].name.split(".")[0];

        // 在目录1中查找具有相同前缀的文件
        for (var j = 0; j < pngList.length; j++) {
            // 获取文件名（不带扩展名）
            var pngName = pngList[j].name.split(".")[0];

            // 检查文件名是否匹配
            if (pngName === psdName) {
                //打开图片文件
                var psdDoc = open(psdList[i]);
                var pngDoc = open(pngList[j]);
                app.activeDocument = pngDoc;
                layerToCopy = pngDoc.layers[0];
                layerToCopy.copy();

                app.activeDocument = psdDoc;
                psdDoc.paste();
                app.activeDocument.activeLayer.name = win.panel1.g11.g112.importedLayerRenameText.text; //重命名
                moveLayerTo(win.panel1.g11.g113.importedlayerPositon.selection.text)
                //置于底层
                if (win.panel1.g11.g111.coverOrNotBox.value === true) {//勾上了图层蒙版选项
                    selectLayerByname(win.panel1.g11.g111.coverLayerName.text)
                    addMask("revealAll");
                }
                if(win.panel1.g11.LockAllImgLayerOrnot.value){

                    lockImgLayer()
                }
                psdDoc.save()
                pngDoc.close()
            }
        }
    }
}
//选择第一个符合名字的图层
function selectLayerByname(layerName){
    // 获取当前文档
    var doc = app.activeDocument;

    // 遍历文档中的所有图层
    for (var i = 0; i < doc.layers.length; i++) {
        var layer = doc.layers[i];
        // 检查图层名称是否与给定名称匹配
        if (layer.name == layerName) {
            // 选中图层
            doc.activeLayer = layer;
            break;
        }
}
}
//默认锁定图片图层的移动
function lockImgLayer() {
    var doc = app.activeDocument;
    // 遍历文档中的所有图层
    for (var i = 0; i < doc.layers.length; i++) {
        var layer = doc.layers[i];
        // 检查图层是否为图片类型
        if (layer.kind == LayerKind.NORMAL) {
            // 锁定图层的位置
            layer.positionLocked = true;
        }
    }
}
//选择要操作的图层





function addMask(maskVisibility) {
    // maskVisibility = "revealAll" or "hideAll"
    if (!app.activeDocument.activeLayer.isBackgroundLayer) {
        var c2t = function (s) {
            return app.charIDToTypeID(s);
        };
        var s2t = function (s) {
            return app.stringIDToTypeID(s);
        };
        var descriptor = new ActionDescriptor();
        var reference = new ActionReference();
        descriptor.putClass(s2t("new"), s2t("channel"));
        reference.putEnumerated(s2t("channel"), s2t("channel"), s2t("mask"));
        descriptor.putReference(s2t("at"), reference);
        descriptor.putEnumerated(s2t("using"), c2t("UsrM"), s2t(maskVisibility));
        executeAction(s2t("make"), descriptor, DialogModes.NO);
    }
    else {
       alert("The active layer is a Background layer!");
    }
}


//移动图层到:最底层的上一层
function moveLayerTo(location) {
    doc = app.activeDocument;
    var selectedLayer = doc.activeLayer;
    var numOfLayers = doc.layers.length;
    var bottomLayer = doc.layers[numOfLayers - 1];
    switch (location) {
        case '置于底层的上一层':
            selectedLayer.move(bottomLayer, ElementPlacement.PLACEBEFORE);
            break;
        case '置于底层':
            selectedLayer.move(doc.layers[numOfLayers - 1], ElementPlacement.PLACEAFTER);
            break;
        default:
            selectedLayer.move(bottomLayer, ElementPlacement.PLACEBEFORE);
            break;
    }
}

