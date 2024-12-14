import React, { useState } from "react";
import "./index.css";

// types for partitions object
type Partition = {
    id: number;
    color: string;
    orientation: "vertical" | "horizontal" | null;
    children?: Partition[];
};

// generate random color
const randomColor = (): string => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const App: React.FC = () => {
    const [partitions, setPartitions] = useState<Partition[]>([
        { id: Date.now(), color: randomColor(), orientation: null },
    ]);

    const [splitCount, setSplitCount] = useState<number>(1);

    // function to split a function into vertical or horizontal orientation
    const splitPartition = (
        partitionList: Partition[],
        id: number,
        orientation: "vertical" | "horizontal",
    ): Partition[] => {
        setSplitCount(splitCount + 1);

        return partitionList.map((partition) => {
            if (partition.id === id) {
                return partition.children
                    ? {
                        ...partition,
                        children: splitPartition(partition.children, id, orientation),
                    }
                    : createSplitPartition(partition, orientation);
            }

            return partition.children
                ? { ...partition, children: splitPartition(partition.children, id, orientation) }
                : partition;
        });
    };

    // function to create a new partition with two child partitions
    const createSplitPartition = (
        partition: Partition,
        orientation: "vertical" | "horizontal",
    ): Partition => {
        return {
            ...partition,
            orientation,
            children: [
                { id: Date.now(), color: partition.color, orientation: null },
                { id: Date.now() + 1, color: randomColor(), orientation: null },
            ],
        };
    };

    // function to remove partition
    const removePartition = (partitionList: Partition[], id: number): Partition[] => {
        let removed = false;

        const updatedPartitions = partitionList
            .map((partition) => {
                if (partition.id === id) {
                    removed = true;
                    return null;
                }

                return partition.children
                    ? { ...partition, children: removePartition(partition.children, id) }
                    : partition;
            })
            .filter(Boolean) as Partition[];

        if (removed) setSplitCount(splitCount - 1);

        return updatedPartitions;
    };

    // function to render the control for each partitions (split or remove) 
    const renderPartitionControls = (id: number): JSX.Element => {
        return (
            <div className="controls">
                <button onClick={() => setPartitions(splitPartition(partitions, id, "vertical"))}>
                    v
                </button>
                <button onClick={() => setPartitions(splitPartition(partitions, id, "horizontal"))}>
                    h
                </button>
                {splitCount > 1 && (
                    <button onClick={() => setPartitions(removePartition(partitions, id))}>
                        -
                    </button>
                )}
            </div>
        );
    };

    // function to render partitions and their childrens
    const renderPartitions = (partition: Partition): JSX.Element => {
        const { id, color, orientation, children } = partition;

        return (
            <div
                key={id}
                className={`partition ${orientation || ""}`}
                style={{
                    backgroundColor: children ? undefined : color,
                    flex: 1,
                    display: children ? "flex" : "block",
                    flexDirection:
                        orientation === "vertical"
                            ? "row"
                            : orientation === "horizontal"
                            ? "column"
                            : undefined,
                    position: "relative",
                }}
            >
                {!children && renderPartitionControls(id)}
                {children && children.map(renderPartitions)}
            </div>
        );
    };

    return <div className="main-container">{partitions.map(renderPartitions)}</div>;
};

export default App;
