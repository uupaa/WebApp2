FROM nginx
MAINTAINER uupaa

COPY conf/webapp2-nginx.conf  /etc/nginx/nginx.conf
COPY conf/webapp2-server.crt  /etc/nginx/webapp2-server.crt
COPY conf/webapp2-server.key  /etc/nginx/webapp2-server.key

EXPOSE 443
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

