/* eslint-disable no-param-reassign */
import type { IdsForDiscovery } from '../state/panel/panelInterfaces';
import type { NodesMetadata, WorkflowState } from '../state/workflow/workflowInterfaces';
import type { WorkflowEdge, WorkflowNode } from './models/workflowNode';
import { WORKFLOW_EDGE_TYPES, WORKFLOW_NODE_TYPES } from './models/workflowNode';
import type { DiscoveryOperation, DiscoveryResultTypes } from '@microsoft-logic-apps/utils';

export interface AddNodePayload {
  operation: DiscoveryOperation<DiscoveryResultTypes>;
  id: string;
  discoveryIds: IdsForDiscovery;
}

export const createNodeWithDefaultSize = (id: string): WorkflowNode => {
  return { id, height: 67, width: 200, type: WORKFLOW_NODE_TYPES.OPERATION_NODE };
};

export const addNodeToWorkflow = (
  payload: AddNodePayload,
  workflowGraph: WorkflowNode,
  nodesMetadata: NodesMetadata,
  state: WorkflowState
) => {
  // Add Node Data
  nodesMetadata[payload.id] = { graphId: payload.discoveryIds.graphId };
  const workflowNode: WorkflowNode = createNodeWithDefaultSize(payload.id);
  addWorkflowNode(workflowNode, workflowGraph);

  // Adjust edges
  const { id: newNodeId } = payload;
  const { parentId, childId } = payload.discoveryIds;

  if (parentId && childId) {
    // 1 parent and 1 child
    removeEdge(parentId, childId, workflowGraph);
    addNewEdge(parentId, newNodeId, workflowGraph);
    addNewEdge(newNodeId, childId, workflowGraph);
    reassignNodeRunAfter(state, childId, parentId, newNodeId);
  } else {
    if (parentId) {
      // 1 parent, X children
      reassignEdgeSources(state, parentId, newNodeId, workflowGraph);
      addNewEdge(parentId, newNodeId, workflowGraph);
    }
    if (childId) {
      // 1 child, X parents
      reassignEdgeTargets(state, childId, newNodeId, workflowGraph);
      addNewEdge(newNodeId, childId, workflowGraph);
    }
  }
};

export const addWorkflowNode = (node: WorkflowNode, graph: WorkflowNode): void => {
  graph.children = [...(graph?.children ?? []), node];
};

export const addNewEdge = (parent: string, child: string, graph: WorkflowNode) => {
  const workflowEdge: WorkflowEdge = {
    id: `${parent}-${child}`,
    source: parent,
    target: child,
    type: WORKFLOW_EDGE_TYPES.BUTTON_EDGE,
  };
  if (!graph?.edges) graph.edges = [];
  graph?.edges.push(workflowEdge);
};

const removeEdge = (sourceId: string, targetId: string, graph: WorkflowNode) => {
  graph.edges = graph.edges?.filter((edge) => !(edge.source === sourceId && edge.target === targetId));
};

// Reassign edge source ids to new node id
//   |
//  /|\
const reassignEdgeSources = (state: WorkflowState, oldSourceId: string, newSourceId: string, graph: WorkflowNode) => {
  graph.edges = graph.edges?.map((edge) => {
    if (edge.source === oldSourceId) {
      edge.source = newSourceId;
      if (state) reassignNodeRunAfter(state, edge.target, oldSourceId, newSourceId);
    }
    return edge;
  });
};

// Reassign edge target ids to new node id
//  \|/
//   |
const reassignEdgeTargets = (state: WorkflowState, oldTargetId: string, newTargetId: string, graph: WorkflowNode) => {
  reassignAllNodeRunAfter(state, oldTargetId, newTargetId);
  graph.edges = graph.edges?.map((edge) => {
    if (edge.target === oldTargetId) {
      edge.target = newTargetId;

      // Remove RunAfter settings
      const runAfter = (state.operations[edge.source] as LogicAppsV2.ActionDefinition).runAfter;
      delete runAfter?.[oldTargetId];
    }
    return edge;
  });
};

const reassignAllNodeRunAfter = (state: WorkflowState | undefined, oldNodeId: string, newNodeId: string) => {
  if (!state) return;
  const runAfter = (state.operations[oldNodeId] as LogicAppsV2.ActionDefinition).runAfter;
  state.operations[newNodeId] = { ...state.operations[newNodeId], runAfter };
  (state.operations[oldNodeId] as LogicAppsV2.ActionDefinition).runAfter = {
    [newNodeId]: ['Succeeded'],
  };
};

const reassignNodeRunAfter = (state: WorkflowState | undefined, nodeId: string, oldTargetId: string, newTargetId: string) => {
  if (!state) return;
  const runAfter = (state.operations[nodeId] as LogicAppsV2.ActionDefinition)?.runAfter;
  if (!runAfter) return;
  const data = runAfter?.[oldTargetId];
  if (data) {
    runAfter[newTargetId] = data;
    delete runAfter?.[oldTargetId];
  }
};
