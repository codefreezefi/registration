FROM ubuntu:22.04 AS base   

ENV DEBIAN_FRONTEND=noninteractive

RUN <<EOT
    apt-get -y update
    apt-get -y upgrade
    apt-get -y install inkscape fonts-alegreya-sans 
    apt-get -y clean
    rm -rf /var/lib/apt/lists/*
EOT

