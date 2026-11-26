export default {
  layout: "word.njk",
  eleventyComputed: {
    permalink: (data) => `/words/${data.page.fileSlug}/`,
  },
};
