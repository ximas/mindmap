'use-strict';

$(document).ready (() => {
    $('#create-node').click(() => {
        newNodeDialog('create-node-dialog', false);
        populateNodeDialog(false);
    });

    $('#create-child').click(() => {
        newNodeDialog('create-node-dialog', true);
        populateNodeDialog(true);
    });

    $('#node-details').click(() => {
        detailDialog();
        populateDetailDialog();
    });
    $('#remove-node').click(() => {
        let centre = getCentreNode();
        let newCentre = db.getWhere('Node', 'name', centre.parent)[0];
        if (centre && centre.parent != 'rootNode') {
            $('.node').parent().remove();
            removeNode(centre.id);
            updateDisplay(newCentre);
        } else {
            alert('Cannot remove root node');
        }
    });

    $('body').click(e => {generalClick(e)});
    $('.editable').focusout(e => {editField(e)});

    $('#newNodeParent').html('<option>rootNode</option>');
    $('#create-node').click();

    (new Menu('main-menu')).init();
});

function newNodeDialog(dialogId, isChild) {
    $('#' + dialogId).dialog({
        title: $('#' + dialogId).attr('name'),
        width: 650,
        height: 400,
        resizable: true,
        dialogClass: "no-close",
        buttons: [{
            text: "OK",
            // has to be full name function for some reason
            click: ()=>{newNodeOk(dialogId, isChild)}
        }]
    });
}

function detailDialog() {
    $('#node-detail-dialog').dialog({
        title: 'node details',
        width: 650,
        height: 400,
        resizable: true,
        dialogClass: "no-close"
    });
}

function generalClick(e) {
    jq = $(e.target);
    if (jq.closest('.node').length > 0) {
        let container = jq.closest('.node').parent();
        let node = db.getWhere('Node', 'name', jq.html())[0];
        if (!container.hasClass('centre-node')) updateDisplay(node);
        showCentreNodeControl();
    } else if (jq.attr('id') == 'map-area') {
        hideCentreNodeControl();
    }
}

function editField(e) {
    let centre = getCentreNode();
    let jq = $(e.target);
    let field = jq.attr('name');
    if ( jq.val() != centre[field]) {
        centre[field] = jq.val();
        if (validateNode(centre)) db.updateValue('Node', centre);
        // display a timeout tooltip
    }
}

function newNodeOk(dialogId, isChild) {
    let node = createNode();
    if (validateNode(node)) {
        db.createValue('Node', node);
        updateDisplay(node, isChild);
        $('#' + dialogId).dialog('close');
        clearPopup(dialogId);
    }
}

function getCentreNode() {
    let centre = $('.centre-node .node div');
    if (centre.length > 0) {
        return db.getWhere('Node', 'name', centre.html())[0];
    }
    return null;
}

function updateDisplay(node, isChild) {
    $('.node').parent().remove();
    let centre = isChild? db.getWhere('Node', 'name', node.parent)[0] : node;
    displayNode(centre, 'centre-node');

    let parent = db.getWhere('Node', 'name', centre.parent);
    if (parent.length > 0) displayNode(parent[0], 'parent-node');

    let children = db.getWhere('Node', 'parent', centre.name);
    if (children.length > 0) {
        for (let i=0; i<children.length; i++) {
            displayNode(children[i], 'child' + (i + 1));
        }
    }
}

function createNode() {
    let node = db.makeValue('Node');
    node.name = $('#newNodeName').val();
    node.type = $('#newNodeType').val();
    node.parent = $('#newNodeParent').val();
    return node;
}

function validateNode(node) {
    if (node.name == '') {
        alert('Name cannot be blank');
        return false;
    }
    if (db.getWhere('Node', 'name', node.name).length > 0) {
        alert('Node already exists with this name');
        return false;
    }
    return true;
}

function displayNode(node, className) {
    let nodeInner = `<div>${node.name}</div>`;
    let nodeElem = `<div id=${node.id} class=node >${nodeInner}</div>`
    let container = `<div id=container${node.name} class=${className} >${nodeElem}</div>`
    $('#map-area').append(container);
}

function populateNodeDialog(isChild) {
    let parentSel = $('#newNodeParent');
    if (isChild)  {
        parentSel.html(`<option>${getCentreNode().name}</option>`)
    } else {
        db.getAll('Node').forEach(node => {
            let option = `<option>${node.name}</option>`
            parentSel.append(option);
        });
    }

    let typeSel = $('#newNodeType');
    db.getAll('Surface').forEach(surface => {
        let option = `<option>${surface.desc}</option>`
        typeSel.append(option);
    });
}

function populateDetailDialog() {
    let node = getCentreNode();
    $('#detailParent').val(node.parent);
    $('#detailType').val(node.type);
    $('#detailName').val(node.name);
}

function clearPopup(id) {
    for (elem of $('#' + id).find('input, select')) {
        elem.innerHTML = '';
        elem.value = '';
    }
}

function showCentreNodeControl() {
    $('.centre-node > div').addClass('selected');
    $('.centre-control').show();
}

function hideCentreNodeControl() {
    $('.centre-node > div').removeClass('selected');
    $('.centre-control').hide();
}

function removeNode(id) {
    let centre = db.getWhere('Node', 'id', id)[0];
    let children = db.getWhere('Node', 'parent', centre.name);
    if (children.length > 0) {
        children.forEach(child => {
            removeNode(child.id);
        });
    }
    db.removeOne('Node', centre);
}

// make divs onclick?

// make menu list
// second has pinned dialog
// - move dialogues in separate html file
// - move server functions into new file?
// third search?

// add animation to selecting/creating nodes
// add pinned functionality
// add search functionality

// fix that random bug with node parent repop
// u r creating ids before validation
