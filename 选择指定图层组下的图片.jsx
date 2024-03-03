// 选择图层的部件函数
function getLayerID(layer) {
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var desc = executeActionGet(ref);
    return desc.getInteger(stringIDToTypeID('layerID'));
}

// Select the group named "myGroup"

// Create an array to store the layer IDs

// 选择图层的部件函数
// Loop through all layers in the group
function getGroupLayerIdbyGroup(myGroup) {
    var layerIDs = [];
    for (var i = 0; i < myGroup.layers.length; i++) {
        var layer = myGroup.layers[i];
        // Select the layer
        app.activeDocument.activeLayer = layer;
        // Get the ID of the layer
        var LAYERid = getLayerID(layer);
        // Add the layer ID to the array
        layerIDs.push(LAYERid);
    }
    return layerIDs
}

// The layerIDs array now contains the IDs of all layers in the group
// 选择图层的部件函数 （未使用）
// var id = 'test'
function doesIdExists(id) {// function to check if the id exists
    var res = true;
    var ref = new ActionReference();
    ref.putIdentifier(charIDToTypeID('Lyr '), id);
    try { var desc = executeActionGet(ref) } catch (err) { res = false };
    return res;
}

// 选择图层 核心 - 动作
function multiSelectByIDs(ids) {
    if (ids.constructor != Array) ids = [ids];
    var layers = new Array();
    var id54 = charIDToTypeID("slct");
    var desc12 = new ActionDescriptor();
    var id55 = charIDToTypeID("null");
    var ref9 = new ActionReference();
    //  核心-动作 ： 选择多个图层
    for (var i = 0; i < ids.length; i++) {
        if (doesIdExists(ids[i]) == true) {// a check to see if the id stil exists
            layers[i] = charIDToTypeID("Lyr ");
            ref9.putIdentifier(layers[i], ids[i]);
        }
    }
    // 将图层的引用（整数）附加到 desc12 这个参数里面
    desc12.putReference(id55, ref9);
    var id58 = charIDToTypeID("MkVs");
    desc12.putBoolean(id58, false);
    // 核心 -
    executeAction(id54, desc12, DialogModes.NO);
}

// multiSelectByIDs(layerIDs);

//===========================================================-----------代码段K
//Written by Paul Riggott
allActions = [];
letterActions = [];
selection = 99;
var dlg =
    "dialog{text:'Script Interface',bounds:{x:10,y:10,width:520,height:400}," +

    "panel0:Panel{     bounds:{x:10,y:10,width:500,height:380} , text:'' ,properties:{borderStyle:'etched',su1PanelCoordinates:true}," +
    "titlex:StaticText{bounds:{x:180,y:3,width:390,height:40} , text:'图层组操作' ,properties:{scrolling:undefined,multiline:undefined}}," +
    "panel00x:Panel {bounds:{x:10,y:42,width:480,height:65} , text: '选择 测试',properties:{borderStyle:'etched',su1PanelCoordinates:true}, \
            groupprompttext: StaticText {bounds:{x:10,y:10,width:100,height:30}, text:'图层组：' }, \
            groupNameInput: DropDownList{bounds:{x:110,y:10,width:88,height:30}},\
            selectOnlyBtn: Button{bounds:{x:260,y:10,width:88,height:30},text:'仅选择' }         \
        }," +

    "panel1:Panel{            bounds:{x:10,y:125,width:500,height:188} , text:'' ,properties:{borderStyle:'etched',su1PanelCoordinates:true}," +
    "ActionSet:DropDownList{bounds:{x:10,y:20,width:100,height:30}}," +
    "ActionName:DropDownList{bounds:{x:120,y:20,width:100,height:30}}," +


    "panel1row:Panel{\
                    bounds:{x:10,y:50,width:400,height:110},text:'批处理选项',properties:{orientation :'row',borderStyle:'etched',su1PanelCoordinates:true},\
                    radioCurrent:RadioButton{bounds:{x:10,y:50,width:100,height:20},text:'仅当前页面'}   , \
                    radioOpened:RadioButton{bounds:{x:120,y:50,width:120,height:20},text:'所有打开的页面'}   ,\
                    operationType: DropDownList{bounds:{x:35,y:10,width:220,height:30},title: '操作类型'},"+
    "startRuning:Button{bounds:{x:296,y:30,width:80,height:30} , text:'开始执行' }     }     }, " +
    "closebtn:Button{bounds:{x:400,y:340,width:80,height:30} , text:'取消', properties:{name:'cancel'}}  }     } };"

// "panel2:Panel{        bounds:{x:10,y:300,width:870,height:220} , text:'' ,properties:{borderStyle:'etched',su1PanelCoordinates:true}," +
//     "ActionSet:DropDownList{bounds:{x:10,y:20,width:220,height:20}}," +
//     "ActionName:DropDownList{bounds:{x:240,y:20,width:440,height:20}}," +
//     "useact2:Button{bounds:{x:450,y:20,width:550,height:20} , text:'Use Action' }," +
//     "statictext1:StaticText{bounds:{x:10,y:80,width:210,height:20} , text:'Find actions starting with :-' ,properties:{scrolling:undefined,multiline:undefined}}," +
//     "prefix:EditText{bounds:{x:240,y:80,width:440,height:20} , text:'a' ,properties:{multiline:false,noecho:false,readonly:false}}," +
//     "findpre:Button{bounds:{x:450,y:80,width:550,height:20} , text:'Find' }," +
//     "statictext2:StaticText{bounds:{x:10,y:120,width:220,height:20} , text:'Find actions containing :-' ,properties:{scrolling:undefined,multiline:undefined}}," +
//     "containing:EditText{bounds:{x:240,y:120,width:440,height:20} , text:'' ,properties:{multiline:false,noecho:false,readonly:false}}," +
//     "findcon:Button{bounds:{x:450,y:120,width:550,height:20} , text:'Find' }}}"\

var win = new Window(dlg, '图层组操作');
///批处理 选项框
//  默认的选项是：仅处理当下文档
win.panel0.panel1.panel1row.radioCurrent.value = true;
win.panel0.panel1.panel1row.operationType.add('item', '选中和执行动作')
win.panel0.panel1.panel1row.operationType.add('item', '仅选中')
win.panel0.panel1.panel1row.operationType.selection = 0;
// win.panel0.panel1.panel1row.preferredSize.width = 100;



////// !!! 接口处 --d2 !!!
// var grounameStatictext = win.add("statictext", undefined, "Group Name:");
// grounameStatictext.bounds = {x: 50, y: 10, width: 20, height: 50};
if (documents.length === 0) {
    // 如果没有打开的文档，则显示警告信息并终止运行
    alert("没有打开的文档，请打开后重新运行");
} else {
    // 如果有打开的文档，则继续执行脚本
    // 在这里执行你想要的操作
}
var groupNameset = new Array();
groupNameset = getLayerSetNames()
function getLayerSetNames() {
    var layerSetNames = [];
    var layerSets = app.activeDocument.layerSets;
    for (var i = 0; i < layerSets.length; i++) {
        layerSetNames.push(layerSets[i].name);
    }
    return layerSetNames;
}

// 批处理所有打开的文档 BING
function batchProcessOpenDocuments(runingFuction) {
    for (var i = 0; i < app.documents.length; i++) {
        app.activeDocument = app.documents[i];
        // 在这里添加你的处理代码
        try{runingFuction()}
        catch(e){
            continue
        }
        
    }
}
// 批处理特定文件夹中的文件 BING
function batchProcessFolder(passbatch) {
    var folder = new Folder(passbatch.folderPath);
    var files = folder.getFiles();
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file instanceof File && file.name.match(/\.(psd|tif|jpg|png)$/i)) {
            var doc = app.open(file);
            // 在这里添加你的处理代码
            passbatch.runingFuction()
            doc.close(SaveOptions.SAVECHANGES);
        }
    }
}
// function getlayersets(){
//     for (var i = 0; i < app.activeDocument.layerSets.length; i++) {
//         groupNameset.push(app.activeDocument.layerSets[i].name);
//     }
// }
// 核心 -- 动作（谓语/述部） 填充下拉菜单
for (var i = 0, len = groupNameset.length; i < len; i++) {
    win.panel0.panel00x.groupNameInput.add('item', "" + groupNameset[i]);
}
win.panel0.panel00x.groupNameInput.selection = 0;
// var groupNameInput = win.add("dropdownlist", undefined, groupNames);
// groupNameInput.bounds = {x: 10, y: 10, width: 31, height: 50};
// groupNameInput.selection = 0;
// var myGroup = app.activeDocument.layerSets.getByName(groupNameInput.selection.text);
// getGroupLayerIdbyGroup(myGroup)
////// !!! 接口处 --d2 !!!
win.center();
if (version.substr(0, version.indexOf('.')) > 9) {
    win.panel0.titlex.graphics.font = ScriptUI.newFont("思源黑体", 22);
    g = win.graphics;
    var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [1.00, 1.00, 1.00, 1]);
    g.backgroundColor = myBrush;
    var myPen = g.newPen(g.PenType.SOLID_COLOR, [1.00, 0.00, 0.00, 1], lineWidth = 1);
}

// 核心 -- 动作（谓语/述部） 填充下拉菜单
var actionSets = new Array();
actionSets = getActionSets();
for (var i = 0, len = actionSets.length; i < len; i++) {
    // item = win.panel0.panel1.ActionSet.add('item', "" + actionSets[i]);
    item = win.panel0.panel1.ActionSet.add('item', "" + actionSets[i]);
};
win.panel0.panel1.ActionSet.selection = win.panel0.panel1.ActionSet.items.length - 1;

// 核心 -- 动作（谓语/述部） 填充下拉菜单
var actions = new Array();
actions = getActions(actionSets[0]);
for (var i = 0, len = actions.length; i < len; i++) {
    item = win.panel0.panel1.ActionName.add('item', "" + actions[i]);
};
// win.panel0.panel1.ActionName.selection = 0;


// 默认
win.panel0.panel1.ActionName.removeAll();
actions = getActions(actionSets[parseInt(win.panel0.panel1.ActionSet.selection)]);
for (var i = 0, len = actions.length; i < len; i++) {
    item = win.panel0.panel1.ActionName.add('item', "" + actions[i]);
}


win.panel0.panel1.ActionSet.onChange = function () {
    win.panel0.panel1.ActionName.removeAll();
    actions = getActions(actionSets[parseInt(this.selection)]);
    for (var i = 0, len = actions.length; i < len; i++) {
        item = win.panel0.panel1.ActionName.add('item', "" + actions[i]);
    }
    // win.panel0.panel1.ActionName.selection = -1;
};
var aSets = getActionSets();
for (var a in aSets) {
    var temp1 = getActions(aSets[a]);
    for (var z in temp1) {
        allActions.push([
            [temp1[z].toString()],
            [aSets[a].toString()]
        ]);
    }

}

allActions = allActions.sort();
for (var d in allActions) {
    if (allActions[d][0].toString().match(/^a/i)) letterActions.push(allActions[d]);
}
// for (var i = 0, len = letterActions.length; i < len; i++) {
//     win.panel0.panel2.ActionName.add('item', "" + letterActions[i][0]);
//     win.panel0.panel2.ActionSet.add('item', "" + letterActions[i][1]);
// }
// win.panel0.panel2.ActionName.selection = 0;
// win.panel0.panel2.ActionSet.selection = 0;
// win.panel0.panel2.ActionName.onChange = function () {
//     try {
//         win.panel0.panel2.ActionSet.selection = parseInt(win.panel0.panel2.ActionName.selection.index);
//     } catch (e) { }
// }
// win.panel0.panel2.ActionSet.onChange = function () {
//     try {
//         win.panel0.panel2.ActionName.selection = parseInt(win.panel0.panel2.ActionSet.selection.index);
//     } catch (e) { }
// }
// doaction 封装
function doactionwithTry(p1,p2){
    try{
        doAction(p1,p2)
    }catch (e){
        // alert(e)
    }
}
// ONclick 绑定：

win.panel0.panel00x.selectOnlyBtn.onClick = function () {
    selectAllGroup()
    // doaction 动作 是使用 动作的string 名称来作为输入参数
    // doAction(win.panel0.panel1.ActionName.selection.text, win.panel0.panel1.ActionSet.selection.text);
    // selection = 0;
    // win.close(1);
}

function selectAllGroup() {
    var myGroup = app.activeDocument.layerSets.getByName(win.panel0.panel00x.groupNameInput.selection.text);
    var layeridNow = new Array();
    layeridNow = getGroupLayerIdbyGroup(myGroup);
    multiSelectByIDs(layeridNow);
}

win.panel0.panel1.panel1row.startRuning.onClick = function () {
    app.displayDialogs = DialogModes.NO;

    try {clickToRunFunction()}
    catch (e){
        // alert(e)
    }
}

function clickToRunFunction(){
    if (win.panel0.panel1.ActionName.selection.text == '') {
        alert("No Action is Selected!");
        return;
    }
    if (win.panel0.panel1.panel1row.radioCurrent.value) { // 仅执行当前的文档
        selectAllGroup()
        
        doactionwithTry(win.panel0.panel1.ActionName.selection.text, win.panel0.panel1.ActionSet.selection.text);
           
    } else if (win.panel0.panel1.panel1row.radioOpened.value) {    //执行所以打开的文档
        switch (win.panel0.panel1.panel1row.operationType.selection.text) {
            case '仅选中':
                batchProcessOpenDocuments(function () {
                    selectAllGroup();
                })
                break;
            case '选中和执行动作':
                batchProcessOpenDocuments(function () {
                try{
                    selectAllGroup();
                }catch (e){
                    throw e;
                }
                    doactionwithTry(win.panel0.panel1.ActionName.selection.text, win.panel0.panel1.ActionSet.selection.text);
                })
                break;
        }
        app.displayDialogs = DialogModes.YES;
        win.close(1);
    }
}

var done = false;
var x = win.show();

function getActionSets() {
    var i = 1;
    var sets = [];
    while (true) {
        var ref = new ActionReference();
        ref.putIndex(charIDToTypeID("ASet"), i);
        var desc;
        var lvl = $.level;
        $.level = 0;
        try {
            desc = executeActionGet(ref);
        } catch (e) {
            break;
        } finally {
            $.level = lvl;
        }
        if (desc.hasKey(charIDToTypeID("Nm  "))) {
            var set = {};
            set.index = i;
            set.name = desc.getString(charIDToTypeID("Nm  "));
            set.toString = function () {
                return this.name;
            };
            set.count = desc.getInteger(charIDToTypeID("NmbC"));
            set.actions = [];
            for (var j = 1; j <= set.count; j++) {
                var ref = new ActionReference();
                ref.putIndex(charIDToTypeID('Actn'), j);
                ref.putIndex(charIDToTypeID('ASet'), set.index);
                var adesc = executeActionGet(ref);
                var actName = adesc.getString(charIDToTypeID('Nm  '));
                set.actions.push(actName);
            }
            sets.push(set);
        }
        i++;
    }

    return sets;
};

function getActions(aset) {
    var i = 1;
    var names = [];
    if (!aset) {
        throw "Action set must be specified";
    }
    while (true) {
        var ref = new ActionReference();
        ref.putIndex(charIDToTypeID("ASet"), i);
        var desc;
        try {
            desc = executeActionGet(ref);
        } catch (e) {
            break;
        }
        if (desc.hasKey(charIDToTypeID("Nm  "))) {
            var name = desc.getString(charIDToTypeID("Nm  "));
            if (name == aset) {
                var count = desc.getInteger(charIDToTypeID("NmbC"));
                var names = [];
                for (var j = 1; j <= count; j++) {
                    var ref = new ActionReference();
                    ref.putIndex(charIDToTypeID('Actn'), j);
                    ref.putIndex(charIDToTypeID('ASet'), i);
                    var adesc = executeActionGet(ref);
                    var actName = adesc.getString(charIDToTypeID('Nm  '));
                    names.push(actName);
                }
                break;
            }
        }
        i++;
    }
    return names;
};