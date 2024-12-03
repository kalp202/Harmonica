/** @type {import('next').NextConfig} */

const API_URL = process.env.API_URL

const nextConfig = {
	output: "export",
	trailingSlash: true,
	images: {
		unoptimized: true
	},
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${API_URL}/api/:path*`,
			},
		]
	},
};

export default nextConfig;
