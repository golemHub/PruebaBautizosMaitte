export async function GetRelatedProducts(
  categorySlug: string,
  currentProductId: number,
  limit = 4
) {
  try {
    const url = `https://bautizosmaitte-backend.onrender.com/api/products?filters[categories][slug][$eq]=${categorySlug}&filters[id][$ne]=${currentProductId}&filters[active][$eq]=true&filters[isOnline][$eq]=true&populate=*&pagination[limit]=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
}
