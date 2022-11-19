import React, { useEffect, useState } from "react";
import { dijkstra } from "../algos/djikstra";
import { Node } from "./Node";

export interface INode {
    row: number;
    col: number;
    isStart: boolean;
    isFinish: boolean;
    distance: number;
    distanceToFinishNode: number;
    isVisited: boolean;
    isWall: boolean;
    previousNode: INode | null;
    isNode: boolean;
}

interface IPathFind {
    GRID_ROWS: number;
    GRID_COLUMNS: number;
    START_NODE_ROW: number;
    START_NODE_COLUMN: number;
    FINISH_NODE_ROW: number;
    FINISH_NODE_COLUMN: number;
}

export const Pathfind: React.FC<IPathFind> = ({
    GRID_ROWS,
    GRID_COLUMNS,
    START_NODE_COLUMN,
    START_NODE_ROW,
    FINISH_NODE_COLUMN,
    FINISH_NODE_ROW,
}) => {
    const [grid, setGrid] = useState<INode[][]>([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);

    // INITIALIZE THE GRID
    const getInitialGrid = (): INode[][] => {
        const tmpNode: INode[][] = [];
        for (let i = 0; i < GRID_ROWS; i++) {
            const curr: INode[] = [];
            for (let j = 0; j < GRID_COLUMNS; j++) {
                curr.push(createNode(i, j));
            }
            tmpNode.push(curr);
        }
        return tmpNode;
    };

    const createNode = (row: number, col: number): INode => {
        return {
            row,
            col,
            isStart: row === START_NODE_ROW && col === START_NODE_COLUMN,
            isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COLUMN,
            distance: Infinity,
            distanceToFinishNode:
                Math.abs(FINISH_NODE_ROW - row) +
                Math.abs(FINISH_NODE_COLUMN - col),
            isVisited: false,
            isWall: false,
            previousNode: null,
            isNode: true,
        };
    };
    useEffect(() => {
        setGrid(getInitialGrid());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getNewGridWithToggled = (row: number, col: number): INode[][] => {
        const newGrid = grid.slice();
        const node = grid[row][col];
        const newNode: INode = {
            ...node,
            isWall: true,
        };
        newGrid[node.row][node.col] = newNode;
        return newGrid;
    };

    // WALL EVENTS
    const handleMouseDown = (row: number, col: number): void => {
        const newGrid = getNewGridWithToggled(row, col);
        setGrid(newGrid);
        setMouseIsPressed(true);
    };

    const handleMouseEnter = (row: number, col: number): void => {
        if (!mouseIsPressed) return;
        const newGrid = getNewGridWithToggled(row, col);
        setGrid(newGrid);
        setMouseIsPressed(true);
    };

    const handleMouseUp = (): void => {
        setMouseIsPressed(false);
    };

    const animateDjikstra = (visitedNodes: INode[]): void => {
        for (let i = 0; i < visitedNodes.length; i++) {
            setTimeout(() => {
                const node = visitedNodes[i];
                const newGrid = grid.slice();
                newGrid[node.row][node.col].isVisited = true;
                setGrid(newGrid);
            }, 25 * i);
        }
    };

    const visualizeDjikstra = (): void => {
        const startNode = grid[START_NODE_ROW][START_NODE_COLUMN];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COLUMN];
        const visitedNodes = dijkstra(grid, startNode, finishNode) as INode[];

        animateDjikstra(visitedNodes);
    };

    return (
        <div className="grid items-center justify-center h-screen">
            <div>
                {grid.map((row, rowIndx) => {
                    return (
                        <div key={rowIndx}>
                            {row.map((node, nodeIndx) => {
                                return (
                                    <Node
                                        key={nodeIndx}
                                        data={node}
                                        onmousedown={handleMouseDown}
                                        onmouseenter={handleMouseEnter}
                                        onmouseup={handleMouseUp}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            <button onClick={visualizeDjikstra}>
                Visualize Djikstra{"'"}s
            </button>
            <button
                onClick={() => {
                    setGrid(getInitialGrid());
                }}
            >
                Clear
            </button>
        </div>
    );
};
