import { INode } from "./Pathfind";

interface INodeProps {
    data: INode;
    onmousedown: (row: number, col: number) => void;
    onmouseenter: (row: number, col: number) => void;
    onmouseup: () => void;
}

export const Node: React.FC<INodeProps> = ({
    data,
    onmousedown,
    onmouseenter,
    onmouseup,
}) => {
    const extraClassName = data.isFinish
        ? "bg-red-400"
        : data.isStart
        ? "bg-green-400"
        : data.isWall
        ? "bg-stone-900"
        : data.isVisited
        ? "bg-blue-200"
        : "";

    return (
        <div
            className={`w-5 h-5 transition-colors duration-75 ease-in outline outline-1  outline-blue-300 inline-block ${extraClassName}`}
            onMouseDown={() => onmousedown(data.row, data.col)}
            onMouseEnter={() => onmouseenter(data.row, data.col)}
            onMouseUp={() => onmouseup()}
        ></div>
    );
};
