#   docker build -t jb/nginx-openssl-http2 .
FROM debian:jessie

MAINTAINER Jerry Bendy <jerry@icewingcc.com>

# 拷贝源码
COPY nginx-1.11.4.tar.gz /usr/local/src/nginx-1.11.4.tar.gz
COPY nginx-ct-1.3.1.zip /usr/local/src/nginx-ct.zip
COPY openssl-1.1.0b.tar.gz /usr/local/src/openssl-1.1.0b.tar.gz


RUN apt-get update -y \
    && apt-get install -y build-essential gcc g++ make libpcre3 \
        libpcre3-dev unzip zlib1g zlib1g-dev \

    && cd /usr/local/src \
    && unzip nginx-ct.zip \
    && tar zxf openssl-1.1.0b.tar.gz \
    && tar zxf nginx-1.11.4.tar.gz \
    && cd nginx-1.11.4 \
    && ./configure \
        --add-module=../nginx-ct-1.3.1 \
        --with-openssl=../openssl-1.1.0b \
        --with-http_v2_module \
        --with-http_ssl_module \
        --with-ipv6 \
        --with-http_gzip_static_module \
    && make \
    && make install


WORKDIR /usr/local/nginx/html

EXPOSE 80
EXPOSE 443

CMD ["/usr/local/nginx/sbin/nginx"]
