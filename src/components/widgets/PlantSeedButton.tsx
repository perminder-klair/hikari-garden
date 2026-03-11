import { useGarden } from '../../contexts/GardenContext';
import styles from './PlantSeedButton.module.css';

export default function PlantSeedButton() {
  const { plantSeed } = useGarden();

  return (
    <button className={styles.btn} onClick={plantSeed}>
      <span>+</span>
      <span>Plant Seed</span>
    </button>
  );
}
