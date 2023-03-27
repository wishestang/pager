import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import styles from "../styles/index.module.css";

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

interface GalleryProps {
  images: Image[];
}

interface SearchProps {
  onSearch: (query: string) => void;
}

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1
};

function Search(props: SearchProps) {
  const [query, setQuery] = useState("");

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    props.onSearch(query);
  }

  return (
    <form className={styles["search-input"]} onSubmit={handleFormSubmit}>
      <input type="text" value={query} placeholder={'Your thoughts, your images'} onChange={handleInputChange} />
      <button type="submit">Search</button>
    </form>
  );
}

function Gallery(props: GalleryProps) {
  const { images } = props;

  const [windowSize, setWindowSize] = useState({
    width: process.browser ? window?.innerWidth : 0,
    height: process.browser ? window?.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: process.browser ? window?.innerWidth : 0,
        height: process.browser ?  window?.innerHeight : 0,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let column = 3
  if (windowSize.width > 1100) {
    column = 3
  } else if (windowSize.width > 700) {
    column = 2
  } else {
    column = 1
  }

  let width = windowSize.width * 0.8 / column - 40 + 20

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className={styles["my-masonry-grid"]}
      columnClassName={styles["my-masonry-grid_column"]}
    >
      {images.map(image => (
        <div style={{width: width, height: width * image.height / image.width, backgroundColor: image.color }} key={image.id}>
          <img src={image.urls.regular}  style={{backgroundColor: image.color }} />
        </div>
      ))}
    </Masonry>
  );
}

export default function App() {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    fetch("https://api.unsplash.com/photos?per_page=30&client_id=ByXo8nFDjvDUOWqalCnbBi4lIQmqEMh39ArrqqksxcE")
      .then(response => response.json())
      .then((json: Image[]) => {
        if (json?.length > 0) {
          setImages(json)
        } else {
          fetch("/api/image")
          .then(response => response.json())
          .then((json: any) => {
            console.log(json)
            setImages(json?.images)
          })
        }
      });
  }, []);

  function handleSearch(query: string) {
    fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=30&client_id=ByXo8nFDjvDUOWqalCnbBi4lIQmqEMh39ArrqqksxcE`)
      .then(response => response.json())
      .then((json: any) => setImages(json.results));
  }

  return (
    <div style={{backgroundColor: 'whitesmoke'}}>
      <header>
          <div style={{ height: 80, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <img src={'/icon.png'}  style={{width: 60, height: 60, objectFit: 'cover', marginLeft: 20 }} />
              <div style={{color: 'black', fontFamily: 'fantasy', fontSize: 30, marginTop: 8 }}>Thoughts </div>
          </div>
      </header>
      <div className={styles.app}>
        <Search onSearch={handleSearch} />
        <Gallery images={images} />
      </div>
      <header>
          <div style={{ height: 80, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{color: 'black', fontSize: 5, marginTop: 8 }}> @wishes </div>
          </div>
      </header>
    </div>
  );
}