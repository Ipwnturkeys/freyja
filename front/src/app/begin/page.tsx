"use client";
import styles from './begin.module.css';
import React, { useEffect, useState } from 'react';

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

const fetchHomepage = async (): Promise<FormPageData> => {
    const reqOptions = {
      headers: {
        Authorization: `Bearer 7d09bc9cd8b2c207c6e864349dffc95b4205eb51a63d11cada43f1959706d8db82ad912e058a83970f60622f6636ebaab81805163286211a603dc27c9a3f5bf09e99a97f4f8b309849014373b20499d465a799ea2e2578a13a24ffa500b886ebbc44419a7c545b911c9e592e63b4095e4d61214e0e0b019f96cb75a3a71b972c`
      }
    };
  
    const response = await fetch('http://127.0.0.1:1337/api/formpages?populate=*', reqOptions);
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
    
      const handleSubmit = (e: any) => {
        e.preventDefault();
        // Handle the form submission, e.g., send data to an API or server
        console.log(formData);
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
            <div className={styles.secondaryWrapper} style={{backgroundImage: `url(${fullbackgroundImageUrl})`}}>
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
        </div>
    );
}

export default Begin;