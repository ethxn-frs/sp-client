// src/components/BlogPage.js
import React from 'react';
import './BlogComponent.css';
import HeaderComponent from '../Header/HeaderComponent';
import FooterComponent from '../Footer/FooterComponent';

const BlogComponent = () => {
    const blogPosts = [
        {
            title: 'First Blog Post',
            date: 'June 1, 2024',
            content: 'This is the content of the first blog post.'
        },
        {
            title: 'Second Blog Post',
            date: 'June 2, 2024',
            content: 'This is the content of the second blog post.'
        },
        {
            title: 'Third Blog Post',
            date: 'June 3, 2024',
            content: 'This is the content of the third blog post.'
        }
    ];

    return (
        <div>
            <HeaderComponent />
            <div className="blog-page">
                <div className="blog-container">
                    <h2>Blog</h2>
                    {blogPosts.map((post, index) => (
                        <div key={index} className="blog-post">
                            <h3>{post.title}</h3>
                            <p className="blog-date">{post.date}</p>
                            <p>{post.content}</p>
                        </div>
                    ))}
                </div>
            </div>
            <FooterComponent />
        </div>
    );
};

export default BlogComponent;