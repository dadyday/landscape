import go from 'gojs'
import {merge} from "smob";
import {groupTemplate, linkTemplate, nodeTemplate} from "./templates";

// helper

// dragging
let lastGroup: Partial<any> | null = null

function enterDrag(e: Event, group: Partial<any>) {
  // console.log('enter', group?.key)
  if (lastGroup) lastGroup.isHighlighted = false
  if (group) {
    group.isHighlighted = true
    lastGroup = group
  }
}

function leaveDrag(e: Event, group: Partial<any>) {
  // console.log('leave', grp?.key)
}

function stopDrag(e: Event, group: Partial<any>) {
  // console.log('stop', grp?.key)
  if (lastGroup) lastGroup.isHighlighted = false
  lastGroup = null
  if (group) {
    group.addMembers(group.diagram.selection, true)
  }
}


export default (options: go.DiagramInitOptions = {}): go.Diagram => {

  // groupTemplate.mouseDragEnter = enterDrag // (e, grp, prev) => highlightGroup(e, grp, true),
  // groupTemplate.mouseDragLeave = leaveDrag // (e, grp, next) => highlightGroup(e, grp, false),
  // groupTemplate.mouseDrop = stopDrag // (e, nod) => finishDrop(e, nod),

  const diagram =  new go.Diagram({
    // 'undoManager.isEnabled':                true,
    // 'clickCreatingTool.archetypeNodeData':  { title: 'Neue Node', text: '', type: '' },
    // 'commandHandler.memberValidation':      (group, node) => !(node instanceof go.Group),
    // 'commandHandler.archetypeGroupData':    { isGroup: true, title: 'Neuer Server', type: 'server' },
    // mouseDrop:                           stopDrag,
    // 'draggingTool.isGridSnapEnabled':       true,
    // 'maxSelectionCount':                    1,
    // "linkingTool.direction": go.LinkingTool.ForwardsOnly,
    // "linkingTool.portGravity": 20,
    // "draggingTool.dragsTree": false,
    // "commandHandler.deletesTree": false,
    // layout: new go.Layout,
    groupTemplate,
    nodeTemplate,
    linkTemplate,

    ...options
  })

  /*
  function createNodeAtPoint(point) {
    diagram.startTransaction("create node");
    const data = {
      key: "Node" + Date.now(), // Eindeutige ID
      title: selectedNodeType.charAt(0).toUpperCase() + selectedNodeType.slice(1),
      description: "Neue " + selectedNodeType + " Beschreibung hier eingeben...",
      type: selectedNodeType,
      loc: go.Point.stringify(point)
    };

    if (selectedNodeType === 'group') {
      data.isGroup = true;
      data.description = "Gruppe für zusammengehörige Komponenten";
    }

    diagram.model.addNodeData(data);
    diagram.commitTransaction("create node");
  }

  // Event-Listener für Rechtsklick auf Hintergrund
  diagram.addDiagramListener("BackgroundContextClicked", function(e) {
    const point = e.diagram.lastInput.documentPoint;
    createNodeAtPoint(point);
  });

  // Event-Listener für Rechtsklick auf Objekte (Nodes/Groups)
  diagram.addDiagramListener("ObjectContextClicked", function(e) {
    const obj = e.subject.part;
    if (obj instanceof go.Node || obj instanceof go.Group) {
      deleteNodeWithConfirmation(obj);
    }
  });


  // Linking-Tool anpassen für automatische Link-Typen
  diagram.toolManager.linkingTool.insertLink = function(fromnode, fromport, tonode, toport) {
    const newlink = go.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport);
    if (newlink !== null) {
      const model = diagram.model;
      // model.setDataProperty(newlink.data, "type", selectedLinkType);
    }
    return newlink;
  };
  */

  // Event-Listener für Rechtsklick auf Hintergrund
  diagram.addDiagramListener('BackgroundContextClicked', function (e) {
    const point = e.diagram.lastInput.documentPoint
    createNodeAtPoint(point)
  })

  // Event-Listener für Rechtsklick auf Objekte (Nodes/Groups)
  diagram.addDiagramListener('ObjectContextClicked', function (e) {
    const point = e.diagram.lastInput.documentPoint
    const obj = e.subject.part
    if (obj instanceof go.Group) {
      createNodeAtPoint(point, obj)
    }

  })


  function createNodeAtPoint(point: go.Point, group?: go.Group) {
    diagram.startTransaction('create node')
    const data = {
      title:       'New Node',
      description: '',
      type:        'server',
      isGroup:     !group,
      group:       group,
      loc:         go.Point.stringify(point),
    }

    diagram.model.addNodeData(data)
    diagram.commitTransaction('create node')
  }

  return diagram
}
