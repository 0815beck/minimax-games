import { Link } from "react-router-dom";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Was möchtest du spielen?</h1>
      <div className={styles.links}>
        <Link to="/tictactoe" className={styles.link}>
          Tic Tac Toe
        </Link>
        <Link to="/dame" className={styles.link}>
          Dame
        </Link>
      </div>
    </div>
  );
}

export default Home;
