package taskService.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
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
            taskService.addTask(task);
            logger.info("Task saved successfully: {}", task);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error saving tasks: ", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/getTasks")
    public ResponseEntity<List<Task>> getTasks() {
        return ResponseEntity.ok(taskService.getTasks());
    }
}
