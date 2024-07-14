FROM ubuntu:22.04

VOLUME [ "/app/src" ]
EXPOSE 8080

# INSTALL DEPENDENCIES

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    python3 \
    python3-pip \
    git \
    build-essential \
    curl wget \
    pkg-config autoconf automake bison flex gcc libelf-dev make \
    texinfo libncurses5-dev patch python3 subversion wget zlib1g-dev \
    libtool libtool-bin python3-dev bzip2 libgmp3-dev g++ libssl-dev clang \
    python-is-python3 python-dev-is-python3 cmake tar \
    ninja-build apt-transport-https clangd

### Install gbdk

WORKDIR /opt/
RUN wget https://github.com/gbdk-2020/gbdk-2020/releases/download/4.3.0/gbdk-linux64.tar.gz
RUN tar -xvf gbdk-linux64.tar.gz -C /opt/
RUN rm /opt/gbdk-linux64.tar.gz

ENV PATH="$PATH:/opt/gbdk/bin/"
ENV GBDK_HOME="/opt/gbdk/"

# ENV key=value

### Bootstrap code server

RUN curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh
RUN bash /tmp/nodesource_setup.sh
RUN apt-get install -y nodejs
RUN npm install --global --unsafe-perm code-server

RUN mkdir -p /root/.config/code-server/
RUN bash -c 'echo bind-addr: 0.0.0.0:8080' > /root/.config/code-server/config.yaml
RUN bash -c 'echo auth: none' >> /root/.config/code-server/config.yaml


WORKDIR /app/

RUN mkdir -p /app/.vscode

COPY ultimate-homebrew-extensions-0.0.11.vsix /root/.config/code-server/ultimate-homebrew-extensions-0.0.11.vsix
RUN cd /root/.config/code-server/ && code-server --install-extension ultimate-homebrew-extensions-0.0.11.vsix --force

WORKDIR /app/

CMD [ "/usr/bin/code-server","--disable-workspace-trust","/app/" ]