const ghpages = true;
module.exports = {
  reactStrictMode: true,
  images: {
    loader: 'akamai',
    path: '',
  },
  env: {
    ghpages: ghpages,
    ghpath: '/PixelArt'
  },
  basePath: ghpages?'/PixelArt':"",

}
