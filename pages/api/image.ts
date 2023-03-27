// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Image from 'next/image';


type Data = {
  images: Array<Image>
}

interface ImageURLs {
  regular: string,
  thumb: string,
  full: string
}

interface Image {
  id: number;
  color: string,
  width: number,
  height: number,
  urls: ImageURLs
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let images = []
  for (let index = 1; index < 6; index++) {
    const element = `/images/00${index}.png`;
    let image: Image = {
      id: index,
      color: 'wheat',
      width: index % 5 <= 1 ? 512 : 100,
      height: index % 5 <= 1 ? 768 : 100,
      urls: {
        regular: element,
        thumb: element,
        full: element,
      },
    };
    images.push(image)
  }
  res.status(200).json({ 'images': images })
}
