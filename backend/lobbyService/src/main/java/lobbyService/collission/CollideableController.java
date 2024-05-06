package lobbyService.collission;

import lobbyService.GlobalValues;
import lobbyService.collission.models.Collideable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class CollideableController {

    @GetMapping("/api/lobby/colliders")
    @ResponseBody
    public List<Collideable> getColliders() {
        return GlobalValues.getInstance().getCollideables();
    }
}