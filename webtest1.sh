#!/bin/bash

docker build -t webtest1 .

docker rm -f website_soggy

docker run --restart unless-stopped --name website_soggy -d -p 8080:80 webtest1
