import { HtmlBasePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const byNewest = (a, b) => b.date - a.date;

export default function (cfg) {
  // Makes every link work whether the site lives at a domain root or in a subfolder.
  cfg.addPlugin(HtmlBasePlugin);

  // Shrinks large photos automatically so pages load quickly.
  cfg.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg"],
    widths: [600, 1200, 2000],
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
        sizes: "(min-width: 1100px) 1040px, 100vw",
      },
    },
  });

  cfg.addPassthroughCopy({ "src/css": "css" });
  cfg.addPassthroughCopy({ "src/js": "js" });
  cfg.addPassthroughCopy({ "src/media/memos": "media/memos" });

  const live = (item) => !item.data.draft;
  cfg.addCollection("words", (api) => api.getFilteredByGlob("src/words/*.md").filter(live).sort(byNewest));
  cfg.addCollection("photos", (api) => api.getFilteredByGlob("src/photos/*.md").filter(live).sort(byNewest));
  cfg.addCollection("reads", (api) => api.getFilteredByGlob("src/reads/*.md").filter(live).sort(byNewest));

  cfg.addFilter("niceDate", (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
  );
  cfg.addFilter("limit", (arr, n) => (arr || []).slice(0, n));
  cfg.addFilter("where", (arr, key, val) => (arr || []).filter((i) => i.data[key] === val));
  cfg.addFilter("excerpt", (html, n = 180) => {
    const text = String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return text.length > n ? text.slice(0, n).replace(/\s+\S*$/, "") + "…" : text;
  });

  return {
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
