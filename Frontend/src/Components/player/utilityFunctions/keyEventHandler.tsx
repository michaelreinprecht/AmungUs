export function createKeyDownHandler(
    setMovement: React.Dispatch<
      React.SetStateAction<{
        forward: boolean;
        backward: boolean;
        left: boolean;
        right: boolean;
      }>
    >
  ) {
    return function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "w":
          setMovement((prevMovement) => ({ ...prevMovement, forward: true }));
          break;
        case "s":
          setMovement((prevMovement) => ({ ...prevMovement, backward: true }));
          break;
        case "a":
          setMovement((prevMovement) => ({ ...prevMovement, left: true }));
          break;
        case "d":
          setMovement((prevMovement) => ({ ...prevMovement, right: true }));
          break;
        default:
          break;
      }
    };
  }
  
  export function createKeyUpHandler(
    setMovement: React.Dispatch<
      React.SetStateAction<{
        forward: boolean;
        backward: boolean;
        left: boolean;
        right: boolean;
      }>
    >
  ) {
    return function handleKeyUp(event: KeyboardEvent) {
      switch (event.key) {
        case "w":
          setMovement((prevMovement) => ({ ...prevMovement, forward: false }));
          break;
        case "s":
          setMovement((prevMovement) => ({ ...prevMovement, backward: false }));
          break;
        case "a":
          setMovement((prevMovement) => ({ ...prevMovement, left: false }));
          break;
        case "d":
          setMovement((prevMovement) => ({ ...prevMovement, right: false }));
          break;
        default:
          break;
      }
    };
  }