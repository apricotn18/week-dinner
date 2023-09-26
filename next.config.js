/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'image.space.rakuten.co.jp',
				port: '',
				pathname: '**',
			},
		],
	},
}

module.exports = nextConfig
