import CircularProgress from "@mui/joy/CircularProgress";

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
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress size="lg" variant="plain" />
          <p style={{ color: "white", textAlign: "center", marginTop: "3px" }}>
            {totalFileCount - loadFileRemaining} / {totalFileCount}
          </p>
        </div>
      )}
    </>
  );
}
