import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const query = "restaurant";
  const { pagetoken } = req.query;
  
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`;
  
  if (pagetoken) {
    url += `&pagetoken=${pagetoken}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    const nextPageToken = data.next_page_token ? data.next_page_token : null;

    res.status(200).json({
      results: data.results,
      nextPageToken: nextPageToken,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar restaurantes' });
  }
}