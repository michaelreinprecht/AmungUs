import { Task } from "@/app/types";
import { useState } from "react";
import { string } from "three/examples/jsm/nodes/Nodes.js";

export function useTaskObject(setCurrentTask : React.Dispatch<React.SetStateAction<Task>>) {

    const handleTaskClick = (event: { stopPropagation: () => void; }, task: Task) => {
        event.stopPropagation(); // Prevents the click from propagating to other objects
        console.log("Task clicked:", task.name);
        if(task.completed) return;
        setCurrentTask(task);
    };

    return {
        handleTaskClick
    };
}
