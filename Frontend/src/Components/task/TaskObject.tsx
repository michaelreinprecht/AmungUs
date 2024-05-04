import { ThreeEvent, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useTaskObject } from './useTaskObject';

type TaskObjectProps = {
    position: [number, number, number],
    scale: number,
    taskName: string,
    setCurrentTask: React.Dispatch<React.SetStateAction<string>>,
    currentTask: string
};

function TaskObject({ position, scale, taskName, setCurrentTask, currentTask }: TaskObjectProps) {
    const { handleTaskClick } = useTaskObject(setCurrentTask);  
    const texture = useLoader(TextureLoader, '/TaskObject.png');

    const onClick = (event: ThreeEvent<MouseEvent>) => {
        handleTaskClick(event, taskName, currentTask);
        
    };

    return (
        <mesh
            position={position}
            onClick={onClick}
            castShadow
            receiveShadow
        >
            <boxGeometry args={[1 * scale, 1 * scale, 1 * scale]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}

export default TaskObject;
