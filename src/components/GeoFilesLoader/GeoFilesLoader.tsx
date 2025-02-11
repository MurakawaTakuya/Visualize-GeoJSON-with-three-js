import CircularProgress from "@mui/joy/CircularProgress";
import styles from "./GeoFilesLoader.module.scss";

export default function GeoFilesLoader({
  loadFileRemaining,
  totalFileCount,
  showProgress = true,
}: {
  loadFileRemaining: number;
  totalFileCount: number;
  showProgress?: boolean;
}) {
  return (
    <>
      {loadFileRemaining > 0 && (
        <div className={styles.loaderWrapper}>
          <CircularProgress size="lg" variant="plain" />
          {showProgress && (
            <p>
              {totalFileCount - loadFileRemaining} / {totalFileCount}
            </p>
          )}
        </div>
      )}
    </>
  );
}
