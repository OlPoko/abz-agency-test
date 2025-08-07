import styles from "./SuccessMessage.module.scss";
import successImg from "../../../public/images/success-image.svg";
export default function SuccessMessage() {
  return (
    <div className={styles.success}>
      <h2 className={styles.title}>User successfully registered</h2>
      <img src={successImg} alt="Success" className={styles.image} />
    </div>
  );
}
