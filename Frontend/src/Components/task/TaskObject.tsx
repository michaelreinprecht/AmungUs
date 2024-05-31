import { ThreeEvent, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useTaskObject } from "./useTaskObject";
import { Task } from "@/app/types";

type TaskObjectProps = {
  position: [number, number, number];
  scale: number;
  task: Task;
  setCurrentTask: React.Dispatch<React.SetStateAction<Task>>;
  taskObjectImage: string;
};

function TaskObject({
  position,
  scale,
  task,
  setCurrentTask,
  taskObjectImage,
}: TaskObjectProps) {
  const { handleTaskClick } = useTaskObject(setCurrentTask);
  const texture = useLoader(TextureLoader, taskObjectImage);

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    handleTaskClick(event, task);
  };

  return (
    <mesh position={position} onClick={onClick} castShadow receiveShadow>
      <boxGeometry args={[1 * scale, 1 * scale, 1 * scale]} />
      <meshStandardMaterial map={texture} transparent={true} />
    </mesh>
  );
}

export default TaskObject;
