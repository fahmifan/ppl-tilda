.PHONY: docs

docs:
	apidoc -i tilda-server/src -o tilda-server/apidoc/ -t ../apidoc/template
