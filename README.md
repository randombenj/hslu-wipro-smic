# WIPRO @ HSLU

Wipro Work of Jonas & Benj "Smart Meter Into the ☁!"

## Usage

As a prerequisite you need to install two things:

- [podman](https://podman.io/getting-started/installation): For build, deploy and running
- [mkcert](https://github.com/FiloSottile/mkcert#installation): To generate local tls certificates

If you want to use local versions of the containers, you
can build them by running:

```sh
# optional, only needed if the containers shall be built locally
make docker

# requires mkcert installation
make run
```
