package taskService.services;

import org.springframework.stereotype.Service;
import taskService.models.Task;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class TaskService {

    private List<Task> allTasks = new ArrayList<>();

    public void addTask(Task task) {
        allTasks.add(task);
    }

    public void addTasks(List<Task> tasks) {
        allTasks.addAll(tasks);
    }

    public List<Task> getTasks() {
        return new ArrayList<>(allTasks);
    }
}
