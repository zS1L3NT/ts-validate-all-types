import { defineConfig } from "vuepress/config"

export default defineConfig({
	title: "Validate Any",
	description: "Type validation for JavaScript at runtime",
	themeConfig: {
		repo: "zS1L3NT/ts-npm-validate-any",
		searchPlaceholder: "Search",
		smoothScroll: true,
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Guides", link: "/guides/getting-started.html" },
			{ text: "References", link: "/references/" }
		],
		sidebar: [
			{
				title: "Guide",
				children: [
					["/guides/getting-started", "Getting Started"],
					["/guides/validation-basics", "Validation Basics"],
					["/guides/making-a-schema", "Making a Schema"],
					["/guides/usage-as-a-middleware", "Usage as a middleware"]
				]
			}
		]
	}
})
