import CircularProgress from "@mui/joy/CircularProgress";

export default function GeoFilesLoader() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <CircularProgress size="lg" variant="plain" />
    </div>
  );
}
