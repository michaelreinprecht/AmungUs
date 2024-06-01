import { ThreeEvent, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useTaskObject } from "./useTaskObject";
import { Task } from "@/app/types";
import { color } from "three/examples/jsm/nodes/Nodes.js";
import * as THREE from "three";

type TaskObjectProps = {
  position: [number, number, number];
  scale: number;
  task: Task | null;
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
    if (task != null) {
      handleTaskClick(event, task);
    }
  };

  return (
    <mesh position={position} onClick={onClick} castShadow receiveShadow>
      <boxGeometry args={[1 * scale, 1 * scale, 1 * scale]} />
      <meshStandardMaterial map={texture} transparent={true} />
      {task && !task.completed && (
        <lineSegments>
          <edgesGeometry
            args={[
              new THREE.BoxGeometry(1.1 * scale, 1.1 * scale, 1.1 * scale),
            ]}
          />
          <lineBasicMaterial color={"green"} linewidth={3} />
        </lineSegments>
      )}
    </mesh>
  );
}

export default TaskObject;
