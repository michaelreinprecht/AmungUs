package taskService.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.client.RestTemplate;
import taskService.models.Task;
import taskService.services.TaskService;

import java.util.List;

@Controller
public class TaskController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

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

    @PostMapping("/resetTasks/{lobbyCode}")
    @ResponseBody
    public ResponseEntity<String> resetTasks(@PathVariable String lobbyCode) {
        logger.info("Resetting Tasks for lobby: {}", lobbyCode);
        taskService.resetTasks(lobbyCode);
        messagingTemplate.convertAndSend("/task/makeNewTasks/" + lobbyCode, makeNewTasks(lobbyCode));
        return ResponseEntity.ok("OK");
    }

    @SendTo("/task/makeNewTasks/{lobbyCode}")
    public ResponseEntity<String> makeNewTasks(@PathVariable String lobbyCode) {
        logger.info("Send making new tasks for lobby: {}", lobbyCode);
        return ResponseEntity.ok("OK");
    }

    @MessageMapping("/allTasksDone/{lobbyCode}")
    public void allTasksDone(@PathVariable String lobbyCode) {
        logger.info("All tasks done for lobby: {}", lobbyCode);
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/api/lobby/{lobbyCode}/AllTaskDone";
        ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class, lobbyCode);
        logger.info("All Tasks done: " + response);

    }
}
