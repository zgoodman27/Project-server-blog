import { readFileSync, writeFileSync } from "fs";
// const app = require("express").Router()
// import blogData from '../api/blog.json' with { type: "json" };
import { Router } from "express";
const app = Router();

//refresh blog data from the JSON file (for now we'll use the imported data directly)
const refreshBlogData = () =>
  JSON.parse(readFileSync("./api/blog.json", "utf-8"));

const updateBlogData = (data) => {
  writeFileSync("./api/blog.json", JSON.stringify(data, null, 2));
};
// [ ] Endpoint that will display all comments from the database. In lieu of database, we use our blog.json file.
app.get("/", (req, res) => {
  try {
    const blogDataResult = refreshBlogData();
    res.status(200).json(blogDataResult);
  } catch (error) {
    res.status(500).json({ message: "Error reading blog data" });
  }
});

// [ ] Endpoint that will display one comment from the database selected by its post_id
app.get("/:post_id", (req, res) => {
  try {
    const blogDataResult = refreshBlogData();

    const blogPost = blogDataResult.find(
      (blog) => blog.post_id === parseInt(req.params.post_id)
    );
    if (!blogPost) {
      return res.status(404).json({ message: "blog not found" });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ error: error.message || "Error finding blog data" });
    console.error("Error finding blog data:", error);
  }
});

// [ ] Endpoint that will allow us to create a new entry which will be appended to the .json file's outermost array.
app.post("/create", (req, res) => {
  try {
    const blogDataResult = refreshBlogData();
    const newBlogPost = req.body;
    const currentMaxId = Math.max(
      ...blogDataResult.map((post) => post.post_id),
      0
    );
    const newId = currentMaxId + 1;
    const postWithId = newBlogPost.map((post) => {
      const addedId = { ...post, post_id: newId };
      return addedId;
    });
    blogDataResult.push(...postWithId);
    updateBlogData(blogDataResult);
    res.status(200).json(postWithId);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
});
// [ ] Endpoint that will allow us to update an existing entry once a match has been found. The search should be done via a query parameter, whereas update information should be enclosed within the body.
app.put("/update/:post_id", (req, res) => {
  try {
    const blogDataResult = refreshBlogData();
    const postId = parseInt(req.params.post_id);
    const postBody = req.body;
    let updatedPost = blogDataResult.find((post) => post.post_id === postId);
    if (!updatedPost) {
      res.status(404).json({ message: "Post not found" });
    }
    updatedPost.title = postBody.title || updatedPost.title;
    updatedPost.author = postBody.author || updatedPost.author;
    updatedPost.body = postBody.body || updatedPost.body;
    updateBlogData(blogDataResult);
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
});
// [ ] Endpoint that will allow us to delete an entry from our .json file. This should be done thru the utilization of the parameter.
app.delete("/delete/:post_id", (req, res) => {
  try {
    const blogDataResult = refreshBlogData();
    const postId = parseInt(req.params.post_id);
    const postById = blogDataResult.find((post) => post.post_id === postId);
    const postByIndex = postById - 1;
    if (!postById || blogDataResult[postByIndex] === -1) {
      return res.status(404).json({ message: "Post not found" });
    }
    blogDataResult.splice(postByIndex, 1);
    updateBlogData(blogDataResult);
    res.status(200).json(blogDataResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
});

export default app;
