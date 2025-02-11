import styles from "./Reference.module.scss";

export default function Reference({
  text,
  url,
}: {
  text: string;
  url: string;
}) {
  return (
    <div className={styles.reference}>
      出典: <a href={url}>{text}</a>のデータを加工
    </div>
  );
}
