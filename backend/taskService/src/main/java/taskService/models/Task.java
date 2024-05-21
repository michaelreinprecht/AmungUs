package taskService.models;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Task {

    private int id;
    private String name;
    private boolean completed;
    private String playerName;
    private String lobbyCode;
}
