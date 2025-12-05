import go from 'gojs'
import {groupTemplate, linkTemplate, nodeTemplate} from "./templates";
import {AvoidsLinksRouter} from "./AvoidsLinksRouter";
import {CurvedLinkReshapingTool} from "./CurvedLinkReshapingTool";

// helper

export default (options: go.DiagramInitOptions = {}): go.Diagram => {


  const diagram =  new go.Diagram({
    'undoManager.isEnabled':                true,
    'clickCreatingTool.archetypeNodeData':    { title: 'Neue Node', type: '' },
    // 'commandHandler.memberValidation':      (group, node) => !(node instanceof go.Group),
    // 'commandHandler.archetypeGroupData':    { isGroup: true, title: 'Neuer Server', type: 'server' },
    // mouseDrop:                           ...,
    'draggingTool.isGridSnapEnabled':       true,
    'maxSelectionCount':                    1,
    "linkingTool.direction": go.LinkingTool.ForwardsOnly,
    "linkingTool.portGravity": 20,
    linkReshapingTool: new CurvedLinkReshapingTool(),
    // "draggingTool.dragsTree": false,
    // "commandHandler.deletesTree": false,
    // layout: new go.Layout,
    groupTemplate,
    nodeTemplate,
    linkTemplate,

    ...options
  })
  // diagram.routers.add(new AvoidsLinksRouter());

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
      type:        group ? 'server' : 'default',
      isGroup:     !group,
      group:       group?.key,
      loc:         go.Point.stringify(point),
    }

    diagram.model.addNodeData(data)
    diagram.commitTransaction('create node')
  }

  return diagram
}
