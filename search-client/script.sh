git reset --hard
rm -rf build
git pull
npm i
npm run build
rm -rf node_modules
rm package.json
rm package-lock.json
rm -rf public
rm -rf src
