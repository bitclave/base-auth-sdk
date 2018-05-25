build_js_prod:
	npm run build_prod

build_js_staging:
	npm run build_staging

build_js_dev:
	npm run build_dev

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
