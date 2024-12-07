import SharedDropletPage from "./SharedDropletPage";

export default async function DropletPage({ params }) {
  const { id } = await params;
  console.log('id from share', id)
  return <SharedDropletPage id={id} />;
}
