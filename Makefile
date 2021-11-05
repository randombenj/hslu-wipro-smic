docker:
	podman build . -f api/Dockerfile -t randombenj/hslu-wipro-smic-api
	podman build . -f dataingress/Dockerfile -t randombenj/hslu-wipro-smic-dataingress
	podman build . -f web/Dockerfile -t randombenj/hslu-wipro-smic-web


run:
	podman pod rm -f hslu-wipro-smic || true
	podman play kube deployment/config.yml

test:
	cd tests;\
	poetry install;\
	poetry run pytest --gherkin-terminal-reporter -vvv;