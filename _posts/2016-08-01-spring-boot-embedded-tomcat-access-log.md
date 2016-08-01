---
layout: post
title: Spring-Boot embedded tomcat 에 access log 설정 하기
categories: [spring-boot, java, tomcat]
comments: true
image:
---

Embedded tomcat을 사용하는 Spring-Boot 프로젝트에서 Access log를 설정하는 방법

##### application.properties 설정
{% highlight properties %}
# Access Log (Embeded Tomcat)       
server.tomcat.accesslog.pattern=%{yyyy-MM-dd HH:mm:ss}t\t%s\t%r\t%{User-Agent}i\t%{Referer}i\t%a\t%b   
server.tomcat.accesslog.enabled=true   
server.tomcat.basedir=.   
{% endhighlight %}


  * 생성되는 파일 예제
{% highlight properties %}
access_log.2016-08-01.log   
{% endhighlight %}

  * 파일 내용 예제
{% highlight text %}
2016-08-01 09:54:56        200      GET /favicon.ico HTTP/1.1 Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.97 Safari/537.36    http://localhost:8880/click?appId=ABBC10E8E1F81E4AF16B98BDF12E7C3C14697712660000&telCo=2&profileId=1&clientTm=12312312&clientStore=aaaa&productId=pppid&packageName=123123  0:0:0:0:0:0:0:1      946
{% endhighlight %}


##### Pattern Reference
아래 항목은 미리 설정된 값으로 Logging 시에 해당 값으로 변환되어 저장 된다.

  * %a - Remote IP address
  * %A - Local IP address
  * %b - Bytes sent, excluding HTTP headers, or '-' if no bytes were sent
  * %B - Bytes sent, excluding HTTP headers
  * %h - Remote host name (or IP address if enableLookups for the connector is false)
  * %H - Request protocol
  * %l - Remote logical username from identd (always returns '-')
  * %m - Request method
  * %p - Local port
  * %q - Query string (prepended with a '?' if it exists, otherwise an empty string
  * %r - First line of the request
  * %s - HTTP status code of the response
  * %S - User session ID
  * %t - Date and time, in Common Log Format format
  * %u - Remote user that was authenticated
  * %U - Requested URL path
  * %v - Local server name
  * %D - Time taken to process the request, in millis
  * %T - Time taken to process the request, in seconds
  * %I - current Request thread name (can compare later with stacktraces)

추가 적으로 Header 나 Cookie등에서 특정 정보를 취득할 수 도 있다.

{% highlight text %}
common - %h %l %u %t "%r" %s %b   
combined - %h %l %u %t "%r" %s %b **"%{Referer}i"** **"%{User-Agent}i"**
{% endhighlight %}

  * %{xxx}i Request Header 내의 정보
  * %{xxx}o Response Header 내의 정보
  * %{xxx}c 특정 Cookie 내용
  * %{xxx}r ServletRequest 의 특정 attribute
  * %{xxx}s HttpSession 의 특정 attribute
  * %{xxx}t DateFormat을 출력하기 위한 옵션

##### Links
  * [https://tomcat.apache.org/tomcat-7.0-doc/api/org/apache/catalina/valves/AccessLogValve.html]()

<!--more-->
