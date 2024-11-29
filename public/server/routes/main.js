const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { get } = require('mongoose');

// get
// HOME

//Routes

//home page
router.get('',async (req,res) => {
    
    try {
        const locals={
            title:"Nodejs Blog",
            description:"a simple node js blog."
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data= await Post.aggregate([ {$sort: {createdAt: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count/perPage);

    //    const　data = await Post.find(); 
       res.render('index', {
        locals, 
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
    });

    } catch (error) {
        console.log(error);
    }

})

// GET/
// Post :id

//get post by ID 
router.get('/post/:id',async (req,res) => {
    
    try {
        
        let slug= req.params.id.trim();
        
        const data= await Post.findById(slug)
        // const data= await Post.findById({_id: slug})
        
        const locals={
            title: data.title,
            description:"a simple node js blog.".at,
        }
        
       res.render('post', { 
        locals, 
        data, 
        currentRoute: `/post/${slug}` 
    });

    } catch (error) {
        console.log(error);
    }

})

// GET/
// Post :searchTerm

router.post('/search',async (req,res) => {
    
    try {
        
        let searchTerm= req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
        // let searchTerm= req.body.searchTerm;
        // console.log(searchTerm)
     
        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar), $options: 'i' } },
                { body: { $regex: new RegExp(searchNoSpecialChar), $options: 'i' } }
            ]
        }).exec();

        const locals={
            title: "search",
            description:"a simple node js blog.",
        }

    //    res.render(searchTerm);
    //    res.send(searchTerm);
    //    console.log("returned");
       res.render('search', { locals, data,  searchTerm});
    } catch (error) {
        console.log(error);
    }

})

//about
router.get('/about',(req,res) => {
    res.render('about', {
        currentRoute: '/about'   
    })
})

module.exports = router;


    // function insertPostData () {
    //     Post.insertMany([
    //         {
    //             title: "Building a blog",
    //             body: "This is the body text."
    //         },
    //         {
    //             title: "Build real-time, event-driven applications in Node.js",
    //             body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
    //         },
    //         {
    //             title: "Discover how to use Express.js",
    //             body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
    //         },
    //         {
    //             title: "Getting Started with MongoDB",
    //             body: "Learn how to set up and use MongoDB to store your application data in a NoSQL database."
    //         },
    //         {
    //             title: "Understanding REST APIs",
    //             body: "A guide to understanding REST APIs and how to design and interact with them in your applications."
    //         },
    //         {
    //             title: "Introduction to WebSockets in Node.js",
    //             body: "Learn how WebSockets work and how to implement them in a Node.js application for real-time communication."
    //         },
    //         {
    //             title: "Building a To-Do List App with React",
    //             body: "Learn how to build a simple To-Do List application using React and manage state efficiently."
    //         },
    //         {
    //             title: "Creating a Chat Application with Node.js and Socket.io",
    //             body: "Create a basic real-time chat application using Node.js and Socket.io for live message exchanges."
    //         },
    //         {
    //             title: "Authentication in Express.js with Passport",
    //             body: "Learn how to set up user authentication in an Express.js app using Passport for session management."
    //         },
    //         {
    //             title: "Exploring the Node.js Event Loop",
    //             body: "A deep dive into the Node.js event loop and how it handles asynchronous I/O operations."
    //         },
    //         {
    //             title: "Setting Up a Node.js Server",
    //             body: "Learn how to set up a basic Node.js server using the HTTP module and handle incoming requests."
    //         },
    //         {
    //             title: "Using Mongoose with MongoDB",
    //             body: "Learn how to use Mongoose to interact with a MongoDB database and define models for data manipulation."
    //         },
    //         {
    //             title: "Building a RESTful API with Node.js and Express",
    //             body: "Learn how to build a RESTful API using Node.js, Express.js, and MongoDB to handle CRUD operations."
    //         },
    //         {
    //             title: "Deploying a Node.js Application to Heroku",
    //             body: "A step-by-step guide on how to deploy a Node.js application to Heroku, a cloud platform."
    //         },
    //         {
    //             title: "Handling Errors in Node.js",
    //             body: "Learn how to properly handle errors in Node.js and how to manage exceptions in asynchronous code."
    //         },
    //         {
    //             title: "Optimizing Node.js Performance",
    //             body: "A guide to improving the performance of your Node.js applications by minimizing bottlenecks and using best practices."
    //         },
    //         {
    //             title: "Introduction to GraphQL with Node.js",
    //             body: "Learn the basics of GraphQL and how to use it to query data in your Node.js applications."
    //         }
    //     ])
    // }
    
    // insertPostData();