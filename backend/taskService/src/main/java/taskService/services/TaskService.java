package taskService.services;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import taskService.controller.TaskController;
import taskService.models.Task;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class TaskService {

    private static final Logger logger = LogManager.getLogger(TaskService.class);
    private List<Task> allTasks = new CopyOnWriteArrayList<>();

    public void addTask(Task task) {
        allTasks.add(task);
        logger.info("TaskService Task added successfully: {}", task);
    }

    public void addTasks(List<Task> tasks) {
        allTasks.addAll(tasks);
    }

    public List<Task> getAllTasks() {
        return new ArrayList<>(allTasks);
    }

    public List<Task> getAllTasksbyLobbyCode(String lobbyCode){
        List<Task> tasks = new ArrayList<>();
        for (Task task : allTasks) {
            if (task.getLobbyCode().equals(lobbyCode)) {
                tasks.add(task);
            }
        }
        logger.info("TaskService Tasks retrieved successfully: {}", tasks);
        return tasks;
    }

    public void completeTask(Task completeTask) {
        for(Task task: allTasks){
            if(task.getId() == completeTask.getId() && task.getPlayerName().equals(completeTask.getPlayerName()) && task.getLobbyCode().equals(completeTask.getLobbyCode())){
                task.setCompleted(true);
                logger.info("TaskService Task updated successfully: {}", task);
                break;
            }
        }
    }

    public void resetTasks(String lobbyCode){
        allTasks.removeIf(task -> task.getLobbyCode().equals(lobbyCode));
        logger.info("TaskService Tasks reset successfully for lobby: {}", lobbyCode);
    }
}
