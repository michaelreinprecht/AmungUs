import { ThreeEvent, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useTaskObject } from './useTaskObject';

type TaskObjectProps = {
    position: [number, number, number],
    scale: number,
    taskName: string  
};

function TaskObject({ position, scale, taskName }: TaskObjectProps) {
    const { handleTaskClick } = useTaskObject();  
    const texture = useLoader(TextureLoader, '/FuseBox.png');

    const onClick = (event: ThreeEvent<MouseEvent>) => {
        handleTaskClick(event, taskName);  
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
