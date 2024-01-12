"use client";
import styles from './purchased.module.css';
import React, { useEffect, useState } from 'react';
import qs from 'qs';

const query = qs.stringify({
  populate: {
    'Title': '*', // Top-level image field
    'Logo': '*', // Another top-level image field
    'ProductList': {
      populate: '*',
    }
  },
}, {
  encodeValuesOnly: true,
});

type PurchasedPageData = {
    data: {
      id: number,
      attributes: {
        Title: string;
        FormHeader: string;
        FormBottomContent: string;
        LeftContentText: any[]; // Adjust this based on your content structure
        FormBackground: ImageData;
        Logo: ImageData;
        ProductList: any[];
      };
    }[];
  };

type ImageData = {
  data: {
    id: number,
    attributes: {
      url: string;
    };
  } | null;
};

interface TextNode {
    type: 'text';
    text: string;
    bold?: boolean; // Optional property for bold text
  }

interface ListItem {
    bold?: boolean; // Optional property for bold text
    type: 'list-item';
    children: TextNode[]; // Assuming list items only have text nodes for simplicity
  }

interface ContentCard {
  Content: string;
  Title: string;
  Image: {
    data: {
      attributes: {
        url: string;
      };
    }
  };
  id?: number;
}

const fetchHomepage = async (): Promise<PurchasedPageData> => {
    const reqOptions = {
      headers: {
        Authorization: `Bearer 7d09bc9cd8b2c207c6e864349dffc95b4205eb51a63d11cada43f1959706d8db82ad912e058a83970f60622f6636ebaab81805163286211a603dc27c9a3f5bf09e99a97f4f8b309849014373b20499d465a799ea2e2578a13a24ffa500b886ebbc44419a7c545b911c9e592e63b4095e4d61214e0e0b019f96cb75a3a71b972c`
      }
    };
  
    const response = await fetch(`http://127.0.0.1:1337/api/product-lists?${query}`, reqOptions);
    const data: PurchasedPageData = await response.json();
  
    return data;
};

const Begin: React.FC = () => {

    const [formpage, setFormpage] = useState<PurchasedPageData | null>(null);

    useEffect(() => {
      fetchHomepage()
        .then(data => {
            setFormpage(data);
        })
        .catch(error => {
          console.error('Error fetching homepage data:', error);
        });
    }, []);
  
    console.log(formpage);

    // Use optional chaining to safely access the image URLs
    const logoUrl = formpage?.data[0]?.attributes?.Logo?.data?.attributes?.url;


    return (
        <div className={styles.mainWrapper}>
            <div className={styles.topPartWrapper}>
                <header>
                    {logoUrl && <img src={`http://127.0.0.1:1337${logoUrl}`} alt="Logo" />}
                </header>
                <h1 className={styles.mainTitle}>{
                    formpage?.data[0]?.attributes?.Title
                }</h1>
                <div className={styles.optionsContainer}>
                    <div className={styles.optionHeadline}>Please Select the Product You Bought <span className={styles.hightlighted}>*</span></div>
                </div>
                <select className={styles.select}>
                    {
                        formpage?.data[0]?.attributes?.ProductList.map((item, index) => {
                            return (
                                <option key={index} value={item.children[0].text}>{item.children[0].text}</option>
                            )
                        })
                    }
                </select>
                <a className={styles.nextButton} href="/amazon">NEXT</a>
            </div>
        </div>
    );
}

export default Begin;