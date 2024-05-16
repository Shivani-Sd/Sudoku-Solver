import "./styles.css";

interface ActionBarProps {
  livesLeft: number;
  gameWon: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({ livesLeft, gameWon }) => (
  <div className="action-bar">
    <div id={`game${livesLeft ? "-not" : ""}-over`}>
      {gameWon ? "You are good at this! 🤩" : "GAME OVER!!"}
    </div>
    <div id="lives">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div
            className={`heart${index + 1 > livesLeft ? " hide" : ""}`}
            key={index}
          />
        ))}
    </div>
  </div>
);

export default ActionBar;
