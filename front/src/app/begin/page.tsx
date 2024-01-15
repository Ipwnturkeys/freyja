"use client";
import styles from './begin.module.css';
import React, { useEffect, useState } from 'react';
import qs from 'qs';
import { useRouter } from 'next/navigation';

const query = qs.stringify({
  populate: {
    'FormBackground': '*', // Top-level image field
    'MainLogo': '*', // Another top-level image field
    'ContentCard': {
      populate: '*',
    },
    'ContentCard2': {
      populate: '*',
    },
    'ContentCard3': {
      populate: '*',
    },
    'Question': '*',
  },
}, {
  encodeValuesOnly: true,
});

type FormPageData = {
    data: {
      id: number,
      attributes: {
        Headline: string;
        FormHeader: string;
        FormBottomContent: string;
        LeftContentText: any[]; // Adjust this based on your content structure
        FormBackground: ImageData;
        MainLogo: ImageData;
        ContentCard: ContentCard // Adjust this based on your content structure
        ContentCard2: ContentCard // Adjust this based on your content structure
        ContentCard3: ContentCard // Adjust this based on your content structure
        Question: any[]
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

const fetchHomepage = async (): Promise<FormPageData> => {
    const reqOptions = {
      headers: {
        Authorization: `Bearer 7d09bc9cd8b2c207c6e864349dffc95b4205eb51a63d11cada43f1959706d8db82ad912e058a83970f60622f6636ebaab81805163286211a603dc27c9a3f5bf09e99a97f4f8b309849014373b20499d465a799ea2e2578a13a24ffa500b886ebbc44419a7c545b911c9e592e63b4095e4d61214e0e0b019f96cb75a3a71b972c`
      }
    };
  
    const response = await fetch(`http://127.0.0.1:1337/api/formpages?${query}`, reqOptions);
    const data: FormPageData = await response.json();
  
    return data;
};

const Begin: React.FC = () => {
  

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
      });
    
      const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };
    
    // Inside your component
    const router = useRouter();

    const handleSubmit = (e: any) => {
      e.preventDefault();

      if (formData.email && formData.firstName && formData.lastName) {
        console.log(formData);

        // Store the form data in localStorage
        localStorage.setItem('formData', JSON.stringify(formData));

        // Navigate to the next page using Next.js router
        router.push('/purchased'); // Replace with your next page's path
      } else {
        console.log('Please fill all the required fields');
      }
    };

    const [formpage, setFormpage] = useState<FormPageData | null>(null);

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
    const logoUrl = formpage?.data[0]?.attributes?.MainLogo?.data?.attributes?.url;
    const backgroundImageUrl = formpage?.data[0]?.attributes?.FormBackground?.data?.attributes?.url;

    // Create full image URLs
    const fullLogoUrl = logoUrl?.startsWith('/') ? `http://127.0.0.1:1337${logoUrl}` : logoUrl;
    const fullbackgroundImageUrl = backgroundImageUrl?.startsWith('/') ? `http://127.0.0.1:1337${backgroundImageUrl}` : backgroundImageUrl;
    

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.topPartWrapper}>
                <header>
                    {fullLogoUrl && <img src={fullLogoUrl} alt="Logo" />}
                </header>
                <div className={styles.headline}>
                    {formpage?.data[0]?.attributes?.Headline}
                </div>
            </div>
            <div className={styles.secondaryWrapper} style={{backgroundImage: `url(${fullbackgroundImageUrl}`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
                <div className={styles.layout}>
                    <div className={styles.leftSideTextContainer}>
                        {formpage?.data[0]?.attributes?.LeftContentText?.map((text: ListItem, index: number) => (
                            <div key={index} style={{fontWeight: text.children[0].bold === true ? 'bold' : 'unset'}}>
                                {text.children[0].text}
                            </div>
                        )
                        )}
                    </div>
                    <div className={styles.rightSideFormContainer}>
                    <p className={styles.formHeader}>{ formpage?.data[0]?.attributes?.FormHeader }</p>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.labelForm}>
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className={styles.labelForm}>
                            <label htmlFor="firstName">First Name *</label>
                            <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            />
                        </div>
                        
                        <div className={styles.labelForm}>
                            <label htmlFor="lastName">Last Name *</label>
                            <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            />
                        </div>
                        
                        <div className={styles.labelForm}>
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            />
                        </div>
                        
                        <button type="submit">GET MY FREE GIFT</button>
                        </form>
                        <div className={styles.formBottomContent}>
                            {formpage?.data[0]?.attributes?.FormBottomContent}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.thirdWrapper}>
                {formpage?.data[0]?.attributes?.ContentCard && (
                  <div className={styles.cardWrapper}>
                    <div className={styles.cardHeader}>
                      {formpage?.data[0]?.attributes?.ContentCard.Title}
                    </div>
                    <div className={styles.cardImage}>
                      <img src={`http://127.0.0.1:1337${formpage?.data[0]?.attributes?.ContentCard.Image.data.attributes.url}`} alt="Card Image" />
                    </div>
                    <div className={styles.cardContent}>
                      {formpage?.data[0]?.attributes?.ContentCard.Content}
                    </div>
                  </div>
                )}
                {formpage?.data[0]?.attributes?.ContentCard2 && (
                  <div className={styles.cardWrapper}>
                    <div className={styles.cardHeader}>
                      {formpage?.data[0]?.attributes?.ContentCard2.Title}
                    </div>
                    <div className={styles.cardImage}>
                      <img src={`http://127.0.0.1:1337${formpage?.data[0]?.attributes?.ContentCard2.Image.data.attributes.url}`} alt="Card Image" />
                    </div>
                    <div className={styles.cardContent}>
                      {formpage?.data[0]?.attributes?.ContentCard2.Content}
                    </div>
                  </div>
                )}
                {formpage?.data[0]?.attributes?.ContentCard3 && (
                  <div className={styles.cardWrapper}>
                    <div className={styles.cardHeader}>
                      {formpage?.data[0]?.attributes?.ContentCard3.Title}
                    </div>
                    <div className={styles.cardImage}>
                      <img src={`http://127.0.0.1:1337${formpage?.data[0]?.attributes?.ContentCard3.Image.data.attributes.url}`} alt="Card Image" />
                    </div>
                    <div className={styles.cardContent}>
                      {formpage?.data[0]?.attributes?.ContentCard3.Content}
                    </div>
                  </div>
                )}
            </div>
            <div className={styles.fourthWrapper}>
              <h2>FREQUENTLY ASKED QUESTIONS</h2>
              <div className={styles.questionWrapper}>
                {
                  formpage?.data[0]?.attributes?.Question?.map((question: any, index: number) => (
                    <div key={index} className={styles.question}>
                      <h3 className={styles.questionHeader}>
                        {question.Title}
                      </h3>
                      <div className={styles.questionContent}>
                        {question.Content[0].children[0].text}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
        </div>
    );
}

export default Begin;