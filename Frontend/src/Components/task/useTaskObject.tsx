
export function useTaskObject() {

    const handleTaskClick = (event: { stopPropagation: () => void; }, taskName: String) => {
        event.stopPropagation(); // Prevents the click from propagating to other objects
        console.log("Task clicked:", taskName);
        // Open task UI or set task state here
    };

    return {
        handleTaskClick
    };
}
