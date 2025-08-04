const express = require('express');
const router = express.Router();
const { Article, Page, PhotoBook } = require('../models/content');
const { Op } = require('sequelize');
const templateRoutes = require('./public/templates.routes');

// Mount template routes
router.use('/templates', templateRoutes);

// Get all published articles
router.get('/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Article.findAndCountAll({
      where: { status: 'published' },
      order: [['orderIndex', 'ASC'], ['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ['id', 'title', 'slug', 'body', 'featuredImage', 'featuredImageAlt', 'featuredImageCaption', 'featuredImageCredit', 'teaserImage', 'teaserImageAlt', 'summary', 'publishedAt', 'metadata']
    });

    res.json({
      articles: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalItems: count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get single article by slug
router.get('/articles/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({
      where: { 
        slug: req.params.slug,
        status: 'published'
      }
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Get all published pages
router.get('/pages', async (req, res) => {
  try {
    const pages = await Page.findAll({
      where: { status: 'published' },
      order: [['order', 'ASC'], ['title', 'ASC']],
      attributes: ['id', 'title', 'slug', 'body', 'featuredImage', 'featuredImageAlt', 'teaserImage', 'teaserImageAlt', 'summary', 'parentId', 'metadata']
    });

    // Build hierarchical structure
    const pageMap = {};
    const rootPages = [];

    pages.forEach(page => {
      pageMap[page.id] = { ...page.toJSON(), children: [] };
    });

    pages.forEach(page => {
      if (page.parentId) {
        if (pageMap[page.parentId]) {
          pageMap[page.parentId].children.push(pageMap[page.id]);
        }
      } else {
        rootPages.push(pageMap[page.id]);
      }
    });

    res.json(rootPages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Get single page by slug
router.get('/pages/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({
      where: { 
        slug: req.params.slug,
        status: 'published'
      }
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

// Get all published photo books
router.get('/photobooks', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await PhotoBook.findAndCountAll({
      where: { status: 'published' },
      order: [['orderIndex', 'ASC'], ['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ['id', 'title', 'slug', 'body', 'featuredImage', 'featuredImageAlt', 'featuredImageCaption', 'featuredImageCredit', 'teaserImage', 'teaserImageAlt', 'summary', 'publishedAt', 'metadata']
    });

    res.json({
      photobooks: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalItems: count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photo books' });
  }
});

// Get single photo book by slug
router.get('/photobooks/:slug', async (req, res) => {
  try {
    const photoBook = await PhotoBook.findOne({
      where: { 
        slug: req.params.slug,
        status: 'published'
      }
    });

    if (!photoBook) {
      return res.status(404).json({ error: 'Photo book not found' });
    }

    res.json(photoBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch photo book' });
  }
});

// Search across all content
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 3) {
      return res.json({ results: [] });
    }

    const searchTerm = `%${q}%`;

    const [articles, pages, photoBooks] = await Promise.all([
      Article.findAll({
        where: {
          status: 'published',
          [Op.or]: [
            { title: { [Op.like]: searchTerm } },
            { body: { [Op.like]: searchTerm } }
          ]
        },
        attributes: ['id', 'title', 'slug'],
        limit: 10
      }),
      Page.findAll({
        where: {
          status: 'published',
          [Op.or]: [
            { title: { [Op.like]: searchTerm } },
            { body: { [Op.like]: searchTerm } }
          ]
        },
        attributes: ['id', 'title', 'slug'],
        limit: 10
      }),
      PhotoBook.findAll({
        where: {
          status: 'published',
          [Op.or]: [
            { title: { [Op.like]: searchTerm } },
            { body: { [Op.like]: searchTerm } }
          ]
        },
        attributes: ['id', 'title', 'slug'],
        limit: 10
      })
    ]);

    const results = [
      ...articles.map(a => ({ ...a.toJSON(), type: 'article' })),
      ...pages.map(p => ({ ...p.toJSON(), type: 'page' })),
      ...photoBooks.map(pb => ({ ...pb.toJSON(), type: 'photobook' }))
    ];

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;