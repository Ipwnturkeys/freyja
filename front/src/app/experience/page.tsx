"use client";
import styles from './experience.module.css';
import React, { useEffect, useState } from 'react';
import qs from 'qs';
import { useRouter } from 'next/navigation';

const query = qs.stringify({
  populate: {
    'Title': '*', // Top-level image field
    'Subtitle': '*', // Another top-level image field
    'Questions': '*',
    'Logo': '*',
  },
}, {
  encodeValuesOnly: true,
});

type PurchasedPageData = {
    data: {
      id: number,
      attributes: {
        Title: string;
        Subtitle: string;
        FormHeader: string;
        FormBottomContent: string;
        LeftContentText: any[]; // Adjust this based on your content structure
        FormBackground: ImageData;
        Logo: ImageData;
        ProductList: any[];
        Questions: any[];
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

const fetchHomepage = async (): Promise<PurchasedPageData> => {
    const reqOptions = {
      headers: {
        Authorization: `Bearer 7d09bc9cd8b2c207c6e864349dffc95b4205eb51a63d11cada43f1959706d8db82ad912e058a83970f60622f6636ebaab81805163286211a603dc27c9a3f5bf09e99a97f4f8b309849014373b20499d465a799ea2e2578a13a24ffa500b886ebbc44419a7c545b911c9e592e63b4095e4d61214e0e0b019f96cb75a3a71b972c`
      }
    };
  
    const response = await fetch(`http://127.0.0.1:1337/api/experiences?${query}`, reqOptions);
    const data: PurchasedPageData = await response.json();
  
    return data;
};

const Experience: React.FC = () => {

    const [rating, setRating] = useState('1');

    const handleRatingChange = (e: any) => {
        setRating(e.target.value);
      };


    // Inside your component
const router = useRouter();

const handleNextClick = () => {
    // Retrieve existing data from localStorage
    const existingData = localStorage.getItem('formData');
    const formData = existingData ? JSON.parse(existingData) : {};
    
    // Update formData with the selected rating
    formData.rating = rating;

    // Save updated formData back to localStorage
    localStorage.setItem('formData', JSON.stringify(formData));

    // Redirect based on rating
    if (['5', '4'].includes(rating)) {
        router.push('/highRatingPage'); // Path for high ratings
    } else {
        router.push('/lowRatingPage'); // Path for low ratings
    }
};

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
                <p className={styles.subTitle}>{
                    formpage?.data[0]?.attributes?.Subtitle
                }</p>
                <div className={styles.textContent}>
                    {
                        formpage?.data[0]?.attributes?.Questions?.map((text, index) => (
                            <p key={index}>{text.children[0].text}</p>
                        ))
                    }
                </div>
                <div>
                    <p>Rate Experience</p>
                    <select onChange={handleRatingChange} value={rating} className={styles.select}>
                    <option value="5">5. Love it</option>
                    <option value="4">4. Like it</option>
                    <option value="3">3. It's OK</option>
                    <option value="2">2. Needs improvement</option>
                    <option value="1">1. Don't like it</option>
                </select>
                </div>
              <button onClick={handleNextClick} className={styles.nextButton}>NEXT</button>
            </div>
        </div>
    );
}

export default Experience;