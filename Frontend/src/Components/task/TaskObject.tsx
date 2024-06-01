import { ThreeEvent, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, AudioListener, PositionalAudio, AudioLoader } from 'three';
import { useEffect, useRef } from 'react';
import { useTaskObject } from './useTaskObject';
import { Task } from '@/app/types';

type TaskObjectProps = {
    position: [number, number, number],
    scale: number,
    task: Task,
    setCurrentTask: React.Dispatch<React.SetStateAction<Task>>,
    currentTask: Task
};

function TaskObject({ position, scale, task, setCurrentTask, currentTask }: TaskObjectProps) {
    const { handleTaskClick } = useTaskObject(setCurrentTask);  
    const texture = useLoader(TextureLoader, '/TaskObject.png');
    const { camera } = useThree();
    const audioRef = useRef<PositionalAudio>();

    useEffect(() => {
        const listener = new AudioListener();
        camera.add(listener);

        const sound = new PositionalAudio(listener);
        const audioLoader = new AudioLoader();

        audioLoader.load('/click.mp3', (buffer) => {
            sound.setBuffer(buffer);
            sound.setRefDistance(1);
            sound.setLoop(false);
            sound.setVolume(50.0); // Lautstärke erhöhen
            audioRef.current = sound;
        });

        return () => {
            camera.remove(listener);
        };
    }, [camera]);

    const onClick = (event: ThreeEvent<MouseEvent>) => {
        handleTaskClick(event, task);
        if (audioRef.current) {
            const clickedPosition = event.point;
            audioRef.current.position.set(clickedPosition.x, clickedPosition.y, clickedPosition.z);
            audioRef.current.play();
        }
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
