npm_postinstall:
	$(MAKE) build_js_prod

build_js_prod:
	NODE_ENV=prod npm run build

build_js_staging:
	NODE_ENV=staging npm run build

build_js_dev:
	NODE_ENV=dev npm run build

deploy_prod:
	git push heroku_prod -f HEAD:master

deploy_staging:
	git push heroku_staging -f HEAD:master

heroku_buildpacks_prod:
	heroku buildpacks:clear --remote heroku_prod
	heroku buildpacks:set --remote heroku_prod --index 1 heroku/nodejs
	heroku buildpacks:set --remote heroku_prod --index 2 https://github.com/heroku/heroku-buildpack-static

heroku_buildpacks_staging:
	heroku buildpacks:clear --remote heroku_staging
	heroku buildpacks:set --remote heroku_staging --index 1 heroku/nodejs
	heroku buildpacks:set --remote heroku_staging --index 2 https://github.com/heroku/heroku-buildpack-static
