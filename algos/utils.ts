import { INode } from "../components/Pathfind";

export const getNodesInShortestPathOrder = (finishNode: INode): INode[] => {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode as INode;
    }
    return nodesInShortestPathOrder;
};
