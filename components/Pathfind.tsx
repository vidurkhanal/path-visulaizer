import React, { useEffect, useState } from "react";
import { AStar } from "../algos/astar";
import { dijkstra } from "../algos/djikstra";
import { getNodesInShortestPathOrder } from "../algos/utils";
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
    isColoredVisit: boolean;
    isAShortPath: boolean;
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
    const [checked, setChecked] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

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
            isColoredVisit: false,
            isAShortPath: false,
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

    const animateAlgo = (
        visitedNodes: INode[],
        shortestPathNodes: INode[]
    ): void => {
        for (let i = 0; i <= visitedNodes.length; i++) {
            if (i === visitedNodes.length) {
                setTimeout(() => {
                    animateShortestPath(shortestPathNodes);
                }, 25 * i);
            } else {
                setTimeout(() => {
                    const node = visitedNodes[i];
                    const newGrid = grid.slice();
                    newGrid[node.row][node.col].isColoredVisit = true;
                    setGrid(newGrid);
                }, 25 * i);
            }
        }
    };

    const animateShortestPath = (shortestPathNodes: INode[]): void => {
        for (let i = 0; i <= shortestPathNodes.length; i++) {
            if (i === shortestPathNodes.length) console.log("DONE..");
            else {
                setTimeout(() => {
                    const node = shortestPathNodes[i];
                    const newGrid = grid.slice();
                    newGrid[node.row][node.col].isAShortPath = true;
                    setGrid(newGrid);
                }, 25 * i);
            }
        }
    };

    const visualize = (): void => {
        if (!isRunning) {
            setIsRunning(!isRunning);
            const startNode = grid[START_NODE_ROW][START_NODE_COLUMN];
            const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COLUMN];
            const visitedNodes = !checked
                ? (dijkstra(grid, startNode, finishNode) as INode[])
                : (AStar(grid, startNode, finishNode) as INode[]);
            const shortestPathNodes = getNodesInShortestPathOrder(finishNode);

            animateAlgo(visitedNodes, shortestPathNodes);
        }
    };

    return (
        <div>
            <nav className="shadow bg-gray-800 w-full">
                <div className="container px-6 py-4 mx-auto">
                    <div className="lg:flex lg:items-center w-full">
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <a
                                    className="text-2xl font-bold  transition-colors duration-300 transform text-white lg:text-3xl hover:text-gray-300"
                                    href="#"
                                >
                                    PathPlanner
                                </a>
                            </div>

                            <div className="absolute inset-x-0 z-20 flex-1 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center lg:justify-between">
                                <div className="flex flex-col text-gray-600  dark:text-gray-300 lg:flex lg:px-16 lg:-mx-4 lg:flex-row lg:items-center">
                                    <div>
                                        <label
                                            htmlFor="Toggle1"
                                            className="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-100"
                                        >
                                            <span>Djikstra{"'"}s</span>
                                            <span className="relative">
                                                <input
                                                    id="Toggle1"
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() =>
                                                        setChecked(!checked)
                                                    }
                                                    className="hidden peer"
                                                />
                                                <div className="w-10 h-6 rounded-full shadow-inner  bg-red-400 peer-checked:bg-violet-400"></div>
                                                <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-gray-800"></div>
                                            </span>
                                            <span>A*</span>
                                        </label>
                                    </div>
                                    <span className="mt-2 transition-colors duration-300 transform lg:mt-0 lg:mx-4 hover:text-gray-900 dark:hover:text-gray-200">
                                        <button
                                            className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-purple-600 rounded-md hover:bg-purple-500 disabled:bg-purple-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                                            onClick={visualize}
                                            disabled={isRunning}
                                        >
                                            Visualize
                                        </button>
                                    </span>
                                    <span className="mt-2 transition-colors duration-300 transform lg:mt-0 lg:mx-4 hover:text-gray-900 dark:hover:text-gray-200">
                                        <button
                                            className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                                            onClick={() => {
                                                setIsRunning(false);
                                                setGrid(getInitialGrid());
                                            }}
                                        >
                                            Clear
                                        </button>
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-center mt-6 lg:flex lg:mt-0 lg:-mx-2">
                                <a
                                    target={"_blank"}
                                    rel="noreferrer"
                                    href="https://github.com/vidurkhanal/path-visulaizer"
                                    className="mx-2 text-gray-600 transition-colors duration-300 transform dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-300"
                                    aria-label="Github"
                                >
                                    <svg
                                        className="w-5 h-5 fill-current"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
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
            </div>
        </div>
    );
};
