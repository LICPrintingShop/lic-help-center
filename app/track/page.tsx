import TrackClient from "./TrackClient";

export default function TrackPage({
  searchParams,
}: {
  searchParams: { orderId?: string | string[] };
}) {
  const initialOrderId =
    typeof searchParams.orderId === "string" ? searchParams.orderId : "";

  return <TrackClient initialOrderId={initialOrderId} />;
}
