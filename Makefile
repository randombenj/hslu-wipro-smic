docker:
	podman build . -f api/Dockerfile -t randombenj/hslu-wipro-smic-api
	podman build . -f dataingress/Dockerfile -t randombenj/hslu-wipro-smic-dataingress
	podman build . -f web/Dockerfile -t randombenj/hslu-wipro-smic-web