import React from 'react';
import FrontPageTemplate from '../templates/FrontPageTemplate';
import '../templates/main.css';

const TestFrontPage = () => {
  // Mock data for testing
  const mockArticles = [
    {
      id: 1,
      title: 'The Art of Black and White Photography',
      slug: '/articles/art-of-black-and-white-photography',
      excerpt: 'Discover the timeless appeal of monochrome imagery and learn techniques for creating compelling black and white photographs.',
      coverImageUrl: null
    },
    {
      id: 2,
      title: 'Capturing Natural Light: A Guide',
      slug: '/articles/capturing-natural-light-guide',
      excerpt: 'Master the use of natural light in your photography with these essential tips and techniques.',
      coverImageUrl: null
    },
    {
      id: 3,
      title: 'Street Photography: Finding Stories',
      slug: '/articles/street-photography-finding-stories',
      excerpt: 'Learn how to capture compelling narratives in the urban landscape through street photography.',
      coverImageUrl: null
    }
  ];

  const mockPhotoBooks = [
    {
      id: 1,
      title: 'Urban Landscapes',
      slug: '/photobooks/urban-landscapes',
      description: 'A collection of photographs exploring the architecture and life of modern cities.',
      coverImageUrl: null
    },
    {
      id: 2,
      title: 'Natural Wonders',
      slug: '/photobooks/natural-wonders',
      description: 'Stunning imagery from remote locations around the world.',
      coverImageUrl: null
    }
  ];

  return (
    <FrontPageTemplate
      articles={mockArticles}
      photoBooks={mockPhotoBooks}
      isPreview={false}
    />
  );
};

export default TestFrontPage;