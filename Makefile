build_js_staging:
	npm run build_staging

build_js_dev:
	npm run build_dev

deploy_staging:
ifneq ($(shell git rev-parse --abbrev-ref HEAD),master)
	$(error Wrong branch)
else
	git push heroku_staging -f HEAD:master
endif
