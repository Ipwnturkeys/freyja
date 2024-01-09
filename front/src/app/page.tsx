"use client";
import React, { useEffect, useState } from 'react';
import styles from './index.module.css';

// Define types for your content structure
interface TextNode {
  type: 'text';
  text: string;
  bold?: boolean; // Optional property for bold text
}

interface ListItem {
  type: 'list-item';
  children: TextNode[]; // Assuming list items only have text nodes for simplicity
}

// Define types for your data structure
type ImageData = {
  data: {
    id: number,
    attributes: {
      url: string;
    };
  } | null;
};

// Define types for your data structure
type HomepageData = {
  data: {
    id: number,
    attributes: {
      Title: string;
      Content: any[]; // Adjust this based on your content structure
      Logo: ImageData;
      ExtraImage: ImageData;
    };
  }[];
};

const fetchHomepage = async (): Promise<HomepageData> => {
  const reqOptions = {
    headers: {
      Authorization: `Bearer 7d09bc9cd8b2c207c6e864349dffc95b4205eb51a63d11cada43f1959706d8db82ad912e058a83970f60622f6636ebaab81805163286211a603dc27c9a3f5bf09e99a97f4f8b309849014373b20499d465a799ea2e2578a13a24ffa500b886ebbc44419a7c545b911c9e592e63b4095e4d61214e0e0b019f96cb75a3a71b972c`
    }
  };

  const response = await fetch('http://127.0.0.1:1337/api/homepages?populate=*', reqOptions);
  const data: HomepageData = await response.json();

  return data;
};


const Home: React.FC = () => {
  const [homepage, setHomepage] = useState<HomepageData | null>(null);

  useEffect(() => {
    fetchHomepage()
      .then(data => {
        setHomepage(data);
      })
      .catch(error => {
        console.error('Error fetching homepage data:', error);
      });
  }, []);

  console.log(homepage);

  // Use optional chaining to safely access the image URLs
  const logoUrl = homepage?.data[0]?.attributes?.Logo?.data?.attributes?.url;
  const extraImageUrl = homepage?.data[0]?.attributes?.ExtraImage?.data?.attributes?.url;

  // Create full image URLs
  const fullLogoUrl = logoUrl?.startsWith('/') ? `http://127.0.0.1:1337${logoUrl}` : logoUrl;
  const fullExtraImageUrl = extraImageUrl?.startsWith('/') ? `http://127.0.0.1:1337${extraImageUrl}` : extraImageUrl;

  return (
    <div className={styles.mainWrapper}>
      <header>
        {fullLogoUrl && <img src={fullLogoUrl} alt="Logo" />}
      </header>
      <div className={styles.headline}>
        {homepage?.data[0]?.attributes?.Title}
      </div>
      <div className={styles.mainContent}>
        <div className={styles.leftContent}>
          <img src={fullExtraImageUrl} />
        </div>
        <div className={styles.rightContent}>
          {
            homepage?.data[0]?.attributes?.Content?.map((contentBlock, index) => {
              if (contentBlock.type === 'heading') {
                return <h3 key={index}>{contentBlock.children[0].text}</h3>;
              } else if (contentBlock.type === 'paragraph') {
                return <p key={index}>{contentBlock.children[0].text}</p>;
              } else if (contentBlock.type === 'list') {
                return (
                  <ul key={index}>
                    {contentBlock.children.map((listItem: ListItem, listItemIndex: number) => (
                      <li key={listItemIndex}>
                        {listItem.children[0].text}
                      </li>
                    ))}
                  </ul>
                );
              } else {
                return null; // or handle other types if needed
              }
            })
          }
        </div>
      </div>
      <a href="/begin" className={styles.continue}>
        CONTINUE
      </a>
    </div>
  );
};

export default Home;