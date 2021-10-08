# WIPRO @ HSLU

Wipro Work of Jonas & Benj "Smart Meter Into the ☁!"

## Usage

To run the application, start the pod with [podman]():

If you want to use local versions of the containers, you
can build them by running:

```sh
podman build . -f api/Dockerfile -t randombenj/hslu-smic-api
podman build . -f dataingress/Dockerfile -t randombenj/hslu-smic-dataingress
```
