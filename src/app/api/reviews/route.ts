import { NextResponse } from 'next/server'

export const revalidate = 86400 // cache 24h

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    return NextResponse.json({ reviews: [] })
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=de`,
      { next: { revalidate: 86400 } }
    )
    const data = await res.json()

    if (data.status !== 'OK') {
      return NextResponse.json({ reviews: [] })
    }

    const reviews = (data.result?.reviews ?? [])
      .filter((r: { rating: number }) => r.rating >= 4)
      .slice(0, 5)
      .map((r: { author_name: string; rating: number; text: string; relative_time_description: string }) => ({
        name: r.author_name,
        rating: r.rating,
        text: r.text,
        time: r.relative_time_description,
      }))

    return NextResponse.json({
      reviews,
      rating: data.result?.rating,
      total: data.result?.user_ratings_total,
    })
  } catch {
    return NextResponse.json({ reviews: [] })
  }
}
