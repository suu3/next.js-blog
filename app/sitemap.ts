import { MetadataRoute } from "next";
import {
	getAllPosts,
	getCategoriesWithCount,
	getTagsWithCount,
} from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://suu3.github.io";

	// 1. All posts
	const posts = getAllPosts().map((post) => ({
		url: `${baseUrl}/posts/${post.slug}`,
		lastModified: new Date(post.date).toISOString(),
	}));

	// 2. All categories
	const allPosts = getAllPosts();
	const categories = Object.keys(getCategoriesWithCount(allPosts)).map(
		(category) => ({
			url: `${baseUrl}/category/${encodeURIComponent(category)}`,
			lastModified: new Date().toISOString(),
		}),
	);

	// 3. All tags
	const tags = Object.keys(getTagsWithCount(allPosts)).map((tag) => ({
		url: `${baseUrl}/tag/${encodeURIComponent(tag)}`,
		lastModified: new Date().toISOString(),
	}));

	// 4. Base routes
	const routes = [
		{
			url: baseUrl,
			lastModified: new Date().toISOString(),
		},
	];

	return [...routes, ...posts, ...categories, ...tags];
}
