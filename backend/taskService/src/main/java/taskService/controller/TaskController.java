package taskService.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import taskService.models.Task;
import taskService.services.TaskService;

import java.util.List;

@Controller
public class TaskController {

    private static final Logger logger = LogManager.getLogger(TaskController.class);

    @Autowired
    private TaskService taskService;

    @MessageMapping("/saveTasks/{lobbyCode}")
    public ResponseEntity<Void> saveTasks(Task task) {
        try {
            logger.info("TaskController Task received successfully: {}", task);
            taskService.addTask(task);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error saving tasks: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @MessageMapping("/getTasks/{lobbyCode}")
    @SendTo("/task/getTasks/{lobbyCode}")
    public List<Task> getTasks(String lobbyCode) {
        logger.info("Retrieving tasks for lobbyCode: {}", lobbyCode);
        return taskService.getAllTasksbyLobbyCode(lobbyCode);
    }

    @MessageMapping("/completeTask/{lobbyCode}")
    @SendTo("/task/getTasks/{lobbyCode}")
    public List<Task> completeTask(Task task) {
        logger.info("TaskController CompletedTask received successfully: {}", task);
        taskService.completeTask(task);
        return taskService.getAllTasksbyLobbyCode(task.getLobbyCode());
    }
}
