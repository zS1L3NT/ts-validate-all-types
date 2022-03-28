import { defineConfig } from "vuepress/config"

export default defineConfig({
	title: "Validate Any",
	description: "Type validation for JavaScript at runtime",
	themeConfig: {
		repo: "zS1L3NT/ts-npm-validate-any",
		searchPlaceholder: "Search",
		smoothScroll: true,
		//@ts-ignore
		displayAllHeaders: true,
		activeHeaderLinks: true,
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Docs", link: "/docs/getting-started.html" }
		],
		sidebar: [
			{
				title: "Documentation",
				collapsable: false,
				children: [
					["/docs/getting-started", "Getting Started"],
					["/docs/validation-basics", "Validation Basics"],
					["/docs/making-a-schema", "Making a Schema"],
					["/docs/usage-as-a-middleware", "Usage as a middleware"]
				]
			}
		]
	}
})
