import SharedDropletPage from "./SharedDropletPage";

export default async function DropletPage({ params }) {
  const { id } = await params;
  return <SharedDropletPage id={id} />;
}
