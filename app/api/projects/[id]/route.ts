export const dynamic="force-dynamic";
// Reject direct anonymous updates, including requests without browser headers.
export async function PUT() {
  return Response.json({error:"Shared examples are read-only. Changes belong to your browser's demonstration workspace."},{status:403});
}
