docker run --rm -d --name httpd-wakfu-autobuild -p 10080:80 -v "$PWD"/dest/build:/usr/local/apache2/htdocs/ httpd