import CircularProgress from "@mui/joy/CircularProgress";
import styles from "./GeoFilesLoader.module.scss";

export default function GeoFilesLoader({
  loadFileRemaining,
  totalFileCount,
}: {
  loadFileRemaining: number;
  totalFileCount: number;
}) {
  return (
    <>
      {loadFileRemaining > 0 && (
        <div className={styles.loaderWrapper}>
          <CircularProgress size="lg" variant="plain" />
          <p style={{ color: "white", textAlign: "center", marginTop: "3px" }}>
            {totalFileCount - loadFileRemaining} / {totalFileCount}
          </p>
        </div>
      )}
    </>
  );
}
