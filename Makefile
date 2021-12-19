docker:
	podman build . -f api/Dockerfile -t randombenj/hslu-wipro-smic-api
	podman build . -f dataingress/Dockerfile -t randombenj/hslu-wipro-smic-dataingress
	podman build . -f web/Dockerfile -t randombenj/hslu-wipro-smic-web

run: tls
	podman pod rm -f hslu-wipro-smic || true
	podman play kube deployment/config.yml

tls: export CAROOT = $(PWD)/data/mkcert
tls: data/mkcert/localhost+4.pem

#mkcert-intsallation:
#	@mkcert &> /dev/null || { echo "'mkcert' not found in $$PATH, pleas install it: https://github.com/FiloSottile/mkcert#installation"; exit 1; }

data/mkcert/localhost+4.pem: data/mkcert/rootCA.pem
# FIXME: Don't add +o to the key file, rather change user permissions!
	cd $(CAROOT) && mkcert localhost localhost 127.0.0.1 0.0.0.0 ::1
	chmod o+r $(CAROOT)/localhost+4-key.pem

data/mkcert/rootCA.pem:
	@mkcert &> /dev/null || { echo "'mkcert' not found in $$PATH, pleas install it: https://github.com/FiloSottile/mkcert#installation"; exit 1; }
	mkcert -install
	@echo "Do not forget to uninstall the mkcert rootCA once done with development!"
	@echo "  CAROOT=$(CAROOT) mkcert -uninstall"

test:
	cd tests; \
	poetry install; \
	poetry run pytest --gherkin-terminal-reporter -vvv;