import { useState } from "react";
import { string } from "three/examples/jsm/nodes/Nodes.js";

export function useTaskObject(setCurrentTask : React.Dispatch<React.SetStateAction<string>>) {

    const handleTaskClick = (event: { stopPropagation: () => void; }, taskName: string, currentTask: string) => {
        event.stopPropagation(); // Prevents the click from propagating to other objects
        console.log("Task clicked:", taskName);
        if(currentTask === "Done") return
        setCurrentTask(taskName);

    };

    return {
        handleTaskClick
    };
}
