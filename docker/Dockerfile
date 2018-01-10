FROM php:7.1-apache

ENV TZ=Europe/Moscow

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
	echo $TZ > /etc/timezone && \
	echo "date.timezone = $TZ" > $PHP_INI_DIR/conf.d/timezone.ini

RUN apt update
RUN apt install -y \
	zlib1g-dev \
	libfreetype6-dev \
	libjpeg62-turbo-dev \
    libpng12-dev \
	libpng-dev \
	libpq-dev \
    libbz2-dev \
    libxslt1-dev

RUN pecl install -o -f xdebug
RUN	rm -rf /tmp/pear
RUN docker-php-ext-enable xdebug
RUN	docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/
RUN	docker-php-ext-install -j$(nproc) bcmath zip gd xsl

COPY xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

COPY 000-default.conf /etc/apache2/sites-available

RUN a2enmod proxy
RUN a2enmod proxy_http
RUN a2enmod rewrite
